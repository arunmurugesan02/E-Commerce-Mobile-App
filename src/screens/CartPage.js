import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import normalize from '../_helpers/normalizer';

const CartPage = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cart = await AsyncStorage.getItem('cart');
        if (cart) {
          const items = JSON.parse(cart);
          setCartItems(items);
          const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
          setTotal(totalAmount);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCartItems();
  }, []);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Your cart is empty. Add items to the cart before proceeding to checkout.',
      );
      return;
    }
    navigation.navigate('CheckoutPage');
  };

  const renderCartItem = ({ item }) => (
    <Pressable
      style={styles.cartItem}
      onPress={() =>
        navigation.navigate('ProductDetailsPage', { product: item, btnkey: true })
      }>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyMessage}>Your cart is empty!</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
            style={styles.cartList}
          />
          <View style={styles.summaryContainer}>
            <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}>
              <Text style={styles.buttonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(15),
    backgroundColor: '#f8f9fa', // Updated background color for a fresh look
  },
  cartItem: {
    flexDirection: 'row',
    padding: normalize(15),
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: normalize(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  itemImage: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: 10,
    marginRight: normalize(15),
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#FF5722', // Updated color for a modern look
  },
  cartList: {
    marginBottom: normalize(30),
  },
  summaryContainer: {
    padding: normalize(15),
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: normalize(15),
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#FF5722', // Updated button color
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(20),
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: normalize(3) },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyMessage: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: normalize(30),
    color: '#888',
  },
});

export default CartPage;

