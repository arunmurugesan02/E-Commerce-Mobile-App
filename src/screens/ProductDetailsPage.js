import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';

const ProductDetailsPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product, btnkey } = route.params;

  const [cartItems, setCartItems] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cart = await AsyncStorage.getItem('cart');
        if (cart) setCartItems(JSON.parse(cart));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const wish = await AsyncStorage.getItem('wishlist');
        if (wish) setWishlist(JSON.parse(wish));
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        const filteredProducts = data.filter(
          item => item.category === product.category && item.id !== product.id,
        );
        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems();
    fetchWishlist();
    fetchRelatedProducts();
  }, [product.category, product.id]);

  const addToCart = async () => {
    try {
      const updatedCart = [...cartItems, { ...product, quantity }];
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      Alert.alert('Success', 'Product added to cart!');
    } catch (error) {
      console.error(error);
    }
  };

  const addToWishlist = async () => {
    try {
      const updatedWishlist = [...wishlist, product];
      await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      Alert.alert('Success', 'Product added to wishlist!');
    } catch (error) {
      console.error(error);
    }
  };

  const shareProduct = async () => {
    try {
      await Share.share({
        message: `${product.title} - ${product.description}\nCheck it out: ${product.image}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderRelatedProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.relatedProduct}
      onPress={() =>
        navigation.navigate('ProductDetailsPage', { product: item })
      }>
      <Image source={{ uri: item.image }} style={styles.relatedProductImage} />
      <Text style={styles.relatedProductTitle}>{item.title}</Text>
      <Text style={styles.relatedProductPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.ratingText}>Rating: {product.rating.rate} ({product.rating.count} reviews)</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          {
            !btnkey && (
              <>
                <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addToWishlistButton} onPress={addToWishlist}>
                  <Text style={styles.buttonText}>Add to Wishlist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton} onPress={shareProduct}>
                  <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
              </>
            )
          }
        </View>
      </View>
      <View style={styles.relatedProductsContainer}>
        <Text style={styles.relatedProductsTitle}>You May Also Like</Text>
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
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FF5722',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    color: '#444444',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  addToWishlistButton: {
    backgroundColor: '#808080',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  relatedProductsContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  relatedProductsList: {
    paddingVertical: 10,
  },
  relatedProduct: {
    backgroundColor: '#FFFFFF',
    marginRight: 15,
    borderRadius: 15,
    padding: 10,
    width: 150,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  relatedProductImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  relatedProductTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  relatedProductPrice: {
    fontSize: 12,
    color: '#FF5722',
  },
});

export default ProductDetailsPage;
