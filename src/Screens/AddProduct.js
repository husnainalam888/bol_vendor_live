import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../Components/Container';
import Input from '../Components/Input';
import LabelValueSelector from '../Components/LabelValueSelector';
import ImageSelector from '../Components/ImageSelector';
import {
  getCustomerRequest,
  getRequest,
  postRequest,
  postRequestWithFile,
} from '../Utils/API';
import Button from '../Components/Button';
import LoadingModal from '../Components/LoadingModal';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {Delivery_DAYS, global_storage} from '../Utils/Utils';
import DropDown from '../Components/DropDown';
import BottomMenu from '../Components/BottomMenu';

const AddProduct = ({route, navigation}) => {
  const item = route?.params?.item;
  const [name, setName] = useState(item?.name || '');
  const [allSubCats, setAllSubCats] = useState([]);
  const [allSubSubCats, setAllSubSubCats] = useState([]);
  const [description, setDescription] = useState(item?.description || '');
  const [user, setUser] = useMMKVStorage('USER', global_storage);
  const [isLoading, setIsLoading] = useState(false);
  const [ean, setEan] = useState(item?.ean || '');
  const [colors, setColors] = useState(
    '[{"name":"Blue","value":"#5382ee"},{"name":"Black","value":"#000000"}]',
  );
  const [salesPrice, setSalesPrice] = useState(item?.sales_price || '');
  const [deliveryDay, setDeliveryDay] = useState(item?.delivery_day || '');
  const [deliveryTime, setDeliveryTime] = useState(item?.delivery_time || '');
  const [category, setCategory] = useState(item?.category || '');
  const [subCategory, setSubCategory] = useState(item?.sub_category || '');
  const [subSubCategory, setSubSubCategory] = useState(
    item?.sub_sub_category || '',
  );
  const [allCats, setAllCats] = useMMKVStorage(
    'ALL_CATEGORIES',
    global_storage,
    [],
  );
  const [internalReference, setInternalReference] = useState(
    item?.internal_reference || '',
  );
  const [extras, setExtras] = useState(
    item?.extras ? JSON.parse(item?.extras) : [],
  );
  const [explainCondition, setExplainCondition] = useState(
    item?.explain_condition || '',
  );
  const [stockQuantity, setStockQuantity] = useState(
    item?.stock_quantity || '',
  );
  const [condition, setCondition] = useState(item?.condition || '');
  const [images, getImages] = useState([]);
  const isValid = () => {
    if (
      name.length > 0 &&
      description.length > 0 &&
      ean.length > 0 &&
      category != '' &&
      salesPrice.length > 0 &&
      deliveryDay.length > 0 &&
      deliveryTime.length > 0 &&
      internalReference.length > 0 &&
      extras.length > 0 &&
      explainCondition.length > 0 &&
      stockQuantity.length > 0 &&
      condition.length > 0 &&
      subCategory != '' &&
      subSubCategory != ''
    ) {
      if (item) {
        return true;
      } else if (images.length > 0) {
        return true;
      }
    }
    return false;
  };
  const clearAll = () => {
    setName('');
    setDescription('');
    setEan('');
    setSalesPrice('');
    setDeliveryDay('');
    setDeliveryTime('');
    setInternalReference('');
    setExtras({});
    setExplainCondition('');
    setStockQuantity('');
    setCondition('');
    getImages([]);
  };
  const handleAddProduct = async (edit = false) => {
    if (!isValid()) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('ean', ean);
      formData.append('category', subSubCategory.id);
      formData.append('sales_price', salesPrice);
      formData.append('extras', JSON.stringify(extras));
      formData.append('delivery_day', deliveryDay);
      formData.append('colors', colors);
      formData.append('delivery_time', deliveryTime);
      formData.append('internal_reference', internalReference);
      formData.append('explain_condition', explainCondition);
      formData.append('stock_quantity', stockQuantity);
      formData.append('condition', condition);
      console.log('Images', images);
      if (!item)
        images.forEach((image, index) => {
          const fileName = `${new Date().getTime()}image_${index + 1}.jpg`;
          formData.append('images[]', {
            uri: image.path,
            name: fileName,
            type: 'image/jpeg',
          });
        });
      console.log('FormData :', JSON.stringify(formData));
      setIsLoading(true);
      const response = await postRequestWithFile(
        item?.id ? `edit_product/${item?.id}` : `add_product/${user?.id}`,
        formData,
      );
      setIsLoading(false);
      console.log(response);
      if (response.status) {
        clearAll();
        navigation.goBack();
        Alert.alert(
          'Success',
          `Product ${item?.id ? 'updated' : 'added'} successfully`,
        );
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
      console.error(error);
    }
  };
  const get_categories = async () => {
    try {
      setIsLoading(true);
      const response = await getRequest('get_categories');
      setIsLoading(false);
      setAllCats(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  const get_sub_categories = async id => {
    try {
      setIsLoading(true);
      const response = await getRequest(`get_sub_categories/${id}`);
      setIsLoading(false);
      setAllSubCats(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  const get_sub_sub_categories = async id => {
    try {
      setIsLoading(true);
      const response = await getRequest(`get_sub_sub_categories/${id}`);
      setIsLoading(false);
      setAllSubSubCats(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    get_categories();
  }, []);
  return (
    <Container
      headerTitle={item?.id ? 'Edit Product' : 'Add Product'}
      style={{backgroundColor: '#f5f5f5'}}>
      <Input
        style={{marginBottom: 16}}
        label={'Name'}
        value={name}
        placeholder={'Enter the product name'}
        onChangeText={text => setName(text)}
      />
      <Input
        style={{marginBottom: 16}}
        label={'Description'}
        value={description}
        onChangeText={text => setDescription(text)}
        placeholder={'Enter the product description'}
        multiline={true}
      />
      {!item?.id && <ImageSelector getImages={getImages} />}
      <Input
        style={{marginBottom: 16}}
        label={'Ean'}
        value={ean}
        onChangeText={text => setEan(text)}
        placeholder={'Enter the product ean'}
        keyboardType="numeric"
      />
      <Input
        style={{marginBottom: 16}}
        label={'Delivery Days'}
        value={deliveryDay}
        keyboardType={'numeric'}
        onChangeText={text => setDeliveryDay(text)}
        placeholder={'Enter the delivery days'}
        multiline={true}
      />
      {/* <Input
        label={'Delivery Day'}
        zIndex={20000}
        zInverseIndex={1000}
        style={{zIndex: 2000}}
        data={Delivery_DAYS}
        setCategory={setDeliveryDay}
      /> */}
      <Input
        style={{marginBottom: 16}}
        label={'Sales Price'}
        value={salesPrice}
        onChangeText={text => setSalesPrice(text)}
        placeholder={'Enter the product sales price'}
        keyboardType="numeric"
      />
      <LabelValueSelector
        value={extras}
        label={'Extras'}
        getValues={setExtras}
      />
      {allCats.length > 0 && (
        <BottomMenu
          label={'Category'}
          placeholder="Select Category"
          value={category}
          data={allCats}
          onChange={item => {
            setCategory(item);
            get_sub_categories(item.id);
          }}
        />
      )}
      {allSubCats.length > 0 && (
        <BottomMenu
          label={'Sub Category'}
          placeholder="Select Sub Category"
          value={subCategory}
          data={allSubCats}
          onChange={item => {
            setSubCategory(item);
            get_sub_sub_categories(item.id);
          }}
        />
      )}
      {allSubSubCats.length > 0 && (
        <BottomMenu
          label={'Sub Sub Category'}
          placeholder="Select Sub Sub Category"
          value={subSubCategory}
          data={allSubSubCats}
          onChange={item => {
            setSubSubCategory(item);
          }}
        />
      )}
      <Input
        style={{marginBottom: 16}}
        label={'Delivery Time'}
        value={deliveryTime}
        type={'time'}
        onChangeText={text => setDeliveryTime(text)}
        placeholder={'Enter the product delivery time'}
      />
      <Input
        style={{marginBottom: 16}}
        label={'Internal Reference'}
        placeholder={'Reference'}
        value={internalReference}
        onChangeText={text => setInternalReference(text)}
      />
      <Input
        style={{marginBottom: 16}}
        label={'Explain Condition'}
        value={explainCondition}
        onChangeText={text => setExplainCondition(text)}
        placeholder={'Explain the condition of product '}
      />
      <Input
        style={{marginBottom: 16}}
        label={'Stock Quantity'}
        value={stockQuantity}
        onChangeText={text => setStockQuantity(text)}
        placeholder={'Enter the product stock quantity '}
        keyboardType={'numeric'}
      />
      <Input
        style={{marginBottom: 16}}
        label={'Condition'}
        value={condition}
        onChangeText={text => setCondition(text)}
        placeholder={'Enter the product condition '}
      />
      <Button
        title={item?.id ? 'Update Product' : 'Add Product'}
        onPress={handleAddProduct}
        style={{marginVertical: 10}}
      />
      <LoadingModal isLoading={isLoading} />
    </Container>
  );
};

export default AddProduct;

const styles = StyleSheet.create({});
