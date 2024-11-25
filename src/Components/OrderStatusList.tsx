import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {SVG} from '../Svgs/SVG';
import {SvgFromXml} from 'react-native-svg';

const OrderStatusList = ({data, style, contentContainerStyle}: any) => {
  return (
    <View
      style={{
        backgroundColor: '#2A2A2A',
        marginHorizontal: -16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}>
      <FlatList
        data={data}
        numColumns={2}
        style={[styles.flatlist, style]}
        renderItem={({item}) => <OrderStatusItem item={item} />}
      />
    </View>
  );
};

const OrderStatusItem = ({item}: any) => {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{item.type} Orders</Text>
      <Text style={styles.count}>{item.count}</Text>
    </View>
  );
};
export default OrderStatusList;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1 / 2,
    width: '100%',
    height: 130,
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  flatlist: {
    marginHorizontal: -8,
    flexGrow: 0,
  },
  label: {
    marginBottom: 10,
    color: 'black',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 'bold',
  },
  count: {
    flex: 1,
    textAlignVertical: 'center',
    marginTop: -16,
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
