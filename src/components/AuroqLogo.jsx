import React from 'react';
import logoImg from '../assets/logo.png';

/**
 * AuroqIcon - The logo image.
 * Displays the exact logo image from the user provided photo.
 */
export function AuroqIcon({ className = "", isResponding = false, style }) {
  return (
    <img
      src={logoImg}
      alt="Tamili Icon"
      className={`select-none object-contain ${className}`}
      style={{ height: '1in', width: 'auto', ...style }}
    />
  );
}

/**
 * AuroqLogo - Full brand logo image (icon, wordmark, tagline).
 * Displays the exact logo image from the user provided photo.
 */
export default function AuroqLogo({
  className = "",
  isResponding = false,
  showWordmark = true,
  showTagline = false,
  glow = true,
  style
}) {
  return (
    <img
      src={logoImg}
      alt="Tamili Logo"
      className={`select-none object-contain ${className}`}
      style={{ height: '1in', width: 'auto', ...style }}
    />
  );
}
