import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MIN_PRICE = 50;
const MAX_PRICE = 2000;
const STEP = 50;

const PricePerSeatScreen = ({ navigation, route }) => {
  // Previous screens ka complete data
  const rideData = route?.params?.rideData || {};

  const [price, setPrice] = useState(
    rideData?.pricePerSeat || 300
  );

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

  const handleContinue = () => {
    const finalRideData = {
      ...rideData,
      pricePerSeat: price,
    };

    console.log('price Data:', finalRideData);

    // Next screen
    navigation.navigate('SelectCar', {
      rideData: finalRideData,
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Price
        </Text>

        <View style={{ width: 42 }} />
      </View>

      <View style={styles.content}>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Icon
            name="cash-outline"
            size={42}
            color="#1976D2"
          />
        </View>

        <Text style={styles.title}>
          Set your price per seat
        </Text>

        <Text style={styles.subtitle}>
          Choose a fair price to attract passengers
        </Text>

        {/* Price Box */}
        <View style={styles.priceBox}>

          {/* Minus */}
          <TouchableOpacity
            style={[
              styles.adjustButton,
              price <= MIN_PRICE &&
                styles.disabledAdjustButton,
            ]}
            onPress={decreasePrice}
            disabled={price <= MIN_PRICE}
          >
            <Text
              style={[
                styles.adjustText,
                price <= MIN_PRICE &&
                  styles.disabledAdjustText,
              ]}
            >
              −
            </Text>
          </TouchableOpacity>

          {/* Price */}
          <View style={styles.priceCenter}>
            <Text style={styles.currency}>₹</Text>

            <Text style={styles.price}>
              {price}
            </Text>

            <Text style={styles.perSeat}>
              / seat
            </Text>
          </View>

          {/* Plus */}
          <TouchableOpacity
            style={[
              styles.adjustButton,
              price >= MAX_PRICE &&
                styles.disabledAdjustButton,
            ]}
            onPress={increasePrice}
            disabled={price >= MAX_PRICE}
          >
            <Text
              style={[
                styles.adjustText,
                price >= MAX_PRICE &&
                  styles.disabledAdjustText,
              ]}
            >
              +
            </Text>
          </TouchableOpacity>

        </View>

        {/* Helper */}
        <View style={styles.helperContainer}>
          <Icon
            name="information-circle-outline"
            size={18}
            color="#777"
          />

          <Text style={styles.helperText}>
            Min ₹{MIN_PRICE} • Max ₹{MAX_PRICE} •
            Step ₹{STEP}
          </Text>
        </View>

        {/* Passenger Info */}
        {rideData?.passengers && (
          <View style={styles.infoCard}>
            <Icon
              name="people-outline"
              size={22}
              color="#1976D2"
            />

            <Text style={styles.infoText}>
              {rideData.passengers}{' '}
              {rideData.passengers === 1
                ? 'passenger'
                : 'passengers'}
            </Text>
          </View>
        )}

      </View>

      {/* Continue */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Icon
            name="arrow-forward"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default PricePerSeatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 45,
  },

  iconContainer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#EAF3FF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },

  priceBox: {
    height: 130,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDE2E8',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    elevation: 2,
  },

  adjustButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EAF3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledAdjustButton: {
    backgroundColor: '#F0F1F2',
  },

  adjustText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1976D2',
    lineHeight: 30,
  },

  disabledAdjustText: {
    color: '#aaa',
  },

  priceCenter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222',
    marginRight: 3,
    marginBottom: 6,
  },

  price: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1976D2',
  },

  perSeat: {
    fontSize: 13,
    color: '#777',
    marginLeft: 5,
    marginBottom: 8,
  },

  helperContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },

  helperText: {
    color: '#777',
    fontSize: 13,
    marginLeft: 5,
  },

  infoCard: {
    marginTop: 30,
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#EAF3FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    marginLeft: 8,
    color: '#1976D2',
    fontSize: 15,
    fontWeight: '600',
  },

  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  continueButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});