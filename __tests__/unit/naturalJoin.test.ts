import naturalJoin from "helpers/naturalJoin";

describe("naturalJoin", () => {
  it("returns a plain string unchanged", () => {
    expect(naturalJoin("Nursing")).toBe("Nursing");
  });

  it("returns an empty string for an empty list", () => {
    expect(naturalJoin([])).toBe("");
  });

  it("joins one, two, and three or more items in plain English", () => {
    expect(naturalJoin(["Medicine"])).toBe("Medicine");
    expect(naturalJoin(["Medicine", "Nursing"])).toBe("Medicine and Nursing");
    expect(naturalJoin(["Medicine", "Nursing", "Pharmacy"])).toBe(
      "Medicine, Nursing, and Pharmacy",
    );
  });

  it("formats a list of dates as dates joined with 'and'", () => {
    expect(naturalJoin(["2026-11-18", "2026-11-25"])).toBe(
      "11/18/2026 and 11/25/2026",
    );
  });

  // Known bug: the date check runs `new Date(list[0])`, and V8 parses some
  // ordinary text as a date (e.g. "Nursing 2" -> Feb 1, 2001). A list whose
  // first item looks like that is rendered as dates instead of text.
  // test.failing passes while the bug exists; once naturalJoin is fixed,
  // Jest reports this test so it can be switched to a normal `it`.
  test.failing("does not treat text such as 'Nursing 2' as a date", () => {
    expect(naturalJoin(["Nursing 2", "Pharmacy"])).toBe("Nursing 2 and Pharmacy");
  });
});
