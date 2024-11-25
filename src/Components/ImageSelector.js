import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SvgFromXml} from 'react-native-svg';
import {SVG} from '../Svgs/SVG';
import ImageCropPicker from 'react-native-image-crop-picker';

const ImageSelector = ({getImages}) => {
  const [images, setImages] = useState([]);
  hanldeImages = async () => {
    try {
      const response = await ImageCropPicker.openPicker({multiple: true});
      setImages([...response, ...images]);
      if (getImages) getImages([...response, ...images]);
      console.warn(response);
    } catch (e) {
      console.warn('ImageSelector Errror :  ', e);
    }
  };
  return (
    <View>
      <Text style={styles.label}>Images</Text>
      <FlatList
        style={{marginBottom: 16}}
        horizontal
        data={images}
        ListHeaderComponent={() => {
          return (
            <TouchableOpacity
              onPress={hanldeImages}
              style={[
                styles.image,
                {alignItems: 'center', justifyContent: 'center', marginEnd: 10},
              ]}>
              <SvgFromXml xml={SVG.add} height={40} width={40} />
            </TouchableOpacity>
          );
        }}
        renderItem={({item}) => {
          return (
            <View style={{marginHorizontal: 8}}>
              <Image style={styles.image} source={{uri: item.path}} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default ImageSelector;

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  label: {
    color: '#000',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 10,
  },
});
