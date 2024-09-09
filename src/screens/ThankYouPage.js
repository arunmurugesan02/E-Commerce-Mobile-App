import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import normalize from '../_helpers/normalizer';

const ThankYouPage = () => {
  const navigation = useNavigation();

  const handleGoHome = () => {
    navigation.navigate('HomePage');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://img.icons8.com/ios/452/checked.png'}} // Replace with your own image URL or local asset
        style={styles.thankYouImage}
      />
      <Text style={styles.header}>Thank You!</Text>
      <Text style={styles.message}>
        Your order has been placed successfully.
      </Text>
      <Text style={styles.subMessage}>
        You will receive a confirmation email shortly.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
    backgroundColor: '#f5f5f5',
  },
  thankYouImage: {
    width: normalize(100),
    height: normalize(100),
    marginBottom: normalize(20),
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: normalize(10),
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: normalize(10),
    color: '#333',
  },
  subMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: normalize(20),
    color: '#555',
  },
  button: {
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
});

export default ThankYouPage;
