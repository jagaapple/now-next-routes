import { NextFC } from "next";
import Router from "next/router";
import Link from "next/link";

import routes from "../../routes";
import { CommentModel } from "../../models/comment";

const comments: CommentModel[] = [
  { id: 1, body: "Hello." },
  { id: 2, body: "Good morning." },
  { id: 3, body: "Good evening." },
  { id: 4, body: "Good night." },
  { id: 5, body: "Good bye." },
];

type InitialProps = {
  userId: number;
};

const Component: NextFC<InitialProps> = (props: InitialProps) => {
  const usersLinkProps = routes["users/users"].getLinkProps({});
  const commentLinkElements = comments.map((comment: CommentModel) => {
    const linkProps = routes["comments/comment"].getLinkProps({ userId: props.userId, commentId: comment.id });

    return (
      <li key={comment.id}>
        <Link {...linkProps}>
          <a>
            (id: {comment.id}) {comment.body}
          </a>
        </Link>
      </li>
    );
  });

  return (
    <main>
      <h1>now-next-routes-example</h1>
      <h2>/users/user/{props.userId}</h2>

      <ul>{commentLinkElements}</ul>

      <Link {...usersLinkProps}>
        <a>Back to users</a>
      </Link>
    </main>
  );
};

type Query = ReturnType<typeof routes["users/user"]["getLinkProps"]>["href"]["query"];
Component.getInitialProps = ({ query }: { query: Query }) => {
  const userId = Number(query.userId);

  const route = routes["users/users"].getLinkProps({});
  if (Number.isNaN(userId)) Router.push(route.href, route.as);

  return { userId };
};

export default Component;
