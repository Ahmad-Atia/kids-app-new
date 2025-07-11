import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.textPrimary,
  },
});
