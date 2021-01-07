import * as React from "react";
import { getWorkspaceById } from "../services/workspace-service";
import { Workspace } from "../types/workspace";

export function useGetWorkspace(id?: string) {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    getWorkspaceById(id).then(
      (workspace) => {
        if (!workspace) {
          return;
        }
        return setData({
          id,
          name: workspace.name,
          url: workspace.url,
          ownerId: workspace.ownerId,
          teams: [],
          users: [],
          invitedUsers: [],
          subscription: {
            status: workspace.subscriptionStatus,
            trialEnd: workspace.subscriptionTrialEnd
          }
        });
      },
      (e) => setError(e.message)
    );
    setLoading(false);
  }, [id]);

  return { data, loading, error };
}

// const WORKSPACE_QUERY = gql`
//   query WorkspaceQuery($id: ID!) {
//     workspace(id: $id) {
//       id
//       name
//       url
//       ownerId
//       teams {
//         id
//         name
//       }
//       users {
//         __typename
//         id
//         email
//         createdAt
//       }
//       invitedUsers {
//         __typename
//         id
//         email
//         createdAt
//         accepted
//       }
//       subscription {
//         status
//         trialEnd
//       }
//       customer {
//         defaultPaymentMethod
//       }
//     }
//   }
// `;
