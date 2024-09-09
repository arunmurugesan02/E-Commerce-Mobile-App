import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
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

const CartPage = ({navigation}) => {
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

  const renderCartItem = ({item}) => (
    <Pressable
      style={styles.cartItem}
      onPress={() =>
        navigation.navigate('ProductDetailsPage', {product: item, btnkey:true})
      }>
      <Image source={{uri: item.image}} style={styles.itemImage} />
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
            keyExtractor={item => item.id.toString()}
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
    padding: normalize(10),
    backgroundColor: '#f5f5f5',
  },
  cartItem: {
    flexDirection: 'row',
    padding: normalize(10),
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: normalize(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: normalize(2)},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemImage: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: 5,
    marginRight: normalize(10),
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
  },
  cartList: {
    marginBottom: normalize(20),
  },
  summaryContainer: {
    padding: normalize(10),
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: normalize(2)},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: normalize(10),
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: normalize(15),
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: normalize(20),
    color: '#888',
  },
});
export default CartPage;
