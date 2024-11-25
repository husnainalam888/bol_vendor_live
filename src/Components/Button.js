import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const Button = ({style, title, titleStyle, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
