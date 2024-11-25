import {StyleSheet, View} from 'react-native';
import React from 'react';
import DropShadow from 'react-native-drop-shadow';

const Shadow = ({children, style}) => {
  return <DropShadow style={[styles.shadow, style]}>{children}</DropShadow>;
};

export default Shadow;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#72727221',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
