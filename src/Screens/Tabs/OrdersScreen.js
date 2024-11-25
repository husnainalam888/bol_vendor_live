import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../Components/Container';
import {OrderList} from './Dashboard';
import {getRequest, postRequest} from '../../Utils/API';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {global_storage} from '../../Utils/Utils';

const OrdersScreen = () => {
  const TAG = 'OrderScreen';
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useMMKVStorage('USER', global_storage);
  const [data, setData] = useState([]);
  useEffect(() => {
    get_orders();
  }, []);
  const get_orders = async () => {
    try {
      setIsLoading(true);
      const respone = await getRequest(`get_orders/${user.id}`);
      setIsLoading(false);
      console.log(TAG, 'Get_orders() : response ', respone);
      setData(respone.data);
    } catch (error) {
      setIsLoading(false);
      console.log(TAG, 'get_orders():', error);
    }
  };
  return (
    <Container
      isLoading={isLoading}
      onRefresh={get_orders}
      style={{paddingHorizontal: 0, backgroundColor: '#f5f5f5'}}>
      <Text style={styles.title}>Orders</Text>
      <OrderList
        contentContainerStyle={{paddingHorizontal: 16, paddingVertical: 8}}
        data={data.filter((item, index) => index <= 10)}
      />
    </Container>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
