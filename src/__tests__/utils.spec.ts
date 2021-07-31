import { createMarkdownLink } from "../utils";

describe("create markdown link", () => {
  it("ok", () => {
    const actual = createMarkdownLink("test", "https://example.com");
    expect(actual).toBe("![test](https://example.com)");
  });
});
