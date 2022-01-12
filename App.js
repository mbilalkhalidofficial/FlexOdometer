import React, {useEffect, useState} from 'react';
import Onboarding from './screens/Onboarding';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('@storage_Key');
  //       if (value !== null) {
  //         console.log(value);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   getData();
  //   const getLocation = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('@location');
  //       if (value !== null) {
  //         console.log(value);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   getLocation();
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{header: () => null}}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
