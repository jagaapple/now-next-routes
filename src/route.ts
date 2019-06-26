import { createStringWithLeadingSlash } from "./utilities";

type Settings = {
  /** A page file path in `/pages` directory of Next.js. */
  page: string;
  /**
   * A mapping path pattern.
   * The format `:parameterName` will be mapped to dynamic parameters.
   */
  pattern: string;
};

type LinkProps<Parameters> = {
  /** A mapped path information. */
  href: {
    /**
     * A base path name.
     * This is a page file path in `/pages` in general.
     */
    pathname: string;
    /** Displayed URL string in web browsers. */
    query: Partial<Parameters>;
  };
  /** A mapped URL. */
  as: string;
};

type Paths = {
  /** A full path which contains a page file path in `/pages` and query string. */
  href: string;
  /** A mapped URL. */
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
  /** Creates a new route which can create props for `<Link>` component of Next.js. */
  constructor(settings: Settings) {
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
  /** Gets props for `<Link>` component of Next.js. */
  getLinkProps(parameters: Parameters): LinkProps<Parameters> {
    const as = this.settings.pattern.split("/").map((segment: string) => {
      if (!segment.startsWith(":")) return segment;

      const parameterName = segment.replace(":", "") as keyof Parameters;
      const parameter = parameters[parameterName];

      return `${parameter}`;
    });

    return {
      href: { query: parameters, pathname: this.pagePath },
      as: createStringWithLeadingSlash(as.join("/")),
    };
  }

  /** Gets a full path and mapped URL. */
  getPaths(parameters: Parameters): Paths {
    const linkProps = this.getLinkProps(parameters);
    const query = linkProps.href.query;
    const queryString = Object.keys(query)
      .reduce((array: string[], key: string) => {
        const value = query[key as keyof Parameters] as number | string | undefined;
        if (value == undefined) return array;

        array.push(`${key}=${value}`);

        return array;
      }, [])
      .join("&");
    const href = queryString ? `${linkProps.href.pathname}?${queryString}` : linkProps.href.pathname;

    return { href, as: linkProps.as };
  }

  /**
   * Creates an object for `routes` propety in `now.json` for ZEIT Now.
   * This method is used in CLI, so **you don't need to use this method in general**.
   */
  createRouteForNow() {
    const regExpRoutePattern = this.settings.pattern.replace(/\//g, "\\/").replace(/:[^\\/]+/g, "([^\\/]+?)");
    const src = `^${regExpRoutePattern}\\/?$`.replace(/(\\\/)+/g, "\\/").replace(/^\^\\\\\/?\$$/, "\\/");
    const queryString = Object.keys(this.requiredParameters)
      .map((key: string, index: number) => {
        const parameterName = key as keyof Parameters;
        const value = `$${index + 1}`;

        return `${parameterName}=${value}`;
      })
      .join("&");
    const pagePathWithoutLeadingSlash = this.pagePath.replace(/^\/+/, "");
    const dest =
      Object.keys(queryString).length > 0 ? `${pagePathWithoutLeadingSlash}?${queryString}` : pagePathWithoutLeadingSlash;

    return { src, dest };
  }
}

export type DynamicParameters<T extends Route> = ReturnType<T["getLinkProps"]>["href"]["query"];
