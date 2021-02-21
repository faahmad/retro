import * as React from "react";
import { FeatureFlags } from "../constants/feature-flags";
import { RouteProps } from "react-router-dom";

type ExperimentalRouteProps = {
  featureKey: FeatureFlags;
} & RouteProps;

export function ExperimentalRoute(_props: ExperimentalRouteProps) {
  return <div>ExperimentalRoute</div>;
}
