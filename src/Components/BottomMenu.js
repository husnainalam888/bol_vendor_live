import React, {useRef, useState} from 'react';
import {View, Button, StyleSheet, FlatList, Text} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Input from './Input';

const BottomMenu = ({label, style, placeholder, value, data, onChange}) => {
  const refRBSheet = useRef();
  const [selected, setSelected] = useState(null);
  return (
    <View style={styles.container}>
      <Input
        label={label}
        style={[{marginBottom: 16}, style]}
        editable={false}
        onPress={() => refRBSheet.current.open()}
        placeholder={placeholder}
        value={value.name}
      />
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={bottomSheetStyles}>
        <FlatList
          data={data}
          style={{marginBottom: 40}}
          renderItem={({item}) => (
            <Text
              onPress={() => {
                onChange(item);
                setSelected(item);
                refRBSheet.current.close();
              }}
              style={[
                styles.item,
                selected?.id == item.id && {
                  backgroundColor: 'black',
                  color: 'white',
                },
              ]}>
              {item.name}
            </Text>
          )}
        />
      </RBSheet>
    </View>
  );
};

const bottomSheetStyles = {
  wrapper: {
    backgroundColor: '#0000005f',
  },
  draggableIcon: {
    backgroundColor: '#000',
  },
  container: {
    height: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 2,
  },
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f3f3f3',
    color: 'black',
    marginHorizontal: 20,
    borderRadius: 5,
  },
});

export default BottomMenu;
