import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: colors.cardBackground,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  guestButton: {
    backgroundColor: colors.textSecondary,
  },
  buttonText: {
    color: colors.chipTextLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 15,
    alignItems: 'center',
  },
  switchText: {
    color: colors.primary,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    marginTop: 15,
    color: colors.primary,
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 30,
    alignSelf: 'center',
  },
  skipText: {
    color: colors.textSecondary,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

  