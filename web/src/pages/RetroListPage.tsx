import * as React from "react";
import { RetroCard } from "../components/RetroCard";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { LoadingText } from "../components/LoadingText";
import { PageContainer } from "../components/PageContainer";
import { WorkspaceStateStatus } from "../hooks/use-get-workspace";
import { useGetWorkspace } from "../hooks/use-get-workspace";
import { Retro } from "../types/retro";
import { useHistory } from "react-router-dom";
import analytics from "analytics.js";
import { AnalyticsPage, useAnalyticsPage } from "../hooks/use-analytics-page";
import { Navbar } from "../components/Navbar";
import { useCurrentUser } from "../hooks/use-current-user";
import { DeleteRetroModal } from "../components/DeleteRetroModal";
import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);

export function RetroListPage() {
  useAnalyticsPage(AnalyticsPage.RETRO_LIST);
  const history = useHistory();
  const handleRedirectToRetroPage = (retro: Retro) => {
    analytics.track("Retro Opened", { ...retro, location: AnalyticsPage.RETRO_LIST });
    return history.push(`/workspaces/${retro.workspaceId}/retros/${retro.id}`);
  };
  const { status, retros, name, users, ownerId } = useGetWorkspace();
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.auth?.uid;

  let isWorkspaceAdmin = false;
  if (currentUserId) {
    if (users[currentUserId]?.userRole === "owner" || ownerId === currentUserId) {
      isWorkspaceAdmin = true;
    }
  }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [retroToDelete, setRetroToDelete] = React.useState<Retro | null>(null);

  const handleOpenDeletionModal = (retro: Retro) => {
    setRetroToDelete(retro);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeletionModal = () => {
    setIsDeleteModalOpen(false);
    setRetroToDelete(null);
  };

  const handleDeleteRetro = async () => {
    if (!retroToDelete) {
      return;
    }
    try {
      await retroCollection.doc(retroToDelete.id).delete();
      handleCloseDeletionModal();
    } catch (error) {
      console.log({ error });
    }
  };

  if (status === WorkspaceStateStatus.LOADING) {
    return <LoadingText>Loading...</LoadingText>;
  }

  const hasError = status === WorkspaceStateStatus.ERROR;

  return (
    <React.Fragment>
      <DeleteRetroModal
        retro={retroToDelete}
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeletionModal}
        onClickDelete={handleDeleteRetro}
      />
      <PageContainer>
        <Navbar isLoggedIn />
        {hasError && (
          <ErrorMessageBanner message="It was probably us. Please try again in a couple minutes." />
        )}
        <p className="text-blue mb-2 underline">{name}</p>
        <h1 className="text-blue font-black text-3xl">All Retros</h1>
        <div className="flex flex-wrap">
          {retros.map((retro) => {
            return (
              <RetroCard
                key={retro.id}
                isWorkspaceAdmin={isWorkspaceAdmin}
                currentUserId={currentUserId || ""}
                retro={retro}
                workspaceUsersMap={users}
                onClick={() => handleRedirectToRetroPage(retro)}
                onClickDelete={() => handleOpenDeletionModal(retro)}
              />
            );
          })}
        </div>
      </PageContainer>
    </React.Fragment>
  );
}
