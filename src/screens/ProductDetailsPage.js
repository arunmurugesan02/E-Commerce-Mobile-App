import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from '../_helpers/normalizer';

const ProductDetailsPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {product} = route.params; // Get product data from navigation params

  const [cartItems, setCartItems] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cart = await AsyncStorage.getItem('cart');
        if (cart) setCartItems(JSON.parse(cart));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        // Fetch all products (or use a specific endpoint for related products)
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();

        // Filter related products based on category
        const filteredProducts = data.filter(
          item => item.category === product.category && item.id !== product.id,
        );
        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems();
    fetchRelatedProducts();
  }, [product.category, product.id]);

  const addToCart = async () => {
    try {
      const updatedCart = [...cartItems, product];
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      console.error(error);
    }
  };

  const renderRelatedProduct = ({item}) => (
    <TouchableOpacity
      style={styles.relatedProduct}
      onPress={() =>
        navigation.navigate('ProductDetailsPage', {product: item})
      }>
      <Image source={{uri: item.image}} style={styles.relatedProductImage} />
      <Text style={styles.relatedProductTitle}>{item.title}</Text>
      <Text style={styles.relatedProductPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{uri: product.image}} style={styles.productImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.relatedProductsContainer}>
        <Text style={styles.relatedProductsTitle}>You may also like</Text>
        <FlatList
          data={relatedProducts}
          renderItem={renderRelatedProduct}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.relatedProductsList}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: normalize(300),
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: normalize(15),
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: normalize(-10),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginVertical: normalize(10),
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: normalize(15),
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    padding: normalize(15),
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  relatedProductsContainer: {
    marginTop: normalize(20),
    paddingHorizontal: normalize(15),
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: normalize(10),
  },
  relatedProductsList: {
    paddingVertical: normalize(10),
  },
  relatedProduct: {
    backgroundColor: '#fff',
    marginRight: normalize(15),
    borderRadius: 8,
    padding: normalize(10),
    width: normalize(150),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  relatedProductImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    marginBottom: normalize(10),
  },
  relatedProductTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  relatedProductPrice: {
    fontSize: 12,
    color: '#007BFF',
  },
});

export default ProductDetailsPage;
