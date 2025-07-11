import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: colors.background,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10,
    color: colors.textPrimary,
  },
  text: { 
    fontSize: 16, 
    marginBottom: 5,
    color: colors.textSecondary,
  },
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.25,
    marginVertical: 20,
    borderRadius: 10,
  },
  feedbackContainer: { 
    marginTop: 10,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
  },
  feedbackTitle: { 
    fontSize: 18, 
    marginBottom: 10, 
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  buttonGroup: {
    gap: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
