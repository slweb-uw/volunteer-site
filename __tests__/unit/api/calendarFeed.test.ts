import type { NextApiRequest } from "next";
import handler from "../../../pages/api/calendar/[location]";
import { mockRes } from "./mockHttp";

// Firestore stand-in: the feed runs one query and reads `.docs`.
let docs: { id: string; data: () => Record<string, unknown> }[] = [];
const get = jest.fn(async () => ({ docs }));
const whereCalls: unknown[][] = [];
const query: any = {
  where: (...args: unknown[]) => {
    whereCalls.push(args);
    return query;
  },
  get: () => get(),
};

jest.mock("../../../firebaseAdmin", () => ({
  firebaseAdmin: { firestore: () => ({ collection: () => query }) },
}));

const stamp = (daysFromNow: number) => ({
  toDate: () => new Date(Date.now() + daysFromNow * 86_400_000),
});

const event = (id: string, over: Record<string, unknown> = {}) => ({
  id,
  data: () => ({
    name: `Event ${id}`,
    projectId: "p1",
    projectName: "Project One",
    volunteerTypes: ["Student"],
    address: "1 Main St",
    startTime: "09:00",
    endTime: "11:00",
    leadEmail: "lead@example.edu",
    dates: [stamp(10)],
    ...over,
  }),
});

const req = (query: Record<string, unknown>, method = "GET") =>
  ({
    method,
    query,
    headers: { host: "example.test", "x-forwarded-proto": "https" },
  }) as unknown as NextApiRequest;

beforeEach(() => {
  docs = [];
  whereCalls.length = 0;
  get.mockClear();
});

describe("GET /api/calendar/[location]", () => {
  test("rejects other methods", async () => {
    const res = mockRes();
    await handler(req({ location: "Seattle.ics" }, "POST"), res);
    expect(res.statusCode).toBe(405);
    expect(res.headersSet.Allow).toBe("GET, HEAD");
  });

  test("404s an unknown location without querying Firestore", async () => {
    const res = mockRes();
    await handler(req({ location: "Atlantis.ics" }), res);
    expect(res.statusCode).toBe(404);
    expect(get).not.toHaveBeenCalled();
  });

  test("returns a cached text/calendar feed, accepting the .ics suffix and any case", async () => {
    docs = [event("a")];
    const res = mockRes();
    await handler(req({ location: "seattle.ics" }), res);
    expect(res.statusCode).toBe(200);
    expect(res.headersSet["Content-Type"]).toMatch(/^text\/calendar/);
    expect(res.headersSet["Cache-Control"]).toContain("s-maxage=3600");
    expect(res.body).toContain("BEGIN:VCALENDAR");
    expect(res.body).toContain("SUMMARY:Event a");
    expect(res.body).toContain("DTSTART:");
  });

  test("queries by location and month keys", async () => {
    await handler(req({ location: "Seattle.ics" }), mockRes());
    expect(whereCalls[0]).toEqual(["location", "==", "Seattle"]);
    expect(whereCalls[1][0]).toBe("calendar");
    expect(whereCalls[1][1]).toBe("array-contains-any");
    expect((whereCalls[1][2] as string[]).length).toBeLessThanOrEqual(30);
  });

  test("never exposes a lead email", async () => {
    docs = [event("a")];
    const res = mockRes();
    await handler(req({ location: "Seattle.ics" }), res);
    expect(res.body).not.toContain("lead@example.edu");
  });

  test("filters by project and by volunteer type", async () => {
    docs = [
      event("a", { projectId: "p1", volunteerTypes: ["Student"] }),
      event("b", { projectId: "p2", volunteerTypes: ["Provider"] }),
      event("c", { projectId: "p2", volunteerTypes: ["Student", "Provider"] }),
    ];
    const byProject = mockRes();
    await handler(req({ location: "Seattle.ics", project: "p2" }), byProject);
    expect(byProject.body).not.toContain("Event a");
    expect(byProject.body).toContain("Event b");
    expect(byProject.body).toContain("Event c");

    const byType = mockRes();
    await handler(req({ location: "Seattle.ics", project: "p2", type: "Student" }), byType);
    expect(byType.body).not.toContain("Event b");
    expect(byType.body).toContain("Event c");
  });

  test("leaves out archived events and events outside the window", async () => {
    docs = [
      event("kept"),
      event("archived", { archived: true }),
      event("old", { dates: [stamp(-90)] }),
      event("far", { dates: [stamp(500)] }),
    ];
    const res = mockRes();
    await handler(req({ location: "Seattle.ics" }), res);
    expect(res.body).toContain("Event kept");
    expect(res.body).not.toContain("Event archived");
    expect(res.body).not.toContain("Event old");
    expect(res.body).not.toContain("Event far");
  });

  test("a Firestore failure is a 500, not a crash", async () => {
    get.mockRejectedValueOnce(new Error("boom"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const res = mockRes();
    await handler(req({ location: "Seattle.ics" }), res);
    expect(res.statusCode).toBe(500);
    spy.mockRestore();
  });
});
