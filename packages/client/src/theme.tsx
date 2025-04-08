import { createTheme, ThemeOptions } from '@mui/material';
import { palette, tokens } from './tokens';

const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: {
    main: palette.dark.accent.base,
    contrastText: palette.dark.accent.contrast,
  },
  error: {
    main: palette.dark.alert.base,
    contrastText: palette.dark.alert.contrast,
  },
  success: {
    main: palette.dark.safe.base,
    contrastText: palette.dark.safe.contrast,
  },
  warning: {
    main: palette.dark.warning.base,
    contrastText: palette.dark.warning.contrast,
  },
  info: {
    main: palette.dark.info.base,
    contrastText: palette.dark.info.contrast,
  },
  secondary: {
    main: palette.dark.neutral.base,
    contrastText: palette.dark.neutral.contrast,
  },
  background: {
    default: palette.dark.background.regular,
    paper: palette.dark.background.regular,
  },
  text: {
    primary: palette.dark.content.regular,
    secondary: palette.dark.content.muted,
    disabled: palette.dark.content.subtle,
  },
  divider: palette.dark.neutral.border,
};

const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: {
    main: palette.light.accent.base,
    contrastText: palette.light.accent.contrast,
  },
  error: {
    main: palette.light.alert.base,
    contrastText: palette.light.alert.contrast,
  },
  success: {
    main: palette.light.safe.base,
    contrastText: palette.light.safe.contrast,
  },
  warning: {
    main: palette.light.warning.base,
    contrastText: palette.light.warning.contrast,
  },
  info: {
    main: palette.light.info.base,
    contrastText: palette.light.info.contrast,
  },
  secondary: {
    main: palette.light.neutral.base,
    contrastText: palette.light.neutral.contrast,
  },
  background: {
    default: palette.light.background.regular,
    paper: palette.light.background.regular,
  },
  text: {
    primary: palette.light.content.regular,
    secondary: palette.light.content.muted,
    disabled: palette.light.content.subtle,
  },
  divider: palette.light.neutral.border,
};

const themeProperties: ThemeOptions = {
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: tokens.color.background.subtle,
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.color.background.muted,
        },
      },
    },

    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.color.background.subtle,
          color: tokens.color.content.regular,
        },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontWeight: '500',
        },
      },
    },
  },
};

export const getTheme = (mode: 'dark' | 'light') => {
  return createTheme({
    cssVariables: true,
    palette: mode === 'dark' ? darkPalette : lightPalette,

    ...themeProperties,
  });
};
