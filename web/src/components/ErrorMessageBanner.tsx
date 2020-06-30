import * as React from "react";

type ErrorMessageBannerProps = {
  message: string;
  title?: string;
};
export function ErrorMessageBanner({
  message,
  title = "Oops. Something went wrong."
}: ErrorMessageBannerProps) {
  return (
    <div className="flex justify-between items-center text-red my-2 p-4 bg-white border shadow flex-wrap">
      <div className="flex flex-wrap items-center">
        {/* <PawIcon /> */}
        <div className="pl-2">
          <p className="font-black">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
