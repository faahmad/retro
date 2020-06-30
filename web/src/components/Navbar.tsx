import React from "react";
import { Link, useHistory } from "react-router-dom";
import { animated, useTransition } from "react-spring";
import { Button } from "./Button";
import { RetroPinkLogo } from "./RetroPinkLogo";
import { GoogleOAuthButton } from "./GoogleOAuthButton";
import { useLoginWithGoogle } from "../hooks/use-login-with-google";
import { logOut } from "../services/auth-service";
import { useCurrentUser } from "../hooks/use-current-user";
import {
  getRootUrlForWorkspace,
  getWorkspaceFromCurrentUser
} from "../utils/workspace-utils";

export const Navbar: React.FC<any> = ({ isLoggedIn }) => {
  const loginWithGoogle = useLoginWithGoogle();
  const history = useHistory();

  const handleOnLogOut = async () => {
    await logOut();
    history.push("/");
  };

  return (
    <nav className="navbar flex flex-wrap justify-between sm:mb-1 lg:mb-4">
      <div className="flex items-center">
        <NavbarBrand />
        {isLoggedIn && (
          <div className="ml-8">
            <NavbarAuthLinks />
          </div>
        )}
      </div>
      <div className="flex flex-col z-0">
        {isLoggedIn ? (
          <Button
            className="mt-10 sm:mt-0 md:mt-0 lg:mt-0 text-blue text-right"
            onClick={handleOnLogOut}
          >
            Sign Out
          </Button>
        ) : (
          <GoogleOAuthButton
            buttonClassName="text-blue"
            textClassName="justify-end"
            onClick={loginWithGoogle}
          >
            Continue With
          </GoogleOAuthButton>
        )}
      </div>
    </nav>
  );
};

const NavbarBrand: React.FC = () => {
  const currentUser = useCurrentUser();
  const workspace = getWorkspaceFromCurrentUser(currentUser);
  const redirectUrl = currentUser.isLoggedIn
    ? workspace
      ? getRootUrlForWorkspace(workspace)
      : "/onboarding"
    : "/";

  const [boxes, setBoxes] = React.useState<{ key: number }[]>([]);
  React.useEffect(() => {
    let timeoutId: any;
    [...Array(100)].map((_, index) => {
      return (timeoutId = setTimeout(() => {
        setBoxes((prevBoxes) => [...prevBoxes, { key: prevBoxes.length + 1 }]);
      }, 40 * index));
    });

    return () => clearTimeout(timeoutId);
  }, []);
  const transitions = useTransition(boxes, (box) => box.key, {
    from: { transform: "translate3d(0,-40px,0)" },
    enter: { transform: "translate3d(0,0px,0)" },
    leave: { transform: "translate3d(0,-40px,0)" }
  });

  return (
    <div className="mb-10">
      <Link to={redirectUrl}>
        <div className="absolute z-0 grid-logo">
          {transitions.map(({ item, props, key }) => (
            <animated.div key={key} className="grid-logo-box" />
          ))}
        </div>
        <div className="z-0 mt-8 sm:ml-0 lg:ml-5">
          <RetroPinkLogo />
          {!currentUser.isLoggedIn && (
            <p className="text-blue">welcome to new school teamwork.</p>
          )}
        </div>
      </Link>
    </div>
  );
};

const NavbarAuthLinks = () => {
  const currentUser = useCurrentUser();
  const workspace = getWorkspaceFromCurrentUser(currentUser);

  if (!workspace) {
    return null;
  }

  const rootUrl = getRootUrlForWorkspace(workspace);

  return (
    <ul className="flex text-blue text-sm">
      <Link className="px-2 hover:underline" to={rootUrl}>
        Home
      </Link>
      <Link className="px-2 hover:underline" to={`${rootUrl}/settings`}>
        Settings
      </Link>
    </ul>
  );
};
