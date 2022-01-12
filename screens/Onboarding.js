import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Button,
  ImageBackground,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding({navigation}) {
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const setLocation = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@location', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#ffffff',
        flex: 1,
      }}>
      <StatusBar backgroundColor="#0086B0" />
      <ImageBackground
        source={require('../assets/onboarding.png')}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 110,
        }}>
        <Image
          source={require('../assets/logoOnboarding.png')}
          style={{
            resizeMode: 'contain',
            width: '60%',
          }}
        />
        <Text
          style={{
            color: '#002332',
            backgroundColor: '#ffffff',
            paddingHorizontal: 25,
            paddingVertical: 12,
            borderRadius: 50,
            fontWeight: 'bold',
          }}>
          ENABLE GEOLOCATION
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#005671',
            paddingHorizontal: 25,
            paddingVertical: 12,
            borderRadius: 50,
          }}
          onPress={
            isLocationAllowed
              ? () => {
                  navigation.navigate('Home');
                }
              : () => {
                  GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 2000,
                    maximumAge: 3600000,
                  })
                    .then(location => {
                      setLocation(location);
                      setIsLocationAllowed(true);
                    })
                    .catch(error => {
                      const {code, message} = error;
                      console.warn(code, message);
                    });
                }
          }>
          <Text style={{color: '#ffffff'}}>
            {isLocationAllowed ? 'Next' : 'Allow Location'}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}
