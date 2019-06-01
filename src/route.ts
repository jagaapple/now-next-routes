import { createStringWithLeadingSlash } from "./utilities";

type Settings = {
  page: string;
  pattern: string;
  as?: string;
};

type LinkProps<Parameters> = {
  href: {
    pathname: string;
    query: Partial<Parameters>;
  };
  as: string;
};

export class Route<Parameters extends object = Record<string, number | string>> {
  // ---------------------------------------------------------------------------------------------------------------------------
  // Variables
  // ---------------------------------------------------------------------------------------------------------------------------
  // Private Variables
  private readonly pagePath: string;
  private readonly settings: Settings;
  private readonly requiredParameters: Partial<Parameters>;

  // ---------------------------------------------------------------------------------------------------------------------------
  // Functions
  // ---------------------------------------------------------------------------------------------------------------------------
  // Constructors
  // ---------------------------------------------------------------------------------------------------------------------------
  constructor(settings: Settings) {
    if (typeof settings !== "object") throw new TypeError("Invalid argument type");

    this.pagePath = createStringWithLeadingSlash(settings.page);
    this.settings = settings;
    this.requiredParameters = this.settings.pattern.split("/").reduce((object: Partial<Parameters>, segment: string) => {
      if (!segment.startsWith(":")) return object;

      const parameterName = segment.replace(":", "") as keyof Parameters;

      object[parameterName] = undefined;

      return object;
    }, {});
  }

  // Public Functions
  // ---------------------------------------------------------------------------------------------------------------------------
  getLinkProps(parameters: Parameters): LinkProps<Parameters> {
    const query = Object.keys(parameters).reduce((object: Partial<Parameters>, key: string) => {
      const parameterName = key as keyof Parameters;
      object[parameterName] = parameters[parameterName];

      return object;
    }, {});
    const as = this.settings.pattern.split("/").map((segment: string) => {
      if (!segment.startsWith(":")) return segment;

      const parameterName = segment.replace(":", "") as keyof Parameters;
      const parameter = parameters[parameterName];

      return `${parameter}`;
    });

    return {
      href: { query, pathname: this.pagePath },
      as: createStringWithLeadingSlash(as.join("/")),
    };
  }

  createRouteForNow() {
    const regExpRoutePattern = this.settings.pattern.replace(/\//g, "\\/").replace(/:[^\\/]+/g, "([^\\/]+?)");
    const src = `^${regExpRoutePattern}\\/?$`;
    const queryString = Object.keys(this.requiredParameters)
      .map((key: string, index: number) => {
        const parameterName = key as keyof Parameters;
        const value = `$${index + 1}`;

        return `${parameterName}=${value}`;
      })
      .join("&");
    const dest = `${this.pagePath}?${queryString}`;

    return { src, dest };
  }
}
