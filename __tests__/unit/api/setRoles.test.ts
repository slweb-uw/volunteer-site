import handler from "pages/api/set-roles";
import { mockReq, mockRes } from "./mockHttp";

// Accessed lazily (inside arrow functions) so the hoisted jest.mock factory
// never touches these before they are initialized.
const mockAuth = {
  verifyIdToken: jest.fn(),
  getUserByEmail: jest.fn(),
  setCustomUserClaims: jest.fn(),
};
jest.mock("../../../firebaseAdmin", () => ({
  firebaseAdmin: { auth: () => mockAuth },
}));

const ADMIN = { uid: "admin-uid", email_verified: true, role: "admin" };

beforeEach(() => {
  jest.resetAllMocks();
  mockAuth.verifyIdToken.mockResolvedValue(ADMIN);
  mockAuth.getUserByEmail.mockResolvedValue({ uid: "target-uid" });
  mockAuth.setCustomUserClaims.mockResolvedValue(undefined);
});

async function call(req = mockReq({ token: "t", body: { email: "a@uw.edu", role: "lead" } })) {
  const res = mockRes();
  await handler(req, res);
  return res;
}

describe("POST /api/set-roles", () => {
  it("rejects methods other than POST", async () => {
    const res = await call(mockReq({ method: "GET", token: "t" }));
    expect(res.statusCode).toBe(405);
  });

  it("returns 401 without a bearer token", async () => {
    expect((await call(mockReq({}))).statusCode).toBe(401);
    expect((await call(mockReq({ authorization: "Basic abc" }))).statusCode).toBe(401);
  });

  it("returns 401 when the token cannot be verified", async () => {
    mockAuth.verifyIdToken.mockRejectedValue(new Error("expired"));
    expect((await call()).statusCode).toBe(401);
  });

  it("returns 403 for a signed-in user who is not an admin", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ ...ADMIN, role: "lead" });
    expect((await call()).statusCode).toBe(403);
    expect(mockAuth.setCustomUserClaims).not.toHaveBeenCalled();
  });

  it("returns 403 for an admin whose email is not verified", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ ...ADMIN, email_verified: false });
    expect((await call()).statusCode).toBe(403);
  });

  it("returns 400 for a missing email or an unknown role", async () => {
    expect((await call(mockReq({ token: "t", body: { role: "lead" } }))).statusCode).toBe(400);
    expect(
      (await call(mockReq({ token: "t", body: { email: "a@uw.edu", role: "superuser" } }))).statusCode,
    ).toBe(400);
  });

  it("returns 404 when no account exists for the email", async () => {
    mockAuth.getUserByEmail.mockRejectedValue(new Error("auth/user-not-found"));
    expect((await call()).statusCode).toBe(404);
  });

  it("sets the role and marks anyone with a role as authorized", async () => {
    const res = await call(mockReq({ token: "t", body: { email: "someone@gmail.com", role: "volunteer" } }));
    expect(res.statusCode).toBe(200);
    expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith("target-uid", {
      role: "volunteer",
      authorized: true,
    });
  });

  it("removing a role keeps @uw.edu users authorized", async () => {
    await call(mockReq({ token: "t", body: { email: "Student@UW.edu", role: null } }));
    expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith("target-uid", {
      role: null,
      authorized: true,
    });
  });

  it("removing a role from a non-UW user leaves them unauthorized", async () => {
    await call(mockReq({ token: "t", body: { email: "someone@gmail.com", role: null } }));
    expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith("target-uid", {
      role: null,
      authorized: false,
    });
  });
});
