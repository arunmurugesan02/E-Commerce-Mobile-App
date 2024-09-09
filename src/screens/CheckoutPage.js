import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import normalize from '../_helpers/normalizer';

const CheckoutPage = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
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

  const handlePlaceOrder = async () => {
    if (!name || !address) {
      Alert.alert('Validation Error', 'Please fill out all fields');
      return;
    }

    try {
      // Normally, you would send order data to an API here
      Alert.alert('Order Placed', `Thank you, ${name}. Your order has been placed!`, [
        { text: 'OK', onPress: () => navigation.navigate('ThankYouPage') },
      ]);

      // Clear cart
      await AsyncStorage.removeItem('cart');
    } catch (error) {
      console.error(error);
    }
  };

  const renderCartSummary = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.cardTitle}>Order Summary</Text>
      {cartItems.map(item => (
        <View key={item.id} style={styles.summaryItem}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.summaryItemTitle}>{item.title}</Text>
            <Text style={styles.summaryItemPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.summaryItemDescription}>{item.description}</Text>
          </View>
        </View>
      ))}
      <View style={styles.summaryTotal}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Checkout</Text>
      {renderCartSummary()}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(20),
    backgroundColor: '#f5f5f5',
    marginBottom:normalize(30)
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: normalize(20),
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: normalize(20),
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: normalize(5),
    color: '#555',
  },
  input: {
    height: normalize(40),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: normalize(10),
    marginBottom: normalize(15),
    backgroundColor: '#fff',
  },
  placeOrderButton: {
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
  summaryCard: {
    backgroundColor: '#fff',
    padding: normalize(15),
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: normalize(10),
    color: '#333',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: normalize(10),
  },
  itemImage: {
    width: normalize(80),
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  summaryItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryItemPrice: {
    fontSize: 14,
    color: '#555',
  },
  summaryItemDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: normalize(5),
  },
  summaryTotal: {
    marginTop: normalize(10),
    paddingVertical: normalize(10),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default CheckoutPage;
