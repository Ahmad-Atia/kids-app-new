import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  size = 'medium'
}) {
  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          button: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 36 },
          text: { fontSize: 14 }
        };
      case 'medium':
        return {
          button: { paddingVertical: 12, paddingHorizontal: 24, minHeight: 48 },
          text: { fontSize: 16 }
        };
      case 'big':
        return {
          button: { paddingVertical: 16, paddingHorizontal: 32, minHeight: 56 },
          text: { fontSize: 18 }
        };
      default:
        return {
          button: { paddingVertical: 12, paddingHorizontal: 24, minHeight: 48 },
          text: { fontSize: 16 }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getButtonStyle = () => {
    let baseStyle = [styles.button, styles[`button_${variant}`], sizeStyles.button];
    
    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    let baseStyle = [styles.buttonText, styles[`buttonText_${variant}`], sizeStyles.text];
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <Text style={getTextStyle()}>Loading...</Text>
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Variants
  button_primary: {
    backgroundColor: '#007AFF',
  },
  button_secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  button_danger: {
    backgroundColor: '#FF3B30',
  },
  button_success: {
    backgroundColor: '#34C759',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  
  // Disabled state
  buttonDisabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  
  // Text styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Text variants
  buttonText_primary: {
    color: '#fff',
  },
  buttonText_secondary: {
    color: '#007AFF',
  },
  buttonText_danger: {
    color: '#fff',
  },
  buttonText_success: {
    color: '#fff',
  },
  buttonText_outline: {
    color: '#007AFF',
  },
});
