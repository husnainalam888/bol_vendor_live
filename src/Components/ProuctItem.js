import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {IMAGE_B_URL} from '../Utils/API';
import {SvgFromXml} from 'react-native-svg';
import {SVG} from '../Svgs/SVG';
import {ProductItem} from '../Screens/Tabs/Dashboard';

// const ProductItem = ({product}) => {
//   return (
//     <View style={styles.container}>
//       <View style={{flexDirection: 'row'}}>
//         <Image
//           source={{
//             uri: product?.product_image?.[0]?.image
//               ? IMAGE_B_URL + product?.product_image?.[0]?.image
//               : 'https://feb.kuleuven.be/drc/LEER/visiting-scholars-1/image-not-available.jpg/image',
//           }}
//           style={styles.productImage}
//           resizeMode="contain"
//         />
//         <View style={styles.detailsContainer}>
//           <Text numberOfLines={2} style={styles.productName}>
//             {product?.name || 'Name not available'}
//           </Text>
//           <Text>Condition: {product?.condition}</Text>
//           <Text>Stock Quantity: {product?.stock_quantity}</Text>
//           <Text>Delivery Time : {product?.delivery_time}</Text>
//           <Text>Sales Price : {product?.sales_price}</Text>
//         </View>
//       </View>
//       <View style={styles.border} />
//       <View style={{flexDirection: 'row'}}>
//         <TouchableOpacity
//           style={[styles.btn, {marginEnd: 8, backgroundColor: 'skyblue'}]}>
//           <SvgFromXml xml={SVG.edit} height={16} width={16} />
//           <Text style={[styles.btnText]}>Edit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.btn, {marginStart: 8, backgroundColor: 'red'}]}>
//           <SvgFromXml xml={SVG.delete} height={16} width={16} />
//           <Text style={[styles.btnText, {color: 'white'}]}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

export const ProductList = ({data, onDelete}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item}) => <ProductItem item={item} onDelete={onDelete} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 10,
  },
  productImage: {
    width: 80,
    marginRight: 16,
    backgroundColor: '#fff',
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  border: {
    height: 1,
    backgroundColor: '#f1f1f1',
    marginVertical: 5,
  },
  btn: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    marginStart: 4,
  },
});

export default ProductItem;
