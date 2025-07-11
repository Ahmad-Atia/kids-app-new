import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  ratingSection: {
    marginBottom: 30,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  star: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  activeStar: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  inactiveStar: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  starText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  commentSection: {
    marginBottom: 30,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
  submitButtonText: {
    color: colors.chipTextLight,
    fontSize: 16,
    fontWeight: '600',
  },
});
