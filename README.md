<h1 align="center">now-next-routes</h1>

<h4 align="center">🔜 Dynamic routes for Next.js on Now 🔙</h4>

```tsx
// /routes.ts
export default {
  "users/user": new Route<{ userId: number }>({ page: "/users/user", pattern: "/users/:userId" }),
  "users/profile": new Route<{ userId: number }>({ page: "/users/profile", pattern: "/users/:userId/profile" }),
};

// /pages/users.tsx
import routes from "./routes.ts";

const userPageLinkProps = routes["users/user"].getLinkProps({ userId: 1 });
export default () => (
  <Link {...userPageLinkProps}>
    <a>Go to the first user page</a>
  </Link>
);

// /now.json
// GENERATED AUTOMATICALLY!!
{
  ...
  "routes": [
    {
      "src": "^\\/users\\/([^\\/]+?)\\/?$",
      "dest": "/users/user?userId=$1"
    },
    {
      "src": "^\\/users\\/([^\\/]+?)\\/profile\\/?$",
      "dest": "/users/profile?userId=$1"
    }
  ]
}
```

<div align="center">
<a href="https://www.npmjs.com/package/now-next-routes"><img src="https://img.shields.io/npm/v/now-next-routes.svg" alt="npm"></a>
<a href="https://circleci.com/gh/jagaapple/now-next-routes"><img src="https://img.shields.io/circleci/project/github/jagaapple/now-next-routes/master.svg" alt="CircleCI"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/jagaapple/now-next-routes.svg" alt="license"></a>
<a href="https://twitter.com/jagaapple_tech"><img src="https://img.shields.io/badge/contact-%40jagaapple_tech-blue.svg" alt="@jagaapple_tech"></a>
</div>

## Table of Contents

<!-- TOC depthFrom:2 -->

