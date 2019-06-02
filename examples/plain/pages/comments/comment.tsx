import { NextFC } from "next";
import Router from "next/router";
import Link from "next/link";

import { DynamicParameters } from "../../../../lib";
import routes from "../../routes";

type InitialProps = {
  userId: number;
  commentId: number;
};

const Component: NextFC<InitialProps> = (props: InitialProps) => {
  const userLinkProps = routes["users/user"].getLinkProps({ userId: props.userId });

  return (
    <main>
      <h1>now-next-routes-example</h1>
      <h2>
        /users/user/{props.userId}/comments/{props.commentId}
      </h2>

      <Link {...userLinkProps}>
        <a>Back to user ({props.userId})</a>
      </Link>
    </main>
  );
};

type Query = DynamicParameters<typeof routes["comments/comment"]>;
Component.getInitialProps = ({ query }: { query: Query }) => {
  const userId = Number(query.userId);
  const commentId = Number(query.commentId);

  if (Number.isNaN(userId)) {
    const route = routes["users/users"].getLinkProps({});
    Router.push(route.href, route.as);
  }
  if (Number.isNaN(commentId)) {
    const route = routes["users/user"].getLinkProps({ userId });
    Router.push(route.href, route.as);
  }

  return { userId, commentId };
};

export default Component;
