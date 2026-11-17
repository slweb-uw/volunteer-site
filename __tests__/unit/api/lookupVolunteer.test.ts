import handler from "pages/api/lookup-volunteer";
import { mockReq, mockRes } from "./mockHttp";

const mockAuth = {
  verifyIdToken: jest.fn(),
  getUser: jest.fn(),
  getUserByEmail: jest.fn(),
};
jest.mock("../../../firebaseAdmin", () => ({
  firebaseAdmin: { auth: () => mockAuth },
}));

function authError(code: string) {
  return Object.assign(new Error(code), { code });
}

beforeEach(() => {
  jest.resetAllMocks();
  mockAuth.verifyIdToken.mockResolvedValue({ uid: "actor" });
  mockAuth.getUser.mockResolvedValue({ customClaims: { role: "lead" } });
  mockAuth.getUserByEmail.mockResolvedValue({ uid: "target", email: "v@uw.edu" });
});

async function call(req = mockReq({ token: "t", body: { email: "v@uw.edu" } })) {
  const res = mockRes();
  await handler(req, res);
  return res;
}

describe("POST /api/lookup-volunteer", () => {
  it("rejects other methods and advertises POST", async () => {
    const res = await call(mockReq({ method: "GET", token: "t" }));
    expect(res.statusCode).toBe(405);
    expect(res.headersSet.Allow).toBe("POST");
  });

  it("returns 401 without a token or with an invalid session", async () => {
    expect((await call(mockReq({ body: { email: "v@uw.edu" } }))).statusCode).toBe(401);
    mockAuth.verifyIdToken.mockRejectedValue(new Error("revoked"));
    expect((await call()).statusCode).toBe(401);
  });

  it("checks revocation when verifying the token", async () => {
    await call();
    expect(mockAuth.verifyIdToken).toHaveBeenCalledWith("t", true);
  });

  it("returns 403 for users who are neither admin nor lead", async () => {
    mockAuth.getUser.mockResolvedValue({ customClaims: { role: "volunteer" } });
    expect((await call()).statusCode).toBe(403);
    mockAuth.getUser.mockResolvedValue({ customClaims: undefined });
    expect((await call()).statusCode).toBe(403);
    expect(mockAuth.getUserByEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for a blank email", async () => {
    expect((await call(mockReq({ token: "t", body: { email: "   " } }))).statusCode).toBe(400);
  });

  it("trims and lowercases the email before looking it up", async () => {
    const res = await call(mockReq({ token: "t", body: { email: "  V@UW.edu " } }));
    expect(mockAuth.getUserByEmail).toHaveBeenCalledWith("v@uw.edu");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ uid: "target", email: "v@uw.edu" });
  });

  it("maps Firebase errors to clear status codes", async () => {
    mockAuth.getUserByEmail.mockRejectedValue(authError("auth/user-not-found"));
    expect((await call()).statusCode).toBe(404);
    mockAuth.getUserByEmail.mockRejectedValue(authError("auth/invalid-email"));
    expect((await call()).statusCode).toBe(400);
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockAuth.getUserByEmail.mockRejectedValue(authError("auth/internal-error"));
    expect((await call()).statusCode).toBe(500);
    spy.mockRestore();
  });
});
