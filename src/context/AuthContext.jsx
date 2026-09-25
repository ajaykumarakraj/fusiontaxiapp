import React, {createContext, useContext, useEffect, useState} from 'react';
import * as Keychain from 'react-native-keychain';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();

      if (credentials) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log('Check Auth Error:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async token => {
    try {
      await Keychain.setGenericPassword('authToken', token);
      setIsLoggedIn(true);
    
    } catch (error) {
      console.log('Login Error:', error);
    }
  };

  const logout = async () => {
    try {
      await Keychain.resetGenericPassword();
      setIsLoggedIn(false);
  
    } catch (error) {
      console.log('Logout Error:', error);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);