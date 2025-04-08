import Particles from '@tsparticles/react';
import { useThemeMode } from '../hooks/useThemeMode';
import { theme as actualPalette } from '../../.unicornix/theme';
import { memo } from 'react';
import styles from './XAndOParticles.module.css';

export const XAndOParticles = memo(() => {
  const themeMode = useThemeMode();

  const colorTokens = actualPalette[themeMode];

  return (
    <Particles
      className={styles.xAndOParticles}
      options={{
        fpsLimit: 120,
        particles: {
          number: {
            value: 50,
          },
          color: {
            value: [
              colorTokens.accent.gamma[600],
              colorTokens.accent.gamma[700],
              colorTokens.accent.gamma[800],
              colorTokens.accent.gamma[900],
            ],
          },
          opacity: {
            value: 0.8,
          },
          size: {
            value: 12,
          },
          move: {
            enable: true,
            speed: 1,
          },
          shape: {
            type: 'image',
            options: {
              image: [
                {
                  src: '/PixelatedO.svg',
                  width: 32,
                  height: 32,
                  replaceColor: true,
                },
                {
                  src: '/PixelatedX.svg',
                  width: 32,
                  height: 32,
                  replaceColor: true,
                },
              ],
            },
          },
        },
      }}
    />
  );
});

XAndOParticles.displayName = 'XAndOParticles';
