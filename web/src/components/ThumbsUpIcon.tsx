import * as React from 'react';
import thumbsUpIcon from '../assets/icons/thumbs-up.svg';
import thumbsUpFilledIcon from '../assets/icons/thumbs-up-filled.svg';

interface ThumbsUpIconProps {
  className?: string;
  filled?: boolean;
}

export const ThumbsUpIcon: React.FC<ThumbsUpIconProps> = ({
  className = '',
  filled = false
}) => {
  const iconSrc = filled ? thumbsUpFilledIcon : thumbsUpIcon;

  return <img className={className} src={iconSrc} alt="thumbs up" />;
};
