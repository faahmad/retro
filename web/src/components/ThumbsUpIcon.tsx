import * as React from "react";
import thumbsUpIcon from "../assets/icons/thumbs-up.svg";
import { ThumbsUpIcon as ThumbsUpIconDark } from "../images/ThumbsUpIcon";

interface ThumbsUpIconProps {
  className?: string;
  filled?: boolean;
}

export const ThumbsUpIcon: React.FC<ThumbsUpIconProps> = ({
  className = "",
  filled = false
}) => {
  return filled ? (
    <ThumbsUpIconDark />
  ) : (
    <img className={className} src={thumbsUpIcon} alt="thumbs up" />
  );
};
