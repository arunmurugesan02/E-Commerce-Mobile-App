import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from '../_helpers/normalizer';

const {width, height} = Dimensions.get('screen');

const ProductPage = ({navigation}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };
    fetchProducts();
  }, []);
  console.log(products);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() =>
              navigation.navigate('ProductDetailsPage', {product: item})
            }>
            <Image
              source={item.image}
              style={{width: width * 0.5, height: height * 0.5}}
            />
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(10),
  },
  productItem: {
    padding: normalize(10),
    marginBottom: normalize(10),
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
});

export default ProductPage;
