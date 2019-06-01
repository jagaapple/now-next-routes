import { expect } from "chai";

import { Route } from "./route";

describe("Route", function() {
  const example = it;

  // ---------------------------------------------------------------------------------------------------------------------------
  // Route.prototype.getLinkProps
  // ---------------------------------------------------------------------------------------------------------------------------
  describe("Route.prototype.getLinkProps", function() {
    it('should return given parameters as "href.query"', function() {
      const page = "/samples/sample";
      const pattern = "/dummies/:dummyId/samples/:sampleId";
      const route = new Route<{ dummyId: number; sampleId: number }>({ page, pattern });
      const parameters = { dummyId: 123, sampleId: 456 };
      const linkProps = route.getLinkProps(parameters);

      expect(linkProps.href.query).to.eql(parameters);
    });

    it('should return page given to constructor as "href.pathname"', function() {
      const page = "/dummies/dummies";
      const pattern = "/dummies";
      const route = new Route({ page, pattern });
      const linkProps = route.getLinkProps({});

      expect(linkProps.href.pathname).to.eq(page);
    });

    context("when a setting's pattern have dynamic parameters not sequentially,", function() {
      it('should return an actual URL mapped parameters as "as"', function() {
        const page = "/samples/sample";
        const pattern = "/dummies/:dummyId/samples/:sampleId";
        const route = new Route<{ dummyId: number; sampleId: number }>({ page, pattern });
        const parameters = { dummyId: 123, sampleId: 456 };
        const linkProps = route.getLinkProps(parameters);

        expect(linkProps.as).to.eq(`/dummies/${parameters.dummyId}/samples/${parameters.sampleId}`);
      });
    });

    context("when a setting's pattern does not have dynamic parameters,", function() {
      it('should return the pattern as "as"', function() {
        const page = "/dummies/dummies";
        const pattern = "/dummies";
        const route = new Route({ page, pattern });
        const linkProps = route.getLinkProps({});

        expect(linkProps.as).to.eq(pattern);
      });
    });

    context("when a setting's pattern have dynamic parameters sequentially,", function() {
      it('should return an actual URL mapped parameters as "as"', function() {
        const page = "/samples/sample";
        const pattern = "/dummies/:dummyId/:sampleId";
        const route = new Route<{ dummyId: number; sampleId: number }>({ page, pattern });
        const parameters = { dummyId: 123, sampleId: 456 };
        const linkProps = route.getLinkProps(parameters);

        expect(linkProps.as).to.eq(`/dummies/${parameters.dummyId}/${parameters.sampleId}`);
      });
    });
  });

  // ---------------------------------------------------------------------------------------------------------------------------
  // Route.prototype.createRouteForNow
  // ---------------------------------------------------------------------------------------------------------------------------
  describe("Route.prototype.createRouteForNow", function() {
    const replacePattern = "([^\\/]+?)";
    const endPattern = "\\/?$";

    example('a returned "src" should start with "^"', function() {
      const page = "/dummies/dummies";
      const pattern = "/dummies";
      const route = new Route({ page, pattern });
      const routeForNow = route.createRouteForNow();

      expect(routeForNow.src.startsWith("^")).to.be.true;
    });

    example(`a returned "src" should end with "\\\\/?$"`, function() {
      const page = "/dummies/dummies";
      const pattern = "/dummies";
      const route = new Route({ page, pattern });
      const routeForNow = route.createRouteForNow();

      expect(routeForNow.src.endsWith(endPattern)).to.be.true;
    });

    context("when a setting's pattern have dynamic parameters not sequentially,", function() {
      it(`should replace dynamic parameters with "([^\\\\/]+?)" and return the replaced string as "src"`, function() {
        const page = "/samples/sample";
        const pattern = "/dummies/:dummyId/samples/:sampleId";
        const route = new Route<{ dummyId: number; sampleId: number }>({ page, pattern });
        const routeForNow = route.createRouteForNow();

        expect(routeForNow.src).to.eq(`^\\/dummies\\/${replacePattern}\\/samples\\/${replacePattern}${endPattern}`);
      });
    });

    context("when a setting's pattern have dynamic parameters sequentially,", function() {
      it(`should replace dynamic parameters with "([^\\\\/]+?)" and return the replaced string as "src"`, function() {
        const page = "/samples/sample";
        const pattern = "/dummies/:dummyId/:sampleId";
        const route = new Route<{ dummyId: number; sampleId: number }>({ page, pattern });
        const routeForNow = route.createRouteForNow();

        expect(routeForNow.src).to.eq(`^\\/dummies\\/${replacePattern}\\/${replacePattern}${endPattern}`);
      });
    });

    context('when a setting\'s pattern is "/",', function() {
      it('should be "^\\\\/?$"', function() {
        const page = "/index";
        const pattern = "/";
        const route = new Route({ page, pattern });
        const routeForNow = route.createRouteForNow();

        expect(routeForNow.src).to.eq(`^${endPattern}`);
      });
    });

    context("when a setting's pattern does not have dynamic parameters,", function() {
      it('should return page given to constructor as "dest"', function() {
        const page = "/dummies/dummies";
        const pattern = "/dummies/dummies/dummies";
        const route = new Route({ page, pattern });
        const routeForNow = route.createRouteForNow();

        expect(routeForNow.dest).to.eq(page);
      });
    });

    context("when a setting's pattern have one dynamic parameter,", function() {
      it('should return page given to constructor with parameters converted like query string as "dest"', function() {
        const page = "/dummies/dummy";
        const pattern = "/dummies/:dummyId";
        const route = new Route<{ dummyId: number }>({ page, pattern });
        const routeForNow = route.createRouteForNow();

        expect(routeForNow.dest).to.eq(`${page}?dummyId=$1`);
      });
    });

    context("when a setting's pattern have two or more dynamic parameter,", function() {
      it('should return page given to constructor with parameters converted like query string as "dest"', function() {
        const page = "/samples/sample";
        const pattern = "/dummies/:dummyId/samples/:sampleId";
        const route = new Route<{ dummyId: number; sampleId: number }>({ page, pattern });
        const routeForNow = route.createRouteForNow();

        expect(routeForNow.dest).to.eq(`${page}?dummyId=$1&sampleId=$2`);
      });
    });
  });
});
