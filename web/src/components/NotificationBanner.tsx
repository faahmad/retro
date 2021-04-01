import * as React from "react";

type NotificationBannerProps = {
  title: string;
  message: string;
};
export function NotificationBanner({ title, message }: NotificationBannerProps) {
  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-white border shadow flex-wrap">
      <div className="flex flex-wrap items-center">
        <div className="pl-2">
          <p className="font-black">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
