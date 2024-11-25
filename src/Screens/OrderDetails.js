// OrderDetails.js

import React, {useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import Container from '../Components/Container';
import {SvgFromXml} from 'react-native-svg';
import {SVG} from '../Svgs/SVG';
import {useNavigation} from '@react-navigation/native';
import {ItemList, OrderItem, OrderList} from './Tabs/Dashboard';
import {postRequest} from '../Utils/API';

const OrderDetails = ({navigation, route}) => {
  const [order, setOrder] = useState(route.params.order);
  const [isLoading, setIsloading] = useState(false);
  const change_order_status_api = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append('status', status);
      setIsloading(true);
      const response = await postRequest(`change_status/${id}`, formData);
      setIsloading(false);
      if (response.status == true || response.status == 201) {
        let order_items = order.order_item;
        order_items = order_items.map(item => {
          if (item.id == id) {
            return response.data;
          } else return item;
        });
        let tempOrder = order;
        order.order_item = order_items;
        setOrder(tempOrder);
        console.log('FormData :', formData);
        console.log('OrderDetails :', 'ChangeStatus() resonse : ', response);
        Alert.alert(
          'Success',
          'Order status changed to ' + status + ' state ' + ' successfully',
        );
        navigation.goBack();
        return response.data;
      } else {
        Alert.alert('Error', 'Something went wrong');
        return false;
      }
    } catch (error) {
      console.warn('OrderDetails : Error in change order status', error);
    }
  };

  return (
    <Container headerTitle={'Order Details'} isLoading={isLoading}>
      {/* <HeaderWithBack title={'headerTitle'} /> */}
      <OrderItem
        item={order}
        showOrderItems={true}
        style={{marginHorizontal: -16, paddingHorizontal: 16}}
        onPress={change_order_status_api}
      />
    </Container>
  );
};

export const HeaderWithBack = ({title, hideBack}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      {hideBack != true && (
        <SvgFromXml
          style={{
            zIndex: 1,
          }}
          onPress={navigation.goBack}
          xml={SVG.back}
          height={24}
          width={34}
        />
      )}
      <Text style={[styles.headerText, hideBack && {marginStart: 0}]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#0a0707',
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    marginStart: -34,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default OrderDetails;
