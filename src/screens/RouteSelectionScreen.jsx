import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import MapView, {
  Marker,
  Polyline,
} from 'react-native-maps';

import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import polyline from '@mapbox/polyline';

const API_URL =
  'https://api.squarebigha.com/oldApi/api/v1';


// --------------------------------------------------
// FORMAT ADDRESS
// --------------------------------------------------

const getAddress = location => {
  if (!location) {
    return '';
  }

  return (
    location.formatted_address ||
    location.address ||
    location.name ||
    ''
  );
};

// --------------------------------------------------
// SCREEN
// --------------------------------------------------

const RouteSelectionScreen = ({
  navigation,
  route,
}) => {
  // --------------------------------------------------
  // RIDE DATA
  // --------------------------------------------------

  const rideData = route?.params?.rideData || {};
console.log('Ride Data:', rideData.dropLocation.latitude);
  const pickupLocation =
    rideData?.pickupLocation || null;


  const dropLocation =
    rideData?.dropLocation || null;


  // --------------------------------------------------
  // MAP REF
  // --------------------------------------------------

  const mapRef = useRef(null);


  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [fromCity, setFromCity] = useState('');

  const [toCity, setToCity] = useState('');

  const [selectedCities, setSelectedCities] =
    useState([]);

  const [routeCities, setRouteCities] =
    useState([]);

  const [routeData, setRouteData] =
    useState(null);

  const [loadingRoute, setLoadingRoute] =
    useState(false);

  const [showFromDropdown, setShowFromDropdown] =
    useState(false);

  const [showToDropdown, setShowToDropdown] =
    useState(false);
const [citySearch, setCitySearch] = useState('');
console.log('City Search:', citySearch);
  // --------------------------------------------------
  // INITIAL SOURCE / DESTINATION
  // --------------------------------------------------

  useEffect(() => {
    const pickupAddress =
      getAddress(pickupLocation);

    const dropAddress =
      getAddress(dropLocation);

    setFromCity(pickupAddress);
    setToCity(dropAddress);
  }, [
    pickupLocation?.latitude,
    pickupLocation?.longitude,
    dropLocation?.latitude,
    dropLocation?.longitude,
  ]);


  // --------------------------------------------------
  // GET ROUTE
  // --------------------------------------------------

  useEffect(() => {
    if (!pickupLocation || !dropLocation) {
      return;
    }

    getRouteCities();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pickupLocation?.latitude,
    pickupLocation?.longitude,
    dropLocation?.latitude,
    dropLocation?.longitude,
  ]);


  // --------------------------------------------------
  // GET ROUTE FROM API
  // --------------------------------------------------

  const getRouteCities = async () => {
    try {
      const credentials =
        await Keychain.getGenericPassword();

      if (!credentials) {
        Alert.alert(
          'Session Expired',
          'Please login again.',
        );

        return;
      }


      // ------------------------------------------------
      // CHECK PICKUP COORDINATES
      // ------------------------------------------------

      if (
        pickupLocation?.latitude == null ||
        pickupLocation?.longitude == null
      ) {
        Alert.alert(
          'Pickup Location Error',
          'Pickup latitude or longitude is missing.',
        );

        return;
      }


      // ------------------------------------------------
      // CHECK DESTINATION COORDINATES
      // ------------------------------------------------

      if (
        dropLocation?.latitude == null ||
        dropLocation?.longitude == null
      ) {
        Alert.alert(
          'Destination Error',
          'Destination latitude or longitude is missing.',
        );

        return;
      }


      // ------------------------------------------------
      // TOKEN
      // ------------------------------------------------

      const token = credentials.password;


      // ------------------------------------------------
      // PAYLOAD
      // ------------------------------------------------

      const payload = {
        source: {
          address:
            getAddress(pickupLocation),

          latitude: Number(
            pickupLocation.latitude,
          ),

          longitude: Number(
            pickupLocation.longitude,
          ),

          place_id:
            pickupLocation.place_id || null,
        },

        destination: {
          address:
            getAddress(dropLocation),

          latitude: Number(
            dropLocation.latitude,
          ),

          longitude: Number(
            dropLocation.longitude,
          ),

          place_id:
            dropLocation.place_id || null,
        },
      };


    
      console.log(
        'ROUTE PAYLOAD:',
        payload,
      );

    


      setLoadingRoute(true);


      // ------------------------------------------------
      // API CALL
      // ------------------------------------------------

      const response = await axios.post(
        `${API_URL}/rides/route`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );


      console.log(
        'ROUTE API RESPONSE:',
        response.data,
      );


      // ------------------------------------------------
      // SUCCESS CHECK
      // ------------------------------------------------

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
          'Unable to calculate route.',
        );
      }


      const data =
        response.data?.data;


      if (!data) {
        throw new Error(
          'Route data was not returned by API.',
        );
      }


      // ------------------------------------------------
      // SAVE ROUTE DATA
      // ------------------------------------------------

      setRouteData(data);


      // ------------------------------------------------
      // SOURCE / DESTINATION
      // ------------------------------------------------

      setFromCity(
        getAddress(pickupLocation),
      );

      setToCity(
        getAddress(dropLocation),
      );


      // ------------------------------------------------
      // ROUTE CITIES
      // ------------------------------------------------

      const cities =
        data?.cities || [];

setRouteCities(cities);

// Initially show/select only 3 cities.
setSelectedCities(
  cities.slice(0, 3).map(city => city.name),
);

setCitySearch('');

      console.log(
        'ROUTE CITIES:',
        data.cities,
      );


    } catch (error) {
      console.error(
        '================================',
      );

      console.error(
        'ROUTE STATUS:',
        error.response?.status,
      );

      console.error(
        'ROUTE DATA:',
        error.response?.data,
      );

      console.error(
        'ROUTE ERROR:',
        error.message,
      );

  

      Alert.alert(
        'Route Error',
        error.response?.data?.message ||
        error.message ||
        'Unable to calculate route.',
      );

    } finally {
      setLoadingRoute(false);
    }
  };


  // --------------------------------------------------
  // DECODE GOOGLE POLYLINE
  // --------------------------------------------------

  const routeCoordinates = useMemo(() => {
    if (!routeData?.polyline) {
      return [];
    }

    try {
      const decoded =
        polyline.decode(
          routeData.polyline,
        );

      return decoded.map(
        ([latitude, longitude]) => ({
          latitude: Number(latitude),
          longitude: Number(longitude),
        }),
      );

    } catch (error) {
      console.error(
        'POLYLINE DECODE ERROR:',
        error,
      );

      return [];
    }
  }, [routeData?.polyline]);


  // --------------------------------------------------
  // FIT MAP TO ROUTE
  // --------------------------------------------------

  useEffect(() => {
    if (
      !mapRef.current ||
      routeCoordinates.length === 0
    ) {
      return;
    }

    const timer = setTimeout(() => {
      try {
        mapRef.current.fitToCoordinates(
          routeCoordinates,
          {
            edgePadding: {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50,
            },
            animated: true,
          },
        );
      } catch (error) {
        console.log(
          'MAP FIT ERROR:',
          error,
        );
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [routeCoordinates]);


  // --------------------------------------------------
  // FORMAT DURATION
  // --------------------------------------------------

  const formattedDuration = useMemo(() => {
    if (!routeData?.duration_seconds) {
      return '--';
    }

    const totalSeconds =
      Number(routeData.duration_seconds);

    const hours = Math.floor(
      totalSeconds / 3600,
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60,
    );

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }, [routeData?.duration_seconds]);


  // --------------------------------------------------
  // SELECTED CHECK
  // --------------------------------------------------

  const isSelected = cityName => {
    return selectedCities.includes(cityName);
  };




const filteredCities = useMemo(() => {
  const query = citySearch.trim().toLowerCase();

  if (!query) {
    return [];
  }

  return routeCities.filter(city => {
    const name = city.name?.toLowerCase() || '';

    return (
      name.includes(query) &&
      name !== fromCity.toLowerCase() &&
      name !== toCity.toLowerCase()
    );
  });
}, [routeCities, citySearch, fromCity, toCity]);

const addCity = city => {
  setSelectedCities(prev =>
    prev.includes(city.name)
      ? prev
      : [...prev, city.name]
  );

  // Keep newly added city available in the route list/map.
  setRouteCities(prev => {
    const exists = prev.some(
      item => item.name === city.name
    );

    return exists ? prev : [...prev, city];
  });

  setCitySearch('');
};

const removeCity = cityName => {
  setSelectedCities(prev =>
    prev.filter(name => name !== cityName)
  );
};


  // --------------------------------------------------
  // CHANGE FROM
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

    setSelectedCities([]);
  };


  // --------------------------------------------------
  // CHANGE TO
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

    setSelectedCities([]);
  };


  // --------------------------------------------------
  // CONTINUE
  // --------------------------------------------------

  const handleContinue = () => {
    if (!fromCity || !toCity) {
      Alert.alert(
        'Route Required',
        'Please select pickup and destination.',
      );

      return;
    }


    if (loadingRoute) {
      Alert.alert(
        'Please Wait',
        'Route is still being calculated.',
      );

      return;
    }


    if (!routeData) {
      Alert.alert(
        'Route Required',
        'Please wait until the route is calculated.',
      );

      return;
    }


    // ------------------------------------------------
    // SELECTED CITY OBJECTS
    // ------------------------------------------------

 const selectedStopObjects = routeCities.filter(
  city => selectedCities.includes(city.name)
);

    // ------------------------------------------------
    // FINAL ROUTE
    // ------------------------------------------------

    const finalRoute = {
      from_latitude: rideData.pickupLocation.latitude,
      from_longitude: rideData.pickupLocation.longitude,
      to_latitude: rideData.dropLocation.latitude,
      to_longitude: rideData.dropLocation.longitude,
      from: fromCity,

      to: toCity,

      stops: selectedCities,

      stopDetails: selectedStopObjects,

      distance_km:
        routeData.distance_km,

      distance_meters:
        routeData.distance_meters,

      duration:
        routeData.duration,

      duration_seconds:
        routeData.duration_seconds,

     

      route_cities:
        routeCities,
    };


    console.log(
      '================================',finalRoute
    );

    console.log(
      'FINAL ROUTE:',
      finalRoute,
    );

   
 

    // ------------------------------------------------
    // NEXT SCREEN
    // ------------------------------------------------

    navigation.navigate(
      'SelectDate',
      {
       
        rideData: finalRoute,
      },
    );
  };


  // --------------------------------------------------
  // RENDER CITY DROPDOWN
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

    const cities = [];

    if (fromCity) {
      cities.push(fromCity);
    }

    if (
      toCity &&
      toCity !== fromCity
    ) {
      cities.push(toCity);
    }

    return (
      <View style={styles.dropdown}>
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={styles.dropdownScroll}
        >
          {cities.map(
            (city, index) => (
              <TouchableOpacity
                key={`${city}-${index}`}
                style={[
                  styles.dropdownItem,
                  city === selectedCity &&
                  styles.selectedDropdownItem,
                ]}
                onPress={() => {
                  onSelect(city);
                  closeDropdown();
                }}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    city === selectedCity &&
                    styles.selectedDropdownText,
                  ]}
                >
                  {city}
                </Text>

                {city === selectedCity && (
                  <Text
                    style={
                      styles.checkIcon
                    }
                  >
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </View>
    );
  };


  // --------------------------------------------------
  // MAP REGION
  // --------------------------------------------------

  const mapInitialRegion = useMemo(() => {
    if (
      pickupLocation?.latitude == null ||
      pickupLocation?.longitude == null
    ) {
      return {
        latitude: 20.5937,
        longitude: 78.9629,
        latitudeDelta: 5,
        longitudeDelta: 5,
      };
    }

    return {
      latitude: Number(
        pickupLocation.latitude,
      ),

      longitude: Number(
        pickupLocation.longitude,
      ),

      latitudeDelta: 1,
      longitudeDelta: 1,
    };
  }, [
    pickupLocation?.latitude,
    pickupLocation?.longitude,
  ]);


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />


      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation?.goBack?.()
          }
        >
          <Text
            style={styles.backIcon}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <Text
          style={styles.headerTitle}
        >
          Select Route
        </Text>

        <View
          style={styles.headerRight}
        />
      </View>


      {/* CONTENT */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >

        {/* ROUTE SELECTOR */}

        <Text
          style={styles.sectionTitle}
        >
          Select Route
        </Text>


        {/* FROM */}

        <View
          style={styles.inputWrapper}
        >
          <Text
            style={styles.inputLabel}
          >
            From City
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cityInput}
            onPress={() => {
              setShowFromDropdown(
                !showFromDropdown,
              );

              setShowToDropdown(false);
            }}
          >
            <View
              style={styles.cityLeft}
            >
              <View
                style={
                  styles.locationCircle
                }
              >
                <Text
                  style={
                    styles.locationText
                  }
                >
                  A
                </Text>
              </View>

              <Text
                style={styles.cityText}
                numberOfLines={2}
              >
                {fromCity || 'Pickup'}
              </Text>
            </View>

            <Text
              style={styles.arrow}
            >
              ⌄
            </Text>
          </TouchableOpacity>

          {renderCityDropdown(
            showFromDropdown,
            fromCity,
            changeFromCity,
            () =>
              setShowFromDropdown(false),
          )}
        </View>


        {/* ROUTE LINE */}

        <View
          style={styles.smallRouteLine}
        >
          <View
            style={styles.verticalLine}
          />
        </View>


        {/* TO */}

        <View
          style={styles.inputWrapper}
        >
          <Text
            style={styles.inputLabel}
          >
            To City
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cityInput}
            onPress={() => {
              setShowToDropdown(
                !showToDropdown,
              );

              setShowFromDropdown(false);
            }}
          >
            <View
              style={styles.cityLeft}
            >
              <View
                style={
                  styles.locationCircle
                }
              >
                <Text
                  style={
                    styles.locationText
                  }
                >
                  B
                </Text>
              </View>

              <Text
                style={styles.cityText}
                numberOfLines={2}
              >
                {toCity || 'Destination'}
              </Text>
            </View>

            <Text
              style={styles.arrow}
            >
              ⌄
            </Text>
          </TouchableOpacity>

          {renderCityDropdown(
            showToDropdown,
            toCity,
            changeToCity,
            () =>
              setShowToDropdown(false),
          )}
        </View>


        {/* LOADING */}

        {loadingRoute && (
          <View
            style={styles.loadingBox}
          >
            <ActivityIndicator
              size="small"
              color="#2878E8"
            />

            <Text
              style={styles.loadingText}
            >
              Calculating route...
            </Text>
          </View>
        )}


        {/* ROUTE INFORMATION */}

        {routeData &&
          !loadingRoute && (
            <View
              style={
                styles.routeInfoCard
              }
            >
              <View
                style={
                  styles.routeInfoItem
                }
              >
                <Text
                  style={
                    styles.routeInfoLabel
                  }
                >
                  Distance
                </Text>

                <Text
                  style={
                    styles.routeInfoValue
                  }
                >
                  {routeData.distance_km} km
                </Text>
              </View>

              <View
                style={
                  styles.routeInfoDivider
                }
              />

              <View
                style={
                  styles.routeInfoItem
                }
              >
                <Text
                  style={
                    styles.routeInfoLabel
                  }
                >
                  Estimated Time
                </Text>

                <Text
                  style={
                    styles.routeInfoValue
                  }
                >
                  {formattedDuration}
                </Text>
              </View>
            </View>
          )}


        {/* MAP */}

        {routeData &&
          routeCoordinates.length > 0 && (
            <View
              style={styles.mapCard}
            >
              <View
                style={styles.mapHeader}
              >
                <Text
                  style={styles.mapTitle}
                >
                  Route Preview
                </Text>

                <Text
                  style={styles.mapSubtitle}
                >
                  {routeData.distance_km} km
                </Text>
              </View>

              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={
                  mapInitialRegion
                }
                showsUserLocation={false}
                showsMyLocationButton={false}
                loadingEnabled
              >

                {/* PICKUP */}

                <Marker
                  coordinate={{
                    latitude: Number(
                      pickupLocation.latitude,
                    ),
                    longitude: Number(
                      pickupLocation.longitude,
                    ),
                  }}
                  title="Pickup"
                  description={
                    getAddress(
                      pickupLocation,
                    )
                  }
                />


                {/* ROUTE */}

                <Polyline
                  coordinates={
                    routeCoordinates
                  }
                  strokeWidth={5}
                  strokeColor="#2878E8"
                />


                {/* INTERMEDIATE CITIES */}

                {routeCities.map(
                  (city, index) => {
                    const latitude =
                      Number(
                        city.latitude,
                      );

                    const longitude =
                      Number(
                        city.longitude,
                      );

                    if (
                      !Number.isFinite(
                        latitude,
                      ) ||
                      !Number.isFinite(
                        longitude,
                      )
                    ) {
                      return null;
                    }

                    return (
                      <Marker
                        key={
                          city.id ??
                          `${city.name}-${index}`
                        }
                        coordinate={{
                          latitude,
                          longitude,
                        }}
                        title={
                          city.name
                        }
                      />
                    );
                  },
                )}


                {/* DESTINATION */}

                <Marker
                  coordinate={{
                    latitude: Number(
                      dropLocation.latitude,
                    ),
                    longitude: Number(
                      dropLocation.longitude,
                    ),
                  }}
                  title="Destination"
                  description={
                    getAddress(
                      dropLocation,
                    )
                  }
                />

              </MapView>
            </View>
          )}


        {/* CITIES */}

      


        {/* ROUTE TIMELINE */}


        
{/* CITIES ON ROUTE */}

<View style={styles.citySectionHeader}>
  <View>
    <Text style={styles.sectionTitle}>
      Intercity Stops
    </Text>
    <Text style={styles.sectionSubtitle}>
      Select 3 cities or search to add more
    </Text>
  </View>

  <View style={styles.countBadge}>
    <Text style={styles.countText}>
      {selectedCities.length}
    </Text>
  </View>
</View>

{/* SEARCH CITY */}

<View style={styles.searchBox}>
  <Text style={styles.searchIcon}>⌕</Text>

  <TextInput
    style={styles.searchInput}
    placeholder="Search city to add..."
    placeholderTextColor="#8A8F98"
    value={citySearch}
    onChangeText={setCitySearch}
    autoCorrect={false}
  />

  {citySearch.length > 0 && (
    <TouchableOpacity
      onPress={() => setCitySearch('')}
    >
      <Text style={styles.clearSearch}>✕</Text>
    </TouchableOpacity>
  )}
</View>

{/* SEARCH RESULTS */}

{citySearch.trim().length > 0 && (
  <View style={styles.searchResults}>
    {filteredCities.length > 0 ? (
      filteredCities.map(city => {
        const selected = selectedCities.includes(
          city.name
        );

        return (
          <View
            key={city.id || city.name}
            style={styles.searchResultRow}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.intermediateName}>
                {city.name}
              </Text>

              <Text style={styles.stopText}>
                {selected ? 'Added to stops' : 'Add as a stop'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.searchAddButton,
                selected && styles.disabledButton,
              ]}
              disabled={selected}
              onPress={() => addCity(city)}
            >
              <Text style={styles.plusText}>
                {selected ? '✓' : '+'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })
    ) : (
      <Text style={styles.emptySearch}>
        No matching city found.
      </Text>
    )}
  </View>
)}

{/* SELECTED AND AVAILABLE ROUTE CITIES */}

<View style={styles.routeContainer}>
  {[
    {
      name: fromCity || 'Pickup',
      type: 'START',
    },
 ...routeCities.filter(city =>
  selectedCities.includes(city.name)
),
    {
      name: toCity || 'Destination',
      type: 'END',
    },
  ].map((item, index, list) => {
    const isEndpoint =
      item.type === 'START' || item.type === 'END';

    const selected = selectedCities.includes(item.name);

    return (
      <View
        key={`${item.name}-${index}`}
        style={styles.routeRow}
      >
        <View style={styles.timeline}>
          <View
            style={[
              styles.cityDot,
              isEndpoint && styles.endpointDot,
              selected && styles.selectedCityDot,
            ]}
          />

          {index < list.length - 1 && (
            <View style={styles.timelineLine} />
          )}
        </View>

        <View style={styles.intermediateCard}>
          <View style={styles.cityInfo}>
            <Text
              style={[
                styles.intermediateName,
                isEndpoint && styles.endpointName,
              ]}
            >
              {item.name}
            </Text>

            <Text style={styles.stopText}>
              {item.type ||
                (selected ? 'Selected stop' : 'Available city')}
            </Text>
          </View>

          {!isEndpoint && (
            <TouchableOpacity
              style={[
                styles.searchAddButton,
                !selected && styles.disabledButton,
              ]}
              disabled={!selected}
              onPress={() => removeCity(item.name)}
            >
              <Text style={styles.minusText}>−</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  })}
</View>

      




        <View
          style={{ height: 100 }}
        />

      </ScrollView>


      {/* BOTTOM BUTTON */}

      <View
        style={
          styles.bottomContainer
        }
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.continueButton,
            (loadingRoute ||
              !routeData) &&
            styles.continueButtonDisabled,
          ]}
          disabled={
            loadingRoute ||
            !routeData
          }
          onPress={handleContinue}
        >
          <Text
            style={styles.continueText}
          >
            {loadingRoute
              ? 'Calculating...'
              : 'Continue'}
          </Text>

          {!loadingRoute && (
            <Text
              style={
                styles.continueArrow
              }
            >
              →
            </Text>
          )}
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};


export default RouteSelectionScreen;


// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },


  // ------------------------------------------------
  // HEADER
  // ------------------------------------------------

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


  // ------------------------------------------------
  // CONTENT
  // ------------------------------------------------

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


  // ------------------------------------------------
  // INPUT
  // ------------------------------------------------

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
    minHeight: 58,
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
    flex: 1,
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
    fontSize: 15,
    fontWeight: '600',
    color: '#202124',
    flex: 1,
  },

  arrow: {
    fontSize: 24,
    color: '#555555',
    marginTop: -6,
  },


  // ------------------------------------------------
  // DROPDOWN
  // ------------------------------------------------

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


  // ------------------------------------------------
  // SMALL ROUTE LINE
  // ------------------------------------------------

  smallRouteLine: {
    height: 20,
    marginLeft: 30,
  },

  verticalLine: {
    height: '100%',
    width: 2,
    backgroundColor: '#D5D9DF',
  },


  // ------------------------------------------------
  // LOADING
  // ------------------------------------------------

  loadingBox: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E6E9ED',
    flexDirection: 'row',
    alignItems: 'center',
  },

  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555555',
    fontWeight: '600',
  },


  // ------------------------------------------------
  // ROUTE INFO
  // ------------------------------------------------

  routeInfoCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
    flexDirection: 'row',
    alignItems: 'center',
  },

  routeInfoItem: {
    flex: 1,
    alignItems: 'center',
  },

  routeInfoLabel: {
    fontSize: 11,
    color: '#777777',
    marginBottom: 5,
  },

  routeInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2878E8',
  },

  routeInfoDivider: {
    width: 1,
    height: 35,
    backgroundColor: '#E5E7EA',
  },


  // ------------------------------------------------
  // MAP
  // ------------------------------------------------

  mapCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8EAED',
  },

  mapHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  mapTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124',
  },

  mapSubtitle: {
    fontSize: 12,
    color: '#777777',
  },

  map: {
    width: '100%',
    height: 300,
  },


  // ------------------------------------------------
  // CITY SECTION
  // ------------------------------------------------

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


  // ------------------------------------------------
  // ROUTE TIMELINE
  // ------------------------------------------------

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
    fontSize: 16,
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
    marginLeft: 7,
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


  // ------------------------------------------------
  // SUMMARY
  // ------------------------------------------------

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


  // ------------------------------------------------
  // DEBUG
  // ------------------------------------------------

  debugCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },

  debugTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  debugText: {
    fontSize: 11,
    color: '#777777',
    marginBottom: 4,
  },


  // ------------------------------------------------
  // BOTTOM BUTTON
  // ------------------------------------------------

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

  continueButtonDisabled: {
    backgroundColor: '#AFC8ED',
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
  searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E2E5E9',
  borderRadius: 12,
  paddingHorizontal: 14,
  minHeight: 52,
  marginBottom: 12,
},

searchIcon: {
  fontSize: 24,
  color: '#2878E8',
  marginRight: 10,
},

searchInput: {
  flex: 1,
  fontSize: 14,
  color: '#202124',
  paddingVertical: 10,
},

clearSearch: {
  fontSize: 18,
  color: '#777777',
  padding: 5,
},

searchResults: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E2E5E9',
  marginBottom: 16,
  overflow: 'hidden',
},

searchResultRow: {
  minHeight: 64,
  paddingHorizontal: 14,
  paddingVertical: 10,
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#F0F1F3',
},

searchAddButton: {
  width: 36,
  height: 36,
  borderRadius: 10,
  backgroundColor: '#EAF2FF',
  borderWidth: 1,
  borderColor: '#C9DFFF',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 10,
},

emptySearch: {
  padding: 16,
  fontSize: 13,
  color: '#777777',
},

endpointDot: {
  backgroundColor: '#20A464',
  width: 15,
  height: 15,
  borderRadius: 8,
},

endpointName: {
  color: '#202124',
  fontWeight: '700',
},
});