import { PageContainer } from "../components/PageContainer";
import React from "react";
import { Navbar } from "../components/Navbar";
/* This example requires Tailwind CSS v2.0+ */
import { CheckIcon } from "@heroicons/react/solid";

export function PricingPage() {
  return (
    <PageContainer>
      <Navbar />
      <Example />
    </PageContainer>
  );
}

const plans = [
  {
    title: "The Plan",
    featured: true,
    description: "The best financial services for your thriving business.",
    priceMonthly: 9.99,
    priceYearly: 99.99,
    mainFeatures: [
      { id: 1, value: "1 Workspace" },
      { id: 2, value: "Unlimited team members" },
      { id: 3, value: "Unlimited retros" },
      { id: 4, value: "Structured retro format" },
      { id: 5, value: "Anonymous, multiplayer participation" },
      { id: 6, value: "Automatic meeting summaries" }
    ]
  }
];
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [isYearly, setIsYearly] = React.useState(false);

  return (
    <div>
      <div className="relative bg-red pb-12 rounded-md">
        {/* Overlapping background */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 hidden h-6 w-full bg-gray-50 lg:block"
        />

        <div className="relative mx-auto max-w-2xl px-4 pt-16 text-center sm:px-6 sm:pt-32 lg:max-w-7xl lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            <span className="block lg:inline">Simple pricing, forever.</span>
            {/* <span className="block lg:inline">no commitment.</span> */}
          </h1>
          <p className="mt-4 text-base text-white">
            Everything you need, nothing you don't. Pay the same price forever, no matter
            how your team grows.
          </p>
        </div>

        <h2 className="sr-only">Plans</h2>

        {/* Toggle */}
        <div className="relative mt-12 flex justify-center sm:mt-16">
          <div className="flex rounded-lg bg-indigo-700 p-0.5">
            <button
              onClick={() => setIsYearly(false)}
              type="button"
              className={`rounded-md py-2 px-6 text-sm bg-blue border-white border font-medium text-blue focus:outline-none ${
                !isYearly ? "bg-white text-red" : "bg-blue text-white shadow shadow-blue"
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setIsYearly(true)}
              type="button"
              className={`ml-2 rounded-md py-2 px-6 text-sm bg-blue border-white border font-medium text-blue focus:outline-none ${
                isYearly ? "bg-white text-red" : "bg-blue text-white shadow shadow-blue"
              }`}
            >
              Yearly billing
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="flex justify-center mx-auto mt-8 px-4 pb-8 sm:mt-12 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-0">
          <div className="relative space-y-6">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className={classNames(
                  plan.featured
                    ? "bg-white ring-2 ring-indigo-700 shadow-md"
                    : "bg-indigo-700 lg:bg-transparent",
                  "pt-6 px-6 pb-3 rounded-lg lg:px-8 lg:pt-12"
                )}
              >
                <div>
                  <p className="text-xs text-gray">14 day free trial, then</p>
                  <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start">
                    <div className="mt-3 flex items-center">
                      <p
                        className={classNames(
                          plan.featured ? "text-indigo-600" : "text-white",
                          "text-4xl font-bold tracking-tight"
                        )}
                      >
                        ${isYearly ? plan.priceYearly : plan.priceMonthly}
                      </p>
                      <div className="ml-4">
                        <p
                          className={classNames(
                            plan.featured ? "text-gray-700" : "text-white",
                            "text-sm"
                          )}
                        >
                          USD / {isYearly ? "year" : "month"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="sr-only">Features</h4>
                <ul
                  className={classNames(
                    plan.featured
                      ? "border-gray-200 divide-gray-200"
                      : "border-indigo-500 divide-indigo-500 divide-opacity-75",
                    "mt-7 border-t divide-y lg:border-t-0"
                  )}
                >
                  {plan.mainFeatures.map((mainFeature) => (
                    <li key={mainFeature.id} className="flex items-center py-3">
                      <CheckIcon
                        className={classNames(
                          plan.featured ? "text-indigo-500" : "text-indigo-200",
                          "w-5 h-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          plan.featured ? "text-gray-600" : "text-white",
                          "ml-3 text-sm font-medium"
                        )}
                      >
                        {mainFeature.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
