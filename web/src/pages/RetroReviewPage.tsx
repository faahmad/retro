import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { UsersIcon } from "@heroicons/react/solid";

export function RetroReviewPage() {
  return (
    <PageContainer>
      <Stats />
      <Participants />
    </PageContainer>
  );
}

const stats = [
  {
    id: 1,
    name: "Ideas added",
    stat: "12",
    icon: UsersIcon
  },
  {
    id: 2,
    name: "Votes cast",
    stat: "23",
    icon: UsersIcon
  },
  {
    id: 3,
    name: "New actions",
    stat: "5",
    icon: UsersIcon,
    existing: 2
  }
];

export function Stats() {
  return (
    <div>
      <h3 className="text-lg text-blue font-medium leading-6 text-gray-900">Summary</h3>

      <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative text-blue border border-blue overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt className="flex">
              <div className="absolute rounded-md bg-blue p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </dt>
            <dd className="ml-16 pb-6 sm:pb-7">
              {/* <p className="text-2xl font-semibold text-gray-900">{item.stat}</p> */}
              <p className="truncate text-sm font-medium flex items-baseline">
                <span className="text-2xl font-semibold mr-2">{item.stat}</span>
                {item.name}
              </p>
              {item.existing && (
                <p className="text-sm font-medium text-gray-500">
                  {item.existing} existing
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const people = [
  {
    name: "Leslie Alexander",
    email: "a",
    role: "Facilitator",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Leslie Alexander",
    email: "b",

    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Leslie Alexander",
    email: "c",

    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Leslie Alexander",
    email: "d",

    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Leslie Alexander",
    email: "e",

    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Leslie Alexander",
    email: "f",

    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
  // More people...
];

export function Participants() {
  return (
    <div className="mt-8">
      <h3 className="text-lg text-blue font-medium leading-6 text-gray-900">
        Participants
      </h3>

      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-4 text-blue">
        {people.map((person) => (
          <div
            key={person.email}
            className="relative flex items-center space-x-3 rounded-lg border border-blue bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="flex-shrink-0">
              <img className="h-10 w-10 rounded-full" src={person.imageUrl} alt="" />
            </div>
            <div className="min-w-0 flex-1">
              <a href="#" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{person.name}</p>
                {person.role && (
                  <p className="truncate text-sm text-gray">{person.role}</p>
                )}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
