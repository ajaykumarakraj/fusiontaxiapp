import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const MIN_PRICE = 50;
const MAX_PRICE = 2000;
const STEP = 50;

const PricePerSeatScreen = ({ navigation }) => {
  const [price, setPrice] = useState(300);

  const increasePrice = () => {
    if (price < MAX_PRICE) {
      setPrice(price + STEP);
    }
  };

  const decreasePrice = () => {
    if (price > MIN_PRICE) {
      setPrice(price - STEP);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set your price per seat</Text>
      <Text style={styles.subtitle}>
        Choose a fair price to attract passengers
      </Text>

      <View style={styles.priceBox}>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={decreasePrice}
          disabled={price <= MIN_PRICE}
        >
          <Text style={styles.adjustText}>−</Text>
        </TouchableOpacity>

        <View style={styles.priceCenter}>
          <Text style={styles.currency}>₹</Text>
          <Text style={styles.price}>{price}</Text>
        </View>

        <TouchableOpacity
          style={styles.adjustButton}
          onPress={increasePrice}
          disabled={price >= MAX_PRICE}
        >
          <Text style={styles.adjustText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.helperText}>
        Min ₹{MIN_PRICE} • Max ₹{MAX_PRICE}
      </Text>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          // navigation.navigate('NextScreen', { pricePerSeat: price });
          console.log('Price per seat:', price);
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PricePerSeatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
  },
  adjustButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustText: {
    fontSize: 26,
    fontWeight: '600',
  },
  priceCenter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: 22,
    fontWeight: '600',
    marginRight: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
  },
  helperText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 12,
  },
  continueButton: {
    marginTop: 50,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
