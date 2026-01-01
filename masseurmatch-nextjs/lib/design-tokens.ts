/**
 * Design Tokens - MasseurMatch
 * Cores bem definidas sem ambiguidade
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // Main purple
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },

  // Secondary Brand Colors
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef', // Pink accent
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },

  // Status Colors - Clearly Defined
  status: {
    available: {
      bg: '#10b981',      // Green
      text: '#ffffff',
      border: '#059669',
      light: '#d1fae5',
    },
    busy: {
      bg: '#ef4444',      // Red
      text: '#ffffff',
      border: '#dc2626',
      light: '#fee2e2',
    },
    away: {
      bg: '#f59e0b',      // Amber
      text: '#ffffff',
      border: '#d97706',
      light: '#fef3c7',
    },
    offline: {
      bg: '#6b7280',      // Gray
      text: '#ffffff',
      border: '#4b5563',
      light: '#e5e7eb',
    },
  },

  // Semantic Colors
  success: '#10b981',   // Green
  warning: '#f59e0b',   // Amber
  error: '#ef4444',     // Red
  info: '#3b82f6',      // Blue

  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Background Colors
  background: {
    light: '#ffffff',
    dark: '#0a0a0f',
    surface: '#f9fafb',
    surfaceDark: '#1f2937',
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
    primaryDark: '#f9fafb',
    secondaryDark: '#d1d5db',
  },
} as const;

export const spacing = {
  section: '4rem',      // 64px
  card: '1.5rem',       // 24px
  element: '1rem',      // 16px
  tight: '0.5rem',      // 8px
} as const;

export const borderRadius = {
  sm: '0.375rem',       // 6px
  md: '0.5rem',         // 8px
  lg: '0.75rem',        // 12px
  xl: '1rem',           // 16px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const;

/**
 * Status badge configuration
 */
export const statusConfig = {
  available: {
    label: 'Available Now',
    color: colors.status.available,
    icon: '✓',
  },
  visiting_now: {
    label: 'Visiting Now',
    color: colors.status.busy,
    icon: '✈',
  },
  visiting_soon: {
    label: 'Visiting Soon',
    color: colors.status.away,
    icon: '📅',
  },
  offline: {
    label: 'Offline',
    color: colors.status.offline,
    icon: '○',
  },
} as const;

/**
 * Typography scale
 */
export const typography = {
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
