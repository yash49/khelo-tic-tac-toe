import Particles from '@tsparticles/react';
import { useThemeMode } from '../hooks/useThemeMode';
import { theme as actualPalette } from '../../.unicornix/theme';
import { memo } from 'react';
import styles from './FireParticles.module.css';

export const FireParticles = memo(() => {
  const themeMode = useThemeMode();

  const colorTokens = actualPalette[themeMode];

  return (
    <Particles
      className={styles.fireParticles}
      options={{
        fpsLimit: 120,
        particles: {
          number: {
            value: 200,
            // value: 100,
            density: {
              enable: true,
            },
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
            // value: { min: 0.4, max: 0.6 },
            value: { min: 0.4, max: 0.6 },
          },
          size: {
            value: { min: 1, max: 3 },
          },
          move: {
            enable: true,
            speed: 1,
            // random: true,
            random: false,
          },
          // links: {
          //   distance: 100,
          //   enable: true,
          //   opacity: 0.5,
          //   color: colorTokens.accent.border,
          // },
        },
        background: {
          color: colorTokens.accent.surface,
        },
      }}
    />
  );
});

FireParticles.displayName = 'FireParticles';
