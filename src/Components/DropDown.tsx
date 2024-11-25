import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SvgFromXml} from 'react-native-svg';
import Shadow from './Shadow';
import {SVG} from '../Svgs/SVG';
import DropDownPicker from 'react-native-dropdown-picker';

export const DropDown = ({
  startIcon,
  endIcon,
  label,
  style,
  type,
  setCategory,
  zIndex,
  zIndexInverse,
  ...props
}: any) => {
  const [values, setValues] = useState(
    props.data?.map(item => {
      return {
        label: item.name,
        value: item.id,
      };
    }) || [],
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  useEffect(() => {
    setValues(
      props.data?.map(item => {
        return {
          label: item.name,
          value: item.id,
        };
      }) || [],
    );
  }, [props.data]);
  return (
    <Shadow style={[styles.container, style]}>
      <View style={[styles.container, style]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <DropDownPicker
          style={styles.input}
          open={open}
          value={value}
          items={values}
          setOpen={setOpen}
          setValue={value => {
            setValue(value);
            setCategory(value);
          }}
          zIndex={zIndex}
          zIndexInverse={zIndexInverse}
          {...props}
        />
      </View>
    </Shadow>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  container: {
    zIndex: 10000,
  },
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
    borderWidth: 0,
    marginBottom: 16,
  },
  line: {
    width: 1,
    height: 30,
    marginHorizontal: 10,
    backgroundColor: '#727272',
  },
});
