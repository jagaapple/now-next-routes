import Link from "next/link";

import routes from "../routes";

const usersLinkProps = routes["users/users"].getLinkProps({});

const Component = () => (
  <main>
    <h1>now-next-routes-example</h1>
    <h2>/index</h2>

    <ul>
      <li>
        <Link {...usersLinkProps}>
          <a>users</a>
        </Link>
      </li>
    </ul>
  </main>
);

export default Component;
