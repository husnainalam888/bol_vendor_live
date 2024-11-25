import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../Components/Container';
import {ItemList, OrderList} from './Dashboard';
import {getRequest, postRequest} from '../../Utils/API';
import ProductItem, {ProductList} from '../../Components/ProuctItem';
import {SvgFromXml} from 'react-native-svg';
import {SVG} from '../../Svgs/SVG';
import {HeaderWithBack} from '../OrderDetails';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {global_storage} from '../../Utils/Utils';
import indexer from 'react-native-mmkv-storage/dist/src/indexer/indexer';

const ProductScreen = ({navigation}) => {
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
      const respone = await getRequest(`get_products/${user.id}`);
      setIsLoading(false);
      console.log(TAG, 'Get_orders() : response ', respone);
      setData(respone.data);
    } catch (error) {
      setIsLoading(false);
      console.log(TAG, 'get_orders():', error);
    }
  };
  const delete_product = async id => {
    try {
      setIsLoading(true);
      const respone = await postRequest(`delete_product/${id}`, false);
      setIsLoading(false);
      console.log(TAG, 'Get_orders() : response ', respone);
      if (respone.status) {
        let tempData = data;
        tempData = tempData.filter(item => item.id != id);
        setData(tempData);
      } else Alert.alert('Error', respone.message);
    } catch (e) {
      console.warn('ProductScreen Errror :  ', e);
      Alert.alert('Error', e.message);
      setIsLoading(false);
      0;
    }
  };
  return (
    <View style={{flex: 1}}>
      <HeaderWithBack hideBack={true} title={'My Products'} />
      <Container
        isLoading={isLoading}
        onRefresh={get_orders}
        style={{paddingBottom: 70}}>
        <ProductList onDelete={delete_product} data={data} />
      </Container>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddProduct')}
        style={styles.floatingBtn}>
        <SvgFromXml xml={SVG.addWhite} height={25} width={25} />
      </TouchableOpacity>
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    marginVertical: 16,
  },
  floatingBtn: {
    position: 'absolute',
    backgroundColor: 'black',
    bottom: 16,
    right: 16,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    elevation: 5,
  },
});
