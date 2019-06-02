import Link from "next/link";

import routes from "../../routes";
import { UserModel } from "../../models/user";

const users: UserModel[] = [
  { id: 1, name: "smith" },
  { id: 2, name: "johnson" },
  { id: 3, name: "william" },
  { id: 4, name: "jones" },
  { id: 5, name: "brown" },
];

const Component = () => {
  const indexLinkProps = routes["index"].getLinkProps({});
  const userLinkElements = users.map((user: UserModel) => {
    const linkProps = routes["users/user"].getLinkProps({ userId: user.id });

    return (
      <li key={user.id}>
        <Link {...linkProps}>
          <a>
            (id: {user.id}) {user.name}
          </a>
        </Link>
      </li>
    );
  });

  return (
    <main>
      <h1>now-next-routes-example</h1>
      <h2>/users</h2>

      <ul>{userLinkElements}</ul>

      <Link {...indexLinkProps}>
        <a>Back to index</a>
      </Link>
    </main>
  );
};

export default Component;
