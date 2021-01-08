import * as React from "react";
import { FeatureFlags } from "../constants/feature-flags";
import { useFeature } from "@optimizely/react-sdk";
import { Route, RouteProps } from "react-router-dom";

type ExperimentalRouteProps = {
  featureKey: FeatureFlags;
} & RouteProps;

export function ExperimentalRoute({ featureKey, ...rest }: ExperimentalRouteProps) {
  const isFeatureEnabled = useFeature(featureKey);
  return isFeatureEnabled ? <Route {...rest} /> : null;
}
