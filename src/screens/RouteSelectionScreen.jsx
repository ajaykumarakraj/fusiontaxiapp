import React, {useMemo, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';

// --------------------------------------------------
// Sample route data
// Later you can replace this with API data
// --------------------------------------------------

const ROUTES = {
  'Delhi-Aligarh': [
    {id: 1, name: 'Ghaziabad'},
    {id: 2, name: 'Dadri'},
    {id: 3, name: 'Sikandrabad'},
    {id: 4, name: 'Bulandshahr'},
    {id: 5, name: 'Khurja'},
  ],

  'Delhi-Agra': [
    {id: 1, name: 'Ghaziabad'},
    {id: 2, name: 'Noida'},
    {id: 3, name: 'Greater Noida'},
    {id: 4, name: 'Mathura'},
  ],

  'Noida-Aligarh': [
    {id: 1, name: 'Greater Noida'},
    {id: 2, name: 'Sikandrabad'},
    {id: 3, name: 'Bulandshahr'},
    {id: 4, name: 'Khurja'},
  ],
};

const CITIES = [
  'Delhi',
  'Noida',
  'Ghaziabad',
  'Greater Noida',
  'Dadri',
  'Sikandrabad',
  'Bulandshahr',
  'Khurja',
  'Aligarh',
  'Mathura',
  'Agra',
];

const RouteSelectionScreen = ({navigation}) => {
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('Aligarh');

  // Selected intermediate cities
  const [selectedCities, setSelectedCities] = useState([
    'Ghaziabad',
    'Sikandrabad',
    'Bulandshahr',
  ]);

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // --------------------------------------------------
  // Get route cities
  // --------------------------------------------------

  const routeCities = useMemo(() => {
    const key = `${fromCity}-${toCity}`;

    return ROUTES[key] || [];
  }, [fromCity, toCity]);

  // --------------------------------------------------
  // Check selected
  // --------------------------------------------------

  const isSelected = cityName => {
    return selectedCities.includes(cityName);
  };

  // --------------------------------------------------
  // Add city
  // --------------------------------------------------

  const addCity = cityName => {
    if (!selectedCities.includes(cityName)) {
      setSelectedCities(prev => [...prev, cityName]);
    }
  };

  // --------------------------------------------------
  // Remove city
  // --------------------------------------------------

  const removeCity = cityName => {
    setSelectedCities(prev =>
      prev.filter(city => city !== cityName),
    );
  };

  // --------------------------------------------------
  // Change From City
  // --------------------------------------------------

  const changeFromCity = city => {
    if (city === toCity) {
      Alert.alert(
        'Invalid Route',
        'From and To city cannot be same.',
      );
      return;
    }

    setFromCity(city);
    setShowFromDropdown(false);

    // Reset selected cities
    setSelectedCities([]);
  };

  // --------------------------------------------------
  // Change To City
  // --------------------------------------------------

  const changeToCity = city => {
    if (city === fromCity) {
      Alert.alert(
        'Invalid Route',
        'From and To city cannot be same.',
      );
      return;
    }

    setToCity(city);
    setShowToDropdown(false);

    // Reset selected cities
    setSelectedCities([]);
  };

  // --------------------------------------------------
  // Continue
  // --------------------------------------------------

  const handleContinue = () => {
    const route = {
      from: fromCity,
      stops: selectedCities,
      to: toCity,
    };

    console.log('FINAL ROUTE:', route);

    Alert.alert(
      'Route Selected',
      `${fromCity} → ${selectedCities.join(
        ' → ',
      )} → ${toCity}`,
    );

    // Example:
    navigation.navigate('SelectDate', {
      routeData: route,
    });
  };

  // --------------------------------------------------
  // Render city dropdown
  // --------------------------------------------------

  const renderCityDropdown = (
    visible,
    selectedCity,
    onSelect,
    closeDropdown,
  ) => {
    if (!visible) {
      return null;
    }

    return (
      <View style={styles.dropdown}>
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={styles.dropdownScroll}>
          {CITIES.map(city => (
            <TouchableOpacity
              key={city}
              style={[
                styles.dropdownItem,
                city === selectedCity &&
                  styles.selectedDropdownItem,
              ]}
              onPress={() => {
                onSelect(city);
                closeDropdown();
              }}>
              <Text
                style={[
                  styles.dropdownText,
                  city === selectedCity &&
                    styles.selectedDropdownText,
                ]}>
                {city}
              </Text>

              {city === selectedCity && (
                <Text style={styles.checkIcon}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack?.()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Select Route
        </Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* ROUTE SELECTOR */}

        <Text style={styles.sectionTitle}>
          Select Route
        </Text>

        {/* FROM */}

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>From City</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cityInput}
            onPress={() => {
              setShowFromDropdown(!showFromDropdown);
              setShowToDropdown(false);
            }}>
            <View style={styles.cityLeft}>
              <View style={styles.locationCircle}>
                <Text style={styles.locationText}>A</Text>
              </View>

              <Text style={styles.cityText}>
                {fromCity}
              </Text>
            </View>

            <Text style={styles.arrow}>⌄</Text>
          </TouchableOpacity>

          {renderCityDropdown(
            showFromDropdown,
            fromCity,
            changeFromCity,
            () => setShowFromDropdown(false),
          )}
        </View>

        {/* ROUTE ARROW */}

        <View style={styles.smallRouteLine}>
          <View style={styles.verticalLine} />
        </View>

        {/* TO */}

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>To City</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cityInput}
            onPress={() => {
              setShowToDropdown(!showToDropdown);
              setShowFromDropdown(false);
            }}>
            <View style={styles.cityLeft}>
              <View style={styles.locationCircle}>
                <Text style={styles.locationText}>B</Text>
              </View>

              <Text style={styles.cityText}>
                {toCity}
              </Text>
            </View>

            <Text style={styles.arrow}>⌄</Text>
          </TouchableOpacity>

          {renderCityDropdown(
            showToDropdown,
            toCity,
            changeToCity,
            () => setShowToDropdown(false),
          )}
        </View>

        {/* CITIES */}

        <View style={styles.citySectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Cities on Route
            </Text>

            <Text style={styles.sectionSubtitle}>
              Add or remove cities from your route
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {selectedCities.length}
            </Text>
          </View>
        </View>

        {/* ROUTE */}

        <View style={styles.routeContainer}>
          {/* START CITY */}

          <View style={styles.routeRow}>
            <View style={styles.timeline}>
              <View style={styles.startDot} />
              <View style={styles.timelineLine} />
            </View>

            <View style={styles.routeCityCard}>
              <Text style={styles.startLabel}>
                START
              </Text>

              <Text style={styles.routeCityName}>
                {fromCity}
              </Text>
            </View>
          </View>

          {/* INTERMEDIATE CITIES */}

          {routeCities.length > 0 ? (
            routeCities.map((city, index) => {
              const selected = isSelected(city.name);

              return (
                <View
                  key={city.id}
                  style={styles.routeRow}>
                  <View style={styles.timeline}>
                    <View
                      style={[
                        styles.cityDot,
                        selected &&
                          styles.selectedCityDot,
                      ]}
                    />

                    {index !== routeCities.length - 1 && (
                      <View
                        style={styles.timelineLine}
                      />
                    )}
                  </View>

                  <View
                    style={[
                      styles.intermediateCard,
                      selected &&
                        styles.selectedCard,
                    ]}>
                    <View style={styles.cityInfo}>
                      <Text
                        style={[
                          styles.intermediateName,
                          selected &&
                            styles.selectedCityName,
                        ]}>
                        {city.name}
                      </Text>

                      <Text style={styles.stopText}>
                        {selected
                          ? 'Included in route'
                          : 'Not included'}
                      </Text>
                    </View>

                    <View style={styles.actionButtons}>
                      {/* MINUS */}

                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                          styles.actionButton,
                          !selected &&
                            styles.disabledButton,
                        ]}
                        disabled={!selected}
                        onPress={() =>
                          removeCity(city.name)
                        }>
                        <Text
                          style={[
                            styles.minusText,
                            !selected &&
                              styles.disabledText,
                          ]}>
                          −
                        </Text>
                      </TouchableOpacity>

                      {/* PLUS */}

                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                          styles.actionButton,
                          selected &&
                            styles.disabledButton,
                        ]}
                        disabled={selected}
                        onPress={() =>
                          addCity(city.name)
                        }>
                        <Text
                          style={[
                            styles.plusText,
                            selected &&
                              styles.disabledText,
                          ]}>
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.noRouteBox}>
              <Text style={styles.noRouteTitle}>
                No route data found
              </Text>

              <Text style={styles.noRouteText}>
                Route information is not available for
                this city combination.
              </Text>
            </View>
          )}

          {/* END CITY */}

          <View style={styles.routeRow}>
            <View style={styles.timeline}>
              <View style={styles.timelineLineTop} />
              <View style={styles.endDot} />
            </View>

            <View style={styles.routeCityCard}>
              <Text style={styles.endLabel}>END</Text>

              <Text style={styles.routeCityName}>
                {toCity}
              </Text>
            </View>
          </View>
        </View>

        {/* SELECTED SUMMARY */}

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryTitle}>
              Selected Cities
            </Text>

            <Text style={styles.summaryRoute}>
              {fromCity}
              {selectedCities.length > 0 &&
                ` → ${selectedCities.join(' → ')}`}
              {' → '}
              {toCity}
            </Text>
          </View>

          <View style={styles.summaryCount}>
            <Text style={styles.summaryCountNumber}>
              {selectedCities.length}
            </Text>

            <Text style={styles.summaryCountLabel}>
              Stops
            </Text>
          </View>
        </View>

        {/* SPACE FOR BOTTOM BUTTON */}

        <View style={{height: 100}} />
      </ScrollView>

      {/* BOTTOM BUTTON */}

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.continueButton}
          onPress={handleContinue}>
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Text style={styles.continueArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RouteSelectionScreen;

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 32,
    color: '#222222',
    lineHeight: 32,
    marginTop: -3,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },

  headerRight: {
    width: 40,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 12,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: '#777777',
    marginTop: -5,
  },

  inputWrapper: {
    position: 'relative',
    zIndex: 20,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 7,
  },

  cityInput: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E5E9',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  locationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2878E8',
  },

  cityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },

  arrow: {
    fontSize: 24,
    color: '#555555',
    marginTop: -6,
  },

  dropdown: {
    position: 'absolute',
    top: 83,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E5E9',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    zIndex: 999,
  },

  dropdownScroll: {
    maxHeight: 230,
  },

  dropdownItem: {
    minHeight: 48,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },

  selectedDropdownItem: {
    backgroundColor: '#F0F6FF',
  },

  dropdownText: {
    fontSize: 14,
    color: '#333333',
  },

  selectedDropdownText: {
    color: '#2878E8',
    fontWeight: '700',
  },

  checkIcon: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2878E8',
  },

  smallRouteLine: {
    height: 20,
    marginLeft: 30,
  },

  verticalLine: {
    height: '100%',
    width: 2,
    backgroundColor: '#D5D9DF',
  },

  citySectionHeader: {
    marginTop: 28,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  countBadge: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#2878E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  routeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9EBEF',
  },

  routeRow: {
    flexDirection: 'row',
    minHeight: 75,
  },

  timeline: {
    width: 34,
    alignItems: 'center',
    position: 'relative',
  },

  startDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#2878E8',
    borderWidth: 3,
    borderColor: '#DDEBFF',
    zIndex: 2,
  },

  endDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#20A464',
    borderWidth: 3,
    borderColor: '#DDF7EA',
    zIndex: 2,
  },

  cityDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#B8BEC8',
    zIndex: 2,
  },

  selectedCityDot: {
    backgroundColor: '#2878E8',
  },

  timelineLine: {
    position: 'absolute',
    top: 10,
    bottom: -10,
    width: 2,
    backgroundColor: '#D5D9DF',
  },

  timelineLineTop: {
    position: 'absolute',
    top: -30,
    bottom: 5,
    width: 2,
    backgroundColor: '#D5D9DF',
  },

  routeCityCard: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 15,
  },

  startLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2878E8',
    marginBottom: 3,
  },

  endLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#20A464',
    marginBottom: 3,
  },

  routeCityName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#202124',
  },

  intermediateCard: {
    flex: 1,
    minHeight: 65,
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    marginLeft: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EDF0F3',
  },

  selectedCard: {
    backgroundColor: '#F0F6FF',
    borderColor: '#C9DFFF',
  },

  cityInfo: {
    flex: 1,
  },

  intermediateName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#303238',
  },

  selectedCityName: {
    color: '#2878E8',
  },

  stopText: {
    fontSize: 11,
    color: '#8A8F98',
    marginTop: 3,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 7,
    marginLeft: 10,
  },

  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8DDE4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  minusText: {
    fontSize: 22,
    color: '#E74C3C',
    fontWeight: '500',
    lineHeight: 24,
  },

  plusText: {
    fontSize: 22,
    color: '#2878E8',
    fontWeight: '500',
    lineHeight: 24,
  },

  disabledButton: {
    backgroundColor: '#F1F2F4',
    borderColor: '#E5E7EA',
  },

  disabledText: {
    color: '#B9BDC3',
  },

  noRouteBox: {
    padding: 20,
    backgroundColor: '#FFF9E8',
    borderRadius: 12,
    marginBottom: 15,
  },

  noRouteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8A6500',
    marginBottom: 5,
  },

  noRouteText: {
    fontSize: 12,
    color: '#907B39',
    lineHeight: 18,
  },

  summaryCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E8EAED',
  },

  summaryTitle: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 6,
  },

  summaryRoute: {
    fontSize: 13,
    fontWeight: '600',
    color: '#25272B',
    maxWidth: 260,
    lineHeight: 19,
  },

  summaryCount: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E7E9EC',
    paddingLeft: 10,
  },

  summaryCountNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2878E8',
  },

  summaryCountLabel: {
    fontSize: 10,
    color: '#777777',
    marginTop: 2,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9EAEC',
  },

  continueButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2878E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  continueArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    marginLeft: 12,
  },
});