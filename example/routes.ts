import { Route } from "../lib";

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
