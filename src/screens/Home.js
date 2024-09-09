import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  const [refreshing, setRefreshing] = useState(false);
  const [sortOption, setSortOption] = useState('price');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      setProducts(response.data);
      setCarouselData(response.data);
    } catch (error) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const filteredProducts = products
    .filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOption === 'price') {
        return a.price - b.price;
      } else if (sortOption === 'rating') {
        return b.rating.rate - a.rating.rate;
      }
      return 0;
    });

  const renderProduct = ({item}) => (
    <View style={styles.productCard}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.productRating}>
          ⭐ {item.rating ? item.rating.rate : 'No rating'}
        </Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('ProductDetailsPage', {product: item})
          }>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBanner = ({item}) => (
    <TouchableOpacity
      style={styles.bannerCard}
      onPress={() =>
        navigation.navigate('ProductDetailsPage', {product: item})
      }>
      <Image source={{uri: item.image}} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerText}>Discover More</Text>
        <TouchableOpacity
          style={styles.bannerButton}
          onPress={() =>
            navigation.navigate('ProductDetailsPage', {product: item})
          }>
          <Text style={styles.bannerButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const categories = async category => {
    try {
      const response =
        category === 'all'
          ? await axios.get('https://fakestoreapi.com/products')
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
        styles.categoryCard,
        activeCategory === item.id && styles.activeCategory,
      ]}
      onPress={() => categories(item.id)}>
      <Image source={{uri: item?.image}} style={styles.categoryImage} />
      <Text
        style={[
          styles.categoryText,
          {color: activeCategory === item.id ? '#fff' : '#000'},
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      getCartCount();
    }, [navigation]),
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('CartPage')}
          style={styles.cartIconContainer}>
          <Icon name="shopping-cart" size={30} color="#fff" />
          {cartCount > 0 && (
            <View style={styles.cartCountContainer}>
              <Text style={styles.cartCountText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5722" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <>
          <View style={styles.carouselContainer}>
            <Carousel
              data={carouselData}
              renderItem={renderBanner}
              sliderWidth={width}
              itemWidth={width * 0.85}
              loop
              autoplay
              autoplayInterval={4000}
              paginationStyle={styles.pagination}
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
            />
          </View>

          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              horizontal
              data={categoriesList}
              renderItem={renderCategoryItem}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.featuredSection}>
            <View style={styles.sortOptions}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortOption === 'price' && styles.activeSortButton,
                ]}
                onPress={() => setSortOption('price')}>
                <Text style={styles.sortButtonText}>Price</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortOption === 'rating' && styles.activeSortButton,
                ]}
                onPress={() => setSortOption('rating')}>
                <Text style={styles.sortButtonText}>Rating</Text>
              </TouchableOpacity>
            </View>
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

          <View style={styles.promotionalSection}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <Image
              source={{uri: 'https://via.placeholder.com/300x150'}}
              style={styles.promoImage}
            />
          </View>
        </>
      )}

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>© 2024 My E-Commerce App</Text>
          <View style={styles.socialIcons}>
            <Icon name="facebook" size={20} color="#333" />
            <Icon name="twitter" size={20} color="#333" />
            <Icon name="instagram" size={20} color="#333" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  cartIconContainer: {
    marginLeft: 10,
    position: 'relative',
  },
  cartCountContainer: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#FF5722',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  carouselContainer: {
    height: 200,
    marginBottom: 15,
  },
  bannerCard: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: width * 0.85,
    height: 200,
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  bannerButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  categorySection: {
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    elevation: 3,
    marginTop:15
  },

  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
  },
  activeCategory: {
    backgroundColor: '#FF5722',
    color: '#fff',
  },
  featuredSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    marginTop: 20,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#FF5722',
    marginVertical: 5,
  },
  productRating: {
    fontSize: 14,
    color: '#FFC107',
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
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
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  pagination: {
    bottom: 0,
  },
  dot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#FF5722',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  promotionalSection: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  promoImage: {
    width: width * 0.9,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  footer: {
    padding: 16,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  sortButtonText: {
    color: '#333',
  },
  activeSortButton: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
});

export default HomePage;
