import React from "react";
import { animated, useTransition } from "react-spring";
import { Button } from "./Button";
import { OptimizelyFeature } from "@optimizely/react-sdk";
import { RetroPinkLogo } from "./RetroPinkLogo";

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar flex flex-wrap justify-between sm:mb-1 lg:mb-4">
      <NavbarBrand />
      <NavbarAuthButtons />
    </nav>
  );
};

const NavbarBrand = () => {
  const [boxes, setBoxes] = React.useState<{ key: number }[]>([]);

  React.useEffect(() => {
    let timeoutId: any;
    [...Array(100)].map((_, index) => {
      return (timeoutId = setTimeout(() => {
        setBoxes(prevBoxes => [...prevBoxes, { key: prevBoxes.length + 1 }]);
      }, 40 * index));
    });

    return () => clearTimeout(timeoutId);
  }, []);

  const transitions = useTransition(boxes, box => box.key, {
    from: { transform: "translate3d(0,-40px,0)" },
    enter: { transform: "translate3d(0,0px,0)" },
    leave: { transform: "translate3d(0,-40px,0)" }
  });

  return (
    <div className="mb-10">
      <div className="absolute z-0 grid-logo">
        {transitions.map(({ item, props, key }) => (
          <animated.div key={key} className="grid-logo-box" />
        ))}
      </div>
      <div className="z-10 mt-8 sm:ml-0 lg:ml-5">
        <RetroPinkLogo />
        <p className="text-blue">welcome to new school teamwork.</p>
      </div>
    </div>
  );
};

const NavbarAuthButtons = () => (
  <div className="flex flex-col">
    <OptimizelyFeature feature="navbar_auth_buttons">
      {isEnabled =>
        isEnabled ? (
          <React.Fragment>
            <Button className="text-blue mb-2 text-right" onClick={() => {}}>
              Login
            </Button>
            <Button className="text-blue text-right" onClick={() => {}}>
              <span>Signup With Google</span>
            </Button>
          </React.Fragment>
        ) : (
          <Button className="text-blue mb-2 text-right" onClick={() => {}}>
            Coming Soon
          </Button>
        )
      }
    </OptimizelyFeature>
  </div>
);
