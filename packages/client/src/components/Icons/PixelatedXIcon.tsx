import { createSvgIcon } from '@mui/material';

const xIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <circle cx="5" cy="5" r="3" fill="currentColor" />
    <circle cx="45" cy="5" r="3" fill="currentColor" />
    <circle cx="15" cy="15" r="3" fill="currentColor" />
    <circle cx="35" cy="15" r="3" fill="currentColor" />
    <circle cx="25" cy="25" r="3" fill="currentColor" />
    <circle cx="15" cy="35" r="3" fill="currentColor" />
    <circle cx="35" cy="35" r="3" fill="currentColor" />
    <circle cx="5" cy="45" r="3" fill="currentColor" />
    <circle cx="45" cy="45" r="3" fill="currentColor" />
  </svg>
);

export const PixelatedXIcon = createSvgIcon(xIcon, 'PixelatedX');
