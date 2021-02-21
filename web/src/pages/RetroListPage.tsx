import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { useWorkspaceState } from "../hooks/use-workspace-state";
// import { Retro } from "../types/retro";
// import { useHistory } from "react-router-dom";
// import { Workspace } from "../types/workspace";
// import { useGetWorkspaceRetros } from "../hooks/use-get-workspace-retros";

export function RetroListPage() {
  // const history = useHistory();
  // const handleRedirectToRetroPage = (retro: Retro) => {
  //   analytics.track("Retro Opened", { ...retro });
  //   return history.push(`/workspaces/${retro.workspaceId}/retros/${retro.id}`);
  // };
  const workspaceState = useWorkspaceState();
  // const { retros } = useGetWorkspaceRetros(workspaceState.id);

  return (
    <PageContainer>
      <p className="text-blue mb-2 underline">{workspaceState.name}</p>
      <h1 className="text-blue font-black text-3xl">All Retros</h1>
      <div className="flex flex-wrap">
        {/* {retros.map((retro) => {
          return (
            <RetroCard
              key={retro.id}
              retro={retro}
              onClick={() => handleRedirectToRetroPage(retro)}
            />
          );
        })} */}
      </div>
    </PageContainer>
  );
}
