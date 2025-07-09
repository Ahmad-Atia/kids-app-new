export const colors = {
  primary: '#3191C9',
  accentRed: '#E8453C',
  success: '#3AB84F',
  skin: '#FDBD94',
  hairAccent: '#34A18C',
  textDark: '#4B2B83',
  background: '#F2E7F9',
  white: '#FFFFFF',
  // Additional colors for UI elements
  cardBackground: '#F2E7F9',
  shadowColor: '#000000',
  lightText: '#FFFFFF',
};

export const typography = {
  headline: { 
    fontSize: 28, 
    fontWeight: '700', 
    fontFamily: 'Baloo2',
    color: colors.textDark,
    lineHeight: 36,
  },
  subheadline: { 
    fontSize: 20, 
    fontWeight: '600', 
    fontFamily: 'Baloo2',
    color: colors.textDark,
    lineHeight: 26,
  },
  body: { 
    fontSize: 16, 
    fontWeight: '400', 
    fontFamily: 'Nunito',
    color: colors.textDark,
    lineHeight: 22,
  },
  caption: { 
    fontSize: 13, 
    fontWeight: '300', 
    fontFamily: 'Nunito',
    color: colors.textDark,
    lineHeight: 18,
  },
  // Additional typography variants
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Baloo2',
    color: colors.textDark,
    lineHeight: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: colors.lightText,
    textAlign: 'center',
  },
};

// Helper function to combine typography with additional styles
export const createTextStyle = (baseStyle, additionalStyles = {}) => ({
  ...baseStyle,
  ...additionalStyles,
});

// Spacing scale - consistent spacing throughout the app (child-friendly large touch targets)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius scale - rounded components for child-friendly design
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};

// Shadow styles - soft shadows for depth and accessibility
export const shadows = {
  soft: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  medium: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
};

// Common button styles - child-friendly with large touch targets
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // Large touch target for children
    ...shadows.soft,
  },
  secondary: {
    backgroundColor: colors.accentRed,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...shadows.soft,
  },
  success: {
    backgroundColor: colors.success,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...shadows.soft,
  },
  outline: {
    borderColor: colors.primary,
    borderWidth: 2,
    paddingVertical: 10, // Slightly less to account for border
    paddingHorizontal: 22,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    minHeight: 48,
  },
  // Large button for important actions
  large: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...shadows.medium,
  },
};

// Common card styles - rounded with soft shadows
export const cardStyles = {
  default: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.soft,
  },
  elevated: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.medium,
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.soft,
  },
  // Event card style
  event: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    ...shadows.soft,
  },
};

// Avatar styles - rounded for child-friendly design
export const avatarStyles = {
  small: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.skin,
  },
  medium: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.skin,
  },
  large: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.skin,
  },
};

// Input styles - rounded and accessible
export const inputStyles = {
  default: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Nunito',
    color: colors.textDark,
    backgroundColor: colors.white,
    minHeight: 48, // Large touch target
  },
  focused: {
    borderColor: colors.accentRed,
    ...shadows.soft,
  },
};
