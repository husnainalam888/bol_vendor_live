import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {SvgFromXml} from 'react-native-svg';
import {SVG} from '../Svgs/SVG';

const LabelValueSelector = ({label, getValues, value}) => {
  const [values, setValues] = useState(value || []);
  const [currentValue, setCurrentValue] = useState({});
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.note}>Note : Tap the add button to add extra</Text>
      <View style={styles.row}>
        <TextInput
          placeholderTextColor={'gray'}
          placeholder="Label here"
          style={styles.input}
          onChangeText={text =>
            setCurrentValue({
              ...currentValue,
              label: text,
            })
          }
        />
        <View style={styles.line} />
        <TextInput
          placeholderTextColor={'gray'}
          onChangeText={text => setCurrentValue({...currentValue, value: text})}
          placeholder="Value here"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => {
            if (
              currentValue.label.length > 0 &&
              currentValue.value.length > 0
            ) {
              setValues([...values, currentValue]);
              getValues([...values, currentValue]);
            }
          }}
          style={{
            flexDirection: 'row',
            backgroundColor: '#f3f3f3',
            alignItems: 'center',
            borderRadius: 30,
            padding: 6,
          }}>
          <SvgFromXml xml={SVG.tick} height={20} width={20} />
          <Text style={{color: 'black', marginHorizontal: 10}}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.show}>
        {values.length == 0 && <Text>{'No Extras added'} </Text>}
        <FlatList
          data={values}
          contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
          renderItem={({item, index}) => {
            return (
              <Text
                onPress={() => {
                  setValues(values.filter((e, i) => i != index));
                  getValues(values.filter((e, i) => i != index));
                }}
                style={{
                  color: 'black',
                  backgroundColor: '#f3f3f3',
                  alignSelf: 'flex-start',
                  padding: 5,
                  marginBottom: 5,
                  borderRadius: 30,
                  marginEnd: 5,
                }}>
                {item.label}:{item.value}
              </Text>
            );
          }}
        />
      </View>
    </View>
  );
};

export default LabelValueSelector;

const styles = StyleSheet.create({
  label: {
    color: '#000',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
  },
  line: {
    height: 30,
    width: 1,
    backgroundColor: 'gray',
    marginHorizontal: 10,
  },
  note: {
    fontSize: 12,
    color: '#818181',
    marginBottom: 10,
  },
  show: {
    backgroundColor: 'white',
    padding: 10,
    minHeight: 100,
    marginBottom: 16,
    borderRadius: 10,
  },
});
