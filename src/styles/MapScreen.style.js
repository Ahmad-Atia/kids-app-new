import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  container: { 
    flex: 1 
  },
  map: { 
    flex: 1 
  },
  chipContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    paddingVertical: 6,
  },
  chip: {
    backgroundColor: colors.inactiveChip,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  chipText: {
    fontSize: 14,
    color: colors.chipTextDark,
  },
  chipTextActive: {
    color: colors.chipTextLight,
    fontWeight: 'bold',
  },
});
