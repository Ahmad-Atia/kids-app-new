import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 18,
    marginVertical: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  voteOptions: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  option: {
    backgroundColor: colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.selectedOption,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  textArea: {
    height: 80,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 10,
    backgroundColor: colors.background,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: colors.background,
    color: colors.textPrimary,
  },
});
