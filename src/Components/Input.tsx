import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {SvgFromXml} from 'react-native-svg';
import Shadow from './Shadow';
import {SVG} from '../Svgs/SVG';
import DateTime from '@react-native-community/datetimepicker';

export const Input = ({
  startIcon,
  endIcon,
  label,
  style,
  type,
  ...props
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Shadow>
      <View style={[styles.container, style]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Pressable
          onPress={() => {
            if (props.onPress) {
              props.onPress();
              return;
            }
            if (type == 'time') setShowPicker(true);
          }}
          style={styles.inputContainer}>
          {startIcon && <SvgFromXml xml={startIcon} height={20} width={20} />}
          {startIcon && <View style={styles.line} />}
          {type != 'time' && (
            <TextInput
              placeholderTextColor={'gray'}
              secureTextEntry={type === 'password' && !showPassword}
              style={styles.input}
              {...props}
            />
          )}
          {type == 'time' && (
            <Text
              style={[
                styles.input,
                props.value == '' && {color: 'gray'},
                {paddingVertical: 5},
              ]}>
              {props.value || props.placeholder}
            </Text>
          )}
          {endIcon && <SvgFromXml xml={startIcon} />}
          {type === 'password' && (
            <SvgFromXml
              onPress={() => setShowPassword(!showPassword)}
              height={20}
              width={20}
              xml={showPassword ? SVG.showEye : SVG.hideEye}
            />
          )}
        </Pressable>
        {showPicker && type == 'time' && (
          <DateTime
            value={new Date()}
            mode="time"
            onResponderTerminate={() => {
              setShowPicker(false);
            }}
            onChange={date => {
              console.warn(date);
              if (date.type == 'dismissed') {
                setShowPicker(false);
              } else if (date.type == 'set') {
                setShowPicker(false);
                if (props.onChangeText)
                  props.onChangeText(
                    new Date(date.nativeEvent.timestamp).toLocaleTimeString(),
                  );
              }
            }}
            onTouchCancel={() => {
              setShowPicker(false);
            }}
          />
        )}
      </View>
    </Shadow>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {},
  label: {
    color: '#000',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  input: {
    padding: 0,
    flex: 1,
    color: 'black',
  },
  line: {
    width: 1,
    height: 30,
    marginHorizontal: 10,
    backgroundColor: '#727272',
  },
});
