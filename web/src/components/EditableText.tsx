import * as React from "react";
import { EditButton } from "./EditButton";

export function EditableText({ defaultValue, onSubmit }: any) {
  const textInput = React.useRef<any>(null);
  const formRef = React.useRef<any>(null);

  const [isInputOpen, setIsInputOpen] = React.useState(false);
  const [showEditIcon, setShowEditIcon] = React.useState(false);

  React.useEffect(() => {
    if (isInputOpen) {
      textInput?.current?.focus();
    }
  }, [isInputOpen]);

  const handleOpenInput = () => {
    if (!isInputOpen) {
      setIsInputOpen(true);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const text = event.target.textInput.value;
    try {
      if (!text) return;
      onSubmit(text);
    } finally {
      // Always close the input, no matter what.
      setIsInputOpen(false);
    }
    return;
  };

  const handleOnReset = () => {
    setIsInputOpen(false);
    return;
  };

  return (
    <form
      ref={formRef}
      className="flex w-full"
      onSubmit={handleSubmit}
      onReset={handleOnReset}
    >
      <div className={`flex w-3/4 ${isInputOpen ? "block" : "hidden"}`}>
        <input
          ref={textInput}
          className={`border w-full h-8 bg-white text-blue border-red focus:outline-none px-1`}
          name="textInput"
          defaultValue={defaultValue}
          placeholder="Group description"
        />
        <ResetButton />
        <SubmitButton />
      </div>
      <div
        onClick={handleOpenInput}
        className={`flex h-8 text-lg font-black hover:underline ${
          !isInputOpen ? "block" : "hidden"
        }`}
        onMouseEnter={() => setShowEditIcon(true)}
        onMouseLeave={() => setShowEditIcon(false)}
      >
        <span>{defaultValue || "Untitled group"}</span>
        {showEditIcon && <EditButton onClick={handleOpenInput} />}
      </div>
    </form>
  );
}

const SubmitButton = () => {
  return (
    <div className="flex items-center justify-center">
      <button
        type="submit"
        className="rounded-full h-6 w-6 focus:outline-none active:transform-1"
      >
        <div className={`flex justify-center items-end`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

const ResetButton = () => {
  return (
    <div className="flex items-center justify-center">
      <button
        type="reset"
        className="rounded-full h-6 w-6 text-red focus:outline-none active:transform-1"
      >
        <div className={`flex justify-center items-end`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};
