import handler from "pages/api/reconcile-role";
import { mockReq, mockRes } from "./mockHttp";

const mockAuth = {
  verifyIdToken: jest.fn(),
  setCustomUserClaims: jest.fn(),
};
// Which pre-assignment collections contain the signed-in user's email.
let mockListedIn: string[] = [];
const mockFirestore = {
  collection: jest.fn((name: string) => ({
    where: () => ({
      limit: () => ({
        get: async () => ({ empty: !mockListedIn.includes(name) }),
      }),
    }),
  })),
};
jest.mock("../../../firebaseAdmin", () => ({
  firebaseAdmin: { auth: () => mockAuth, firestore: () => mockFirestore },
}));

const USER = { uid: "u1", email: "person@gmail.com", email_verified: true };

beforeEach(() => {
  jest.clearAllMocks();
  mockListedIn = [];
  mockAuth.verifyIdToken.mockResolvedValue(USER);
  mockAuth.setCustomUserClaims.mockResolvedValue(undefined);
});

async function call(req = mockReq({ token: "t" })) {
  const res = mockRes();
  await handler(req, res);
  return res;
}

describe("POST /api/reconcile-role", () => {
  it("rejects methods other than POST", async () => {
    expect((await call(mockReq({ method: "GET", token: "t" }))).statusCode).toBe(405);
  });

  it("returns 401 without a token or with an invalid one", async () => {
    expect((await call(mockReq({}))).statusCode).toBe(401);
    mockAuth.verifyIdToken.mockRejectedValue(new Error("bad"));
    expect((await call()).statusCode).toBe(401);
  });

  it("returns 403 until the email is verified", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ ...USER, email_verified: false });
    expect((await call()).statusCode).toBe(403);
    expect(mockAuth.setCustomUserClaims).not.toHaveBeenCalled();
  });

  it("applies a pre-assigned role", async () => {
    mockListedIn = ["Leads"];
    const res = await call();
    expect(res.body).toEqual({ role: "lead" });
    expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith("u1", { role: "lead", authorized: true });
  });

  it("uses the highest-priority role when listed in several collections", async () => {
    mockListedIn = ["Volunteers", "Admins"];
    expect((await call()).body).toEqual({ role: "admin" });
  });

  it("authorizes @uw.edu users with no pre-assigned role", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ ...USER, email: "Student@UW.EDU" });
    const res = await call();
    expect(res.body).toEqual({ role: null, authorized: true });
    expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith("u1", { role: null, authorized: true });
  });

  it("leaves other users unauthorized", async () => {
    const res = await call();
    expect(res.body).toEqual({ role: null, authorized: false });
    expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith("u1", { role: null, authorized: false });
  });
});
