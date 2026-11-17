import sanitizeHtmlRichText from "helpers/sanitizeHtmlRichText";

// Rich text is rendered with dangerouslySetInnerHTML (components/richTextField),
// so this sanitizer is the only thing standing between stored HTML and the page.
const SAFE_LINK_ATTRS = 'rel="noopener noreferrer nofollow" target="_blank"';

describe("sanitizeHtmlRichText", () => {
  it("keeps the formatting the editor produces", () => {
    const html =
      "<p><strong>bold</strong> <em>italic</em> <u>under</u> <s>strike</s></p>" +
      "<ul><li>one</li></ul><ol><li>two</li></ol><p>line<br />break</p>";
    expect(sanitizeHtmlRichText(html)).toBe(html);
  });

  it("removes script tags and their contents", () => {
    expect(sanitizeHtmlRichText("<p>hi</p><script>alert(1)</script>")).toBe("<p>hi</p>");
  });

  it("removes event-handler attributes", () => {
    expect(sanitizeHtmlRichText('<p onclick="alert(1)">hi</p>')).toBe("<p>hi</p>");
  });

  it("drops tags the editor never produces, keeping their text", () => {
    expect(sanitizeHtmlRichText("<h1>Title</h1><div>body</div>")).toBe("Titlebody");
  });

  it("keeps a link that has an allowed scheme and the required rel and target", () => {
    const link = `<a href="https://example.org" ${SAFE_LINK_ATTRS}>site</a>`;
    expect(sanitizeHtmlRichText(link)).toBe(link);
  });

  it("removes javascript: links entirely", () => {
    expect(
      sanitizeHtmlRichText(`<a href="javascript:alert(1)" ${SAFE_LINK_ATTRS}>x</a>`),
    ).toBe("");
  });

  it("removes links with no scheme or a protocol-relative URL", () => {
    expect(sanitizeHtmlRichText(`<a href="example.org" ${SAFE_LINK_ATTRS}>x</a>`)).toBe("");
    expect(sanitizeHtmlRichText(`<a href="//example.org" ${SAFE_LINK_ATTRS}>x</a>`)).toBe("");
  });

  it("removes links missing the required rel or target", () => {
    expect(sanitizeHtmlRichText('<a href="https://example.org" target="_blank">x</a>')).toBe("");
    expect(
      sanitizeHtmlRichText('<a href="https://example.org" rel="noopener noreferrer nofollow">x</a>'),
    ).toBe("");
  });

  it("allows only text-align styles on paragraphs", () => {
    expect(sanitizeHtmlRichText('<p style="text-align:center">x</p>')).toBe(
      '<p style="text-align:center">x</p>',
    );
    expect(sanitizeHtmlRichText('<p style="color:red">x</p>')).toBe("<p>x</p>");
  });
});
