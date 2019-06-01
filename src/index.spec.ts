import { expect } from "chai";

import { Route } from "./index";
import { Route as OriginalRoute } from "./route";

describe("index.ts", function() {
  it("should export Route", function() {
    expect(Route).to.eq(OriginalRoute);
  });
});
