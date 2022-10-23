import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import * as React from "react";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useHistory, useParams } from "react-router-dom";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function UserMenu() {
  const params = useParams<{ workspaceId: string; retroId: string }>();
  const history = useHistory();

  const backToDashboard = () => history.push(`/workspaces/${params.workspaceId}`);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex rounded-full bg-white text-sm">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-blue rounded-md bg-white border border-blue shadow-blue ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm">tom@example.com</p>
            <p className="truncate text-sm font-medium text-gray">facilitator</p>
          </div>
          {/* <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/"
                  className={classNames(
                    active ? "bg-blue opacity-50 text-white" : "text-black",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Account settings
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/"
                  className={classNames(
                    active ? "bg-blue opacity-50 text-white" : "text-black",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Account settings
                </a>
              )}
            </Menu.Item>
          </div> */}
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={backToDashboard}
                  className={classNames(
                    active ? "bg-blue opacity-50 text-white" : "text-gray",
                    "inline-flex items-center w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" /> Exit to dashboard
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
