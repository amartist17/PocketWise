/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  light: {
    background: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF2F6',
    text: '#17202A',
    textMuted: '#667085',
    border: '#E4E7EC',
    primary: '#236B5C',
    primarySoft: '#DDF2EC',
    income: '#168F67',
    expense: '#D94C4C',
    warning: '#D58A1F',
    white: '#FFFFFF',
    tabIconDefault: '#98A2B3',
    tabIconSelected: '#236B5C',
  },
  dark: {
    background: '#0C1412',
    surface: '#15201D',
    surfaceMuted: '#1E2C28',
    text: '#F2F5F4',
    textMuted: '#A8B6B1',
    border: '#2B3A36',
    primary: '#64C8AD',
    primarySoft: '#193D34',
    income: '#6DD6AA',
    expense: '#FF8585',
    warning: '#F2B95D',
    white: '#FFFFFF',
    tabIconDefault: '#7E918B',
    tabIconSelected: '#64C8AD',
  },
};

export type ThemeColors = (typeof Colors)['light'];

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const Radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
export const Typography = {
  hero: { fontSize: 34, lineHeight: 41, fontWeight: '700' as const },
  title: { fontSize: 24, lineHeight: 31, fontWeight: '700' as const },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700' as const },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 19, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '500' as const },
} as const;
