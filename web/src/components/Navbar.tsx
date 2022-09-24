import React from "react";
import { Link, useHistory } from "react-router-dom";
import { animated, useTransition } from "react-spring";
import { Button } from "./Button";
import { RetroPinkLogo } from "./RetroPinkLogo";
import { useCurrentUser } from "../hooks/use-current-user";
import {
  getRootUrlForWorkspace,
  getWorkspaceFromCurrentUser
} from "../utils/workspace-utils";
import { AnalyticsEvent, useAnalyticsEvent } from "../hooks/use-analytics-event";
import { UserAvatar } from "./UserAvatar";
import { useGetWorkspace } from "../hooks/use-get-workspace";
import isEmpty from "lodash/isEmpty";

export const Navbar: React.FC<any> = ({ isLoggedIn }) => {
  return (
    <nav className="navbar flex flex-wrap justify-between items-baseline sm:mb-1 lg:mb-16">
      <div className="flex flex-wrap items-center justify-between w-full">
        <div className="flex flex-wrap items-center">
          <NavbarBrand />
          {isLoggedIn ? (
            <div className="ml-8">
              <NavbarAuthLinks />
            </div>
          ) : (
            <div className="ml-8">
              <NavbarNoAuthLinks />
            </div>
          )}
        </div>
        <div>
          {!isLoggedIn ? (
            <div className="flex flex-col">
              <NavbarLoggedOutButtons />
            </div>
          ) : (
            <CurrentUserBadge />
          )}
        </div>
      </div>
    </nav>
  );
};

function CurrentUserBadge() {
  const currentUser = useCurrentUser();
  const workspace = useGetWorkspace();

  const currentUserData = currentUser.data;
  const workspaceUsers = workspace?.users;

  if (
    !currentUserData ||
    isEmpty(currentUserData) ||
    !workspaceUsers ||
    isEmpty(workspaceUsers)
  ) {
    return null;
  }

  return (
    <div
      key={currentUserData.id}
      className="relative flex items-center bg-white px-3 py-2 text-blue border shadow"
    >
      <div className="flex-shrink-0">
        <UserAvatar
          photoURL={currentUserData.photoUrl as string | undefined}
          displayName={currentUserData.displayName}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="text-sm font-medium">{currentUser.data?.displayName}</p>
          <p className="truncate text-xs text-gray">
            {workspace?.users[currentUserData.id].userRole === "owner"
              ? "admin"
              : "member"}
          </p>
        </div>
      </div>
    </div>
  );
}

function NavbarLoggedOutButtons() {
  const history = useHistory();
  const trackEvent = useAnalyticsEvent();
  const handleClickSignup = () => {
    trackEvent(AnalyticsEvent.SIGNUP_BUTTON_CLICKED, {
      location: "navbar",
      buttonCopy: "Sign Up for free"
    });
    history.push("/signup");
    return;
  };
  const handleClickLogin = () => {
    trackEvent(AnalyticsEvent.LOGIN_BUTTON_CLICKED, {
      location: "navbar",
      buttonCopy: "Log in"
    });
    history.push("/login");
    return;
  };

  return (
    <React.Fragment>
      <Button className="text-blue mt-8 md:mt-0" onClick={handleClickSignup}>
        Sign up for free
      </Button>
      <Button className="mt-2 mb-4 text-blue" onClick={handleClickLogin}>
        Log in
      </Button>
    </React.Fragment>
  );
}

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
        </div>
      </Link>
    </div>
  );
};

const NavbarNoAuthLinks = () => {
  return (
    <ul className="flex text-blue text-sm">
      <Link className="px-2 hover:underline" to="/pricing">
        Pricing
      </Link>
      <Link className="px-2 hover:underline" to="/faq">
        FAQ
      </Link>
    </ul>
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
