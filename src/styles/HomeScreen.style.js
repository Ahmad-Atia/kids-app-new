import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width } = Dimensions.get('window');
const BUTTON_FONT_SIZE = width * 0.035;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  logoSection: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.chipTextLight,
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.chipTextLight,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 16,
    color: colors.chipTextLight,
    opacity: 0.8,
  },
  notificationButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  notificationBadgeText: {
    color: colors.chipTextLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: colors.background,
    margin: 10,
    borderRadius: 12,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '500',
  },
  eventCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  eventDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  participantCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 10,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: colors.background,
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  safeArea: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: {
    width: width * 0.5,
    height: width * 0.2,
    alignSelf: 'center',
    marginVertical: 15,
  },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  distance: {
    marginTop: 4,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  footerButtonText: {
    fontSize: BUTTON_FONT_SIZE,
    textAlign: 'center',
  },
});
