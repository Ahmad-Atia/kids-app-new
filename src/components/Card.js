import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

export default function Card({ 
  children, 
  style, 
  onPress, 
  disabled = false,
  shadow = true,
  padding = 'medium'
}) {
  const getPaddingValue = () => {
    switch(padding) {
      case 'none': return 0;
      case 'small': return 10;
      case 'medium': return 15;
      case 'big': return 20;
      default: return 15;
    }
  };

  const getCardStyle = () => {
    let baseStyle = [
      styles.card, 
      { padding: getPaddingValue() }
    ];
    
    if (shadow) {
      baseStyle.push(styles.cardShadow);
    }
    
    if (disabled) {
      baseStyle.push(styles.cardDisabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={getCardStyle()}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
  },
  
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  cardDisabled: {
    opacity: 0.6,
  },
});
