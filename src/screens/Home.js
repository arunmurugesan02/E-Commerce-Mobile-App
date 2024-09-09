import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel'; // Add carousel package
import Icon from 'react-native-vector-icons/MaterialIcons';
import normalize from '../_helpers/normalizer';
import {categoriesList} from '../constants/constants';

const {width, height} = Dimensions.get('window');

const HomePage = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [carouselData, setCarouselData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      setProducts(response.data);
      setCarouselData(response.data);
    } catch (error) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getCartCount = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      if (cart) {
        const cartItems = JSON.parse(cart);
        setCartCount(cartItems.length);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderProduct = ({item}) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() =>
        navigation.navigate('ProductDetailsPage', {product: item})
      }>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.productRating}>
          ⭐ {item.rating ? item.rating.rate : 'No rating'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderBanner = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetailsPage', {product: item})
        }>
        <Image source={{uri: item.image}} style={styles.bannerImage} />
      </TouchableOpacity>
    );
  };

  const categories = async category => {
    try {
      const response =
        category === 'all'
          ? await axios.get(`https://fakestoreapi.com/products`)
          : await axios.get(
              `https://fakestoreapi.com/products/category/${category}`,
            );
      setProducts(response.data);
      setActiveCategory(category);
    } catch (_) {}
  };

  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.activeCategory,
      ]}
      onPress={() => categories(item.id)}>
      <Text
        style={[
          styles.categoryText,
          {color: activeCategory === item.id ? '#fff' : '#000'},
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      getCartCount();
    }, [navigation]),
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('CartPage')}
          style={styles.cartIconContainer}>
          <Icon name="shopping-cart" size={30} color="#000" />
          {cartCount > 0 && (
            <View style={styles.cartCountContainer}>
              <Text style={styles.cartCountText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <>
          {/* Hero Banner Carousel */}
          <View style={{marginVertical: 30}}>
            <Carousel
              data={carouselData}
              renderItem={renderBanner}
              sliderWidth={width}
              activeSlideAlignment="center"
              itemWidth={width * 0.7}
              loop
              autoplay
              autoplayInterval={3000}
            />
          </View>

          {/* Category Section */}
          <View style={styles.categoryContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              horizontal
              data={categoriesList}
              renderItem={renderCategoryItem}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Product List */}
          <View style={styles.productListContainer}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <FlatList
              data={filteredProducts}
              keyExtractor={item => item.id.toString()}
              renderItem={renderProduct}
              ListEmptyComponent={
                <Text style={styles.emptyMessage}>No products found</Text>
              }
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(15),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    height: normalize(40),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: normalize(5),
    paddingHorizontal: normalize(10),
  },
  cartIconContainer: {
    marginLeft: normalize(10),
    position: 'relative',
  },
  cartCountContainer: {
    position: 'absolute',
    top: normalize(-5),
    right: normalize(-10),
    backgroundColor: '#FF0000',
    borderRadius: 12,
    width: normalize(24),
    height: normalize(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  carouselContainer: {
    height: normalize(200),
    marginBottom: normalize(15),
  },
  bannerImage: {
    width: normalize(312),
    height: normalize(212),
    borderRadius: 8,
    resizeMode: 'stretch',
  },
  categoryContainer: {
    paddingHorizontal: normalize(15),
    marginBottom: normalize(15),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: normalize(10),
    color: '#333',
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: normalize(10),
    marginRight: normalize(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  productListContainer: {
    paddingHorizontal: normalize(15),
  },
  productItem: {
    backgroundColor: '#fff',
    marginBottom: normalize(15),
    padding: normalize(15),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
  },
  productImage: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: 10,
    marginRight: normalize(15),
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#007BFF',
    marginVertical: normalize(5),
  },
  productRating: {
    fontSize: 14,
    color: '#FF9900',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: normalize(20),
    fontSize: 16,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(20),
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  activeCategory: {
    backgroundColor: 'green',
  },
});

export default HomePage;
