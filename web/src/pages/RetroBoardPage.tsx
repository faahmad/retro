import * as React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";

import moment from "moment";

import { Footer } from "../components/Footer";

import { PageContainer } from "../components/PageContainer";

import { useRetroState, RetroStateStatus } from "../hooks/use-retro-state";

import { Retro } from "../types/retro";

import { useUpdateRetro } from "../hooks/use-update-retro";

export const RetroBoardPage: React.FC<RouteComponentProps> = () => {
  const params = useParams<{ retroId: Retro["id"] }>();
  const { data, status, error } = useRetroState(params.retroId);

  if (status === RetroStateStatus.LOADING) {
    return (
      <PageContainer>
        <p className="text-blue">Fetching retro...</p>
      </PageContainer>
    );
  }

  if (status === RetroStateStatus.ERROR) {
    return (
      <PageContainer>
        <p className="text-blue">{error?.message}</p>
      </PageContainer>
    );
  }

  if (status === RetroStateStatus.SUCCESS && data !== null) {
    return (
      <React.Fragment>
        <PageContainer>
          <RetroHeader id={data.id} name={data.name} createdAt={data.createdAt} />
          {/* <RetroBoard id={params.retroId} isActive={isActive} /> */}
        </PageContainer>
        <Footer />
      </React.Fragment>
    );
  }

  // This should never happen TBH.
  return null;
};

interface RetroHeaderProps {
  id: string;
  name: string;
  createdAt: any;
}
function RetroHeader({ id, name, createdAt }: RetroHeaderProps) {
  const [localName, setLocalName] = React.useState(name);
  const handleOnChange = (event) => {
    return setLocalName(event.currentTarget.value);
  };

  const [isEditing, setisEditing] = React.useState(false);
  const handleToggleEditing = () => {
    return setisEditing((prevState) => !prevState);
  };
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const updateRetro = useUpdateRetro();
  const handleSave = async () => {
    await updateRetro(id, { name: localName });
    handleToggleEditing();
    return;
  };

  return (
    <div className="flex text-blue items-baseline justify-between mb-8">
      <div className="flex flex-col flex-grow flex-nowrap">
        {!isEditing ? (
          <h1 className="text-4xl font-bold">{name || "Retro Board"}</h1>
        ) : (
          <input
            ref={inputRef}
            type="text"
            name="name"
            value={localName}
            onChange={handleOnChange}
            className="border border-red my-1 h-12 w-4/5 lg:w-full max-w-md outline-none text-xl px-1"
          />
        )}
        <span className="text-xs font-normal">
          Created {moment(createdAt.toDate()).format("L")}
        </span>
      </div>
      {!isEditing ? (
        <button
          aria-label="edit title button"
          className="flex items-center px-4 border border blue"
          onClick={handleToggleEditing}
        >
          <span>Edit</span>
        </button>
      ) : (
        <button
          className="flex items-center px-4 bg-blue text-white"
          onClick={handleSave}
        >
          Save
        </button>
      )}
    </div>
  );
}