- [Table of Contents](#table-of-contents)
- [Features](#features)
  - [Motivation](#motivation)
- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Installation](#installation)
- [Usage](#usage)
  - [Defines routes](#defines-routes)
    - [Arguments of `Route` constructor](#arguments-of-route-constructor)
    - [Gets more type safety](#gets-more-type-safety)
  - [Generates routes for Now](#generates-routes-for-now)
  - [Creates links](#creates-links)
    - [Uses in `Router.push()`](#uses-in-routerpush)
    - [Type safety](#type-safety)
- [Recipes](#recipes)
  - [Gets type safety in a page when handling queries](#gets-type-safety-in-a-page-when-handling-queries)
  - [Preserves original `now.json`](#preserves-original-nowjson)
- [API](#api)
  - [CLI](#cli)
    - [`generate`](#generate)
  - [`Route` Class](#route-class)
    - [`constructor<Parameters>(settings: Settings): Route`](#constructorparameterssettings-settings-route)
    - [`Route.prototype.getLinkProps(parameters: Parameters): LinkProps<Parameters>`](#routeprototypegetlinkpropsparameters-parameters-linkpropsparameters)
    - [`Route.prototype.createRouteForNow(): object`](#routeprototypecreateroutefornow-object)
    - [`DynamicParameters<T extends Route>`](#dynamicparameterst-extends-route)
- [Contributing to now-next-routes](#contributing-to-now-next-routes)
- [License](#license)

<!-- /TOC -->


## Features

| FEATURES                                | WHAT YOU CAN DO                                                 |
|-----------------------------------------|-----------------------------------------------------------------|
| ❤️ **Designed for Next.js and ZEIT Now** | Don't need to manage `routes` property in `now.json`            |
| 🌐 **Build for Serverless**             | Custom servers are not required                                 |
| 📄 **Write once, Manage one file**      | All you need is write routes to one file                        |
| 🎩 **Type Safe**                        | You can get errors when missing required dynamic URL parameters |

### Motivation
Next.js has file-system routing, but it does not provide dynamic routing. In the strict sense, it is possible to implement dynamic
routing if you adopt custom servers such as Express.js. Famous libraries which provide dynamic routes such as
[next-routes](https://github.com/fridays/next-routes) and [nextjs-dynamic-routes](https://github.com/gvergnaud/nextjs-dynamic-routes)
require to use custom servers too.

On the other hand, ZEIT that develops and manages Next.js provides FaaS called [Now](https://zeit.co/now). I definitely think
it is the best way to hosting Next.js apps. Now adopts serverless architecture, so you can deploy Next.js app very easily, all
you need is to write `now.json` with `@now/next` .
[ZEIT recommends to deploy one page on one lambda in order to get benefits of serverless](https://zeit.co/docs/v2/deployments/official-builders/next-js-now-next/#custom-server)
and `@now/next` conforms it automatically. However you need use `@now/node` or `@now/node-server` if you adopt custom servers.
In other words, to use custom servers in Next.js on Now is bad.

The best way is to use no custom servers and set `routes` porperty in `now.json` to your application routes, but it has very low
maintainability because you need to write the same route settings twice and complex regular expressions.

now-next-routes was created in order to resolve these issues. now-next-routes provides a command to craete `routes` property in
`now.json` from a specific route definitions and also provides functions to craete links high type safety.


## Quick Start
### Requirements
- Node.js 8.0.0 or higher
- npm or Yarn


### Installation
```bash
$ npm install --save-dev now-next-routes
```

If you use Yarn, use the following command.

```bash
$ yarn add --dev now-next-routes
```


## Usage
### Defines routes
```ts
// /routes.ts
import { Route } from "now-next-routes";

export default {
  // Index
  index: new Route({ page: "/index", pattern: "/" }),

  // Users
  "users/users": new Route({ page: "/users/users", pattern: "/users" }),
  "users/user": new Route<{ userId: number }>({ page: "/users/user", pattern: "/users/:userId" }),

  // Users - Comments
  "comments/comment": new Route<{ userId: number; commentId: number }>({
    page: "/comments/comment",
    pattern: "/users/:userId/comments/:commentId",
  }),
};
```

First, you need to define routes using now-next-routes. **A point that must be keep in your mind is to export as default value**
using `export default` syntax.

#### Arguments of `Route` constructor
now-next-routes exports `Route` class which provides to create objects for Next.js and Now. A route should be an object which
has a page identifier as key and `Route` object as value.

Currently, a constructor of `Route` accepts an object which has two properties.

- `page: string` ... A page of Next.js. This is a path of files in `/pages` in general.
- `pattern: string` ... An actual URL pattern. Dynamic parameters should follow the format `:parameterName` .

#### Gets more type safety
```ts
new Route<{ userId: number }>({ page: "/users/user", pattern: "/users/:userId" });
```

Also the constructor accepts one generic type. This type is to improve type safety [when you create links with dynamic
parameters](#type-safety). If a route requires dynamic parameters and your project is written by TypeScript, I recommended to
specify.
The type should be an object literal type and properties should be matched dynamic parameters you write in `pattern` .


### Generates routes for Now
now-next-routes also provides a command to generate routes for Now.

```bash
$ npx now-next-routes generate routes.ts
```

`generate` command generates `routes` property of `now.json` from a routes file you created like the following.

```json
{
  "routes": [
    {
      "src": "^\\/?$",
      "dest": "/index"
    },
    {
      "src": "^\\/users\\/?$",
      "dest": "/users/users"
    },
    {
      "src": "^\\/users\\/([^\\/]+?)\\/?$",
      "dest": "/users/user?userId=$1"
    },
    {
      "src": "^\\/users\\/([^\\/]+?)\\/comments\\/([^\\/]+?)\\/?$",
      "dest": "/comments/comment?userId=$1&commentId=$2"
    }
  ]
}
```

If `now.json` exists, this command overwrite `routes` property in it. Otherwise, this command creates `now.json` file.


### Creates links
```tsx
import routes from "./routes.ts";

const userPageLinkProps = routes["users/user"].getLinkProps({ userId: 1 });
const Component = () => (
  <Link {...userPageLinkProps}>
    <a>Go to the first user page</a>
  </Link>
);
```

An object of `Route` class provides `getLinkProps` function. This is to create props of built-in `<Link>` component provided by
Next.js.

Specifically this function returns an object which has `href` and `as` properties. So you can also write like the following.

```tsx
<Link href={userPageLinkProps.href} as={userPageLinkProps.as}>
```

#### Uses in `Router.push()`
`Router.push()` function provided from `next/router` makes you to be possible to move to some pages programmatically. This
function also accepts `href` and `as` values as arguments, so you can give parameters using `getLinkProps()` .

```ts
Router.push(userPageLinkProps.href, userPageLinkProps.as);
```

#### Type safety
now-next-routes is designed by TypeScript. So you can create links type safety from routes you crated [if you gives generic types
when calling constructors](#gets-more-type-safety).

```ts
const userPageLinkProps = routes["users/user"].getLinkProps({ userId: "1" });
                                                              ^^^^^^
                // Type 'string' is not assignable to type 'number'. ts(2322)
```


## Recipes
### Gets type safety in a page when handling queries
```ts
import { DynamicParameters } from "now-next-routes";

type Query = DynamicParameters<typeof routes["users/user"]>;
Component.getInitialProps = (ctx) => {
  const query = ctx as Query;
  const userId = query.user_id;
                       ^^^^^^^
  // Property 'user_id' does not exist on type 'Partial<{ userId: number; }>'.
  // Did you mean 'userId'? ts(2551)

  ...

  return { userId: query.userId };
};
```

`DynamicParameters` type exported by now-next-routes accepts a type of `Route` object. It returns a type of dynamic parameters.
It is helpful for handling queries type safety in `getInitialProps` .

### Preserves original `now.json`
By default, `now-next-routes` overwrites or creates `now.json` file. It is possible to output as other file when you specify
`--input` or `--output` option.

```bash
# Inputs from a template file and outputs as `now.json` .
$ npx now-next-routes generate --input now.sample.json routes.ts

# Inputs from `now.json` and outputs as a specific file name.
$ npx now-next-routes generate --output now-production.json routes.ts
```

If your `now.json` already has custom `routes` property, it is possible to merge generated routes to it and you should use
`--merge` option.


## API
### CLI
```
$ npx now-next-routes --help
Usage: now-next-routes [options] [command]

Options:
  -v, --version                     output the version number
  -h, --help                        output usage information

Commands:
  generate [options] <routes-file>  generate routes for now.json
  *
```

#### `generate`
```
$ npx now-next-routes generate --help                                                                                                                                                                              (06/03 06:45:54)
Usage: generate [options] <routes-file>

generate routes for now.json

Options:
  -i, --input <path>   now.json file path
  -o, --output <path>  an output now.json file path
  -m, --merge          merge into existing "routes" property
  -h, --help           output usage information
```

### `Route` Class
#### `constructor<Parameters>(settings: Settings): Route`
```ts
new Route<{ userId: number }>({ page: "/users/user", pattern: "/users/:userId" });
```

Returns a new object of `Route` class.

- `Parameters` ... A generic type to specify types of dynamic parameters (for TypeScript).
- `settings: Settings`
  - `page: string` ... A page file path in `/pages` directory of Next.js.
  - `pattern: string` ... A mapping path pattern. The format `:parameterName` will be mapped to dynamic parameters.

#### `Route.prototype.getLinkProps(parameters: Parameters): LinkProps<Parameters>`
```ts
route.getLinkProps({ userId: number });
```

Returns `LinkProps<Parameters>` object.

- `Parameters` ... Types of dynamic parameters you gave to constructor (for TypeScript).
- `LinkProps<Parameters>`
  - `href: object`
    - `pathname: string` ... A base path name. This is a page file path in `/pages` in general.
    - `query: Partial<Parameters>` ... Displayed URL string in web browsers.
  - `as: string` ... A mapped URL.

#### `Route.prototype.createRouteForNow(): object`
```ts
route.createRouteForNow();
```

Creates an object for `routes` propety in `now.json` for ZEIT Now. This method is used in CLI, so **you don't need to use this
method in general**.
This method will be changed without any notices.

#### `DynamicParameters<T extends Route>`
```ts
type Parameters = { userId: number };

const route = new Route<Parameters>({ page: "users/user", pattern: "/users/:userId" })
type Query = DynamicParameters<typeof route>; // Partial<{ userId: number }>
```

Returns a type you gave to a constructor of `Route` . A returned type is weak type.


## Contributing to now-next-routes
Bug reports and pull requests are welcome on GitHub at
[https://github.com/jagaapple/now-next-routes](https://github.com/jagaapple/now-next-routes).
This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the
[Contributor Covenant](http://contributor-covenant.org) code of conduct.

Please read [Contributing Guidelines](./.github/CONTRIBUTING.md) before development and contributing.


## License
The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Copyright 2019 Jaga Apple. All rights reserved.
