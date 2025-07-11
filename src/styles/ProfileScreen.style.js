import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  header: {
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: 30,
    marginBottom: 10,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  stats: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  menu: {
    backgroundColor: colors.background,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBackground,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: colors.textPrimary,
  },
  guestHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  guestSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  loginButtonText: {
    color: colors.chipTextLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: { padding: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
  categoryButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  categoryText: { 
    textAlign: 'center', 
    fontSize: 16,
    color: colors.textPrimary,
  },
  categoryTextActive: { 
    color: colors.chipTextLight, 
    fontWeight: 'bold' 
  },
  saveButton: {
    backgroundColor: colors.success,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  saveButtonText: { 
    textAlign: 'center', 
    color: colors.chipTextLight, 
    fontSize: 16 
  },
  buttonDisabled: { opacity: 0.6 },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: { 
    fontSize: 15, 
    marginBottom: 5,
    color: colors.textPrimary,
  },
  date: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});
