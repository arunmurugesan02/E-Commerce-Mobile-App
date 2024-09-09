import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import CartPage from './src/screens/CartPage';
import CheckoutPage from './src/screens/CheckoutPage';
import HomePage from './src/screens/Home';
import ProductDetailsPage from './src/screens/ProductDetailsPage';
import ThankYouPage from './src/screens/ThankYouPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name="ProductDetailsPage"
          component={ProductDetailsPage}
          options={{title: 'Product Details'}}
        />
        <Stack.Screen
          name="CartPage"
          component={CartPage}
          options={{title: 'Cart'}}
        />
        <Stack.Screen
          name="CheckoutPage"
          component={CheckoutPage}
          options={{title: 'Checkout'}}
        />
        <Stack.Screen
          name="ThankYouPage"
          component={ThankYouPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
