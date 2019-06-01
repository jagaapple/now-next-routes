import { expect } from "chai";

import { createStringWithLeadingSlash } from "./utilities";

describe("createStringWithLeadingSlash", function() {
  context("when an original text does not have trailing slash,", function() {
    it("should return a text with leading slash", function() {
      const originalText = "dummy";

      expect(createStringWithLeadingSlash(originalText)).to.eq(`/${originalText}`);
    });
  });

  context("when an original text has one trailing slash,", function() {
    it("should return an original text", function() {
      const originalText = "/dummy";

      expect(createStringWithLeadingSlash(originalText)).to.eq(originalText);
    });
  });

  context("when an original text has two or more trailing slash,", function() {
    it("should return a text with one leading slash", function() {
      const originalTextWithoutTrailingSlash = "dummy";
      const originalText = `///${originalTextWithoutTrailingSlash}`;

      expect(createStringWithLeadingSlash(originalText)).to.eq(`/${originalTextWithoutTrailingSlash}`);
    });
  });
});
