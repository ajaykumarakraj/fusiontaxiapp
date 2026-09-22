import React, {useEffect,useState} from 'react';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';


// import {
//   LoginManager,
//   AccessToken,
// } from 'react-native-fbsdk-next';
const Login = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '880408546804-5urqm8qafrlgpavo246r61k8m23e03f2.apps.googleusercontent.com',
    });
  }, []);

  // Google Login
  const handleGoogleLogin = async () => {
  try {
    // Check Google Play Services 
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });



    // token 
     const tokens = await GoogleSignin.getTokens();
        //  console.log("Access Token:", tokens.accessToken);
    // Google Sign In
   

    if (!tokens) {
      Alert.alert('Login Failed', 'Unable to get Google user information.');
      return;
    }

    console.log('Google accesstoken:', tokens.accessToken);
    const payload={
      access_token: tokens.accessToken,
      provider: 'google',
    };
  const response = await axios.post(
      `https://api.squarebigha.com/oldApi/api/v1/auth/social-login`,payload
    );
    console.log('Google login response:', response.data);
const token = response.data.data.token;
   if (!token) {
      Alert.alert('Login Failed', 'Backend token not received.');
      return;
    }
await Keychain.setGenericPassword(
  'authToken',
  token
);
    // Login successful
    navigation.navigate('Main');
  } catch (error) {
    console.log('Google Login Error:', error);

    if (error?.code === 'SIGN_IN_CANCELLED') {
      console.log('User cancelled Google login');
      return;
    }

    Alert.alert(
      'Google Login Failed',
      error?.message || 'Unable to login with Google',
    );
  }
};

  // Check Facebook session when Login screen opens
  useEffect(() => {
  // handleFacebookLogin();
}, []);
const FACEBOOK_CLIENT_TOKEN = '3d49521e7022b95a86a64ccd21868f3c';
const FACEBOOK_APP_ID = '1618522646309559';
 const handleFacebookLogin = async () => {
  if (loading) {
    return;
  }

  if (!FACEBOOK_APP_ID || !FACEBOOK_CLIENT_TOKEN) {
    Alert.alert(
      'Facebook Login Unavailable',
      'Facebook Client Token is not configured.',
    );
    return;
  }

  setLoading(true);

   try {
    console.log('Starting Facebook login...');
    
    const permissions = ['public_profile'];

    console.log('Facebook permissions:', permissions);

    const result = await LoginManager.logInWithPermissions(permissions);

    
    console.log('Facebook login result:', result);

    if (result.isCancelled) {
      console.log('Facebook login cancelled');
      return;
    }

    const data = await AccessToken.getCurrentAccessToken();

    console.log('Facebook access token:', data);

    if (!data) {
      throw new Error('Facebook access token not received');

    }
   // Login successful → Main screen
    navigation.navigate('Main');
    console.log('Facebook login successful');
  } catch (error) {
    console.error('FACEBOOK LOGIN ERROR:', error);
  }
   finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>FK</Text>
          </View>

          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Sign in to continue to your account
          </Text>
        </View>

        {/* Social Login */}
        <View style={styles.loginSection}>

          {/* Google */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.85}
          >
            <View style={styles.iconBox}>
              <Icon
                name="google"
                brand
                size={19}
                color="#DB4437"
              />
            </View>

            <Text style={styles.buttonText}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity
            style={[styles.socialButton, styles.facebookButton, loading && styles.disabledButton]}
            onPress={handleFacebookLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            <View style={styles.iconBox}>
              <Icon
                name="facebook-f"
                brand
                size={20}
                color="#1877F2"
              />
            </View>

            <Text style={styles.buttonText}>
              Continue with Facebook
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Phone Login */}
          <TouchableOpacity
            style={styles.phoneButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PhoneLogin')}
          >
            <Icon
              name="mobile-alt"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.phoneButtonText}>
              Continue with Phone
            </Text>
          </TouchableOpacity>

        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms</Text>
          {' '}and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>

      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 42,
  },

  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },

  loginSection: {
    width: '100%',
  },

  socialButton: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },

  facebookButton: {
    marginBottom: 4,
  },

  disabledButton: {
    opacity: 0.6,
  },

  iconBox: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  orText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginHorizontal: 14,
  },

  phoneButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#111827',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  phoneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },

  footerText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 15,
  },

  link: {
    color: '#374151',
    fontWeight: '600',
  },
});