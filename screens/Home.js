import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {getPreciseDistance} from 'geolib';
import GetLocation from 'react-native-get-location';
import Svg, {Path} from 'react-native-svg';
import PushNotification, {Importance} from 'react-native-push-notification';

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 51.5103,
    longitude: 7.49347,
  });
  const [liveLocation, setLiveLocation] = useState({
    latitude: 51.5103,
    longitude: 7.49347,
  });
  const [text, setText] = useState(0);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(false);
  const [isInMile, setIsInMile] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [calcDistance, setCalcDistance] = useState(false);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState([]);

  useEffect(() => {
    setSelectedLanguage(isInMile ? 'Mile' : 'Km');
  }, [isInMile]);

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 3600000,
    })
      .then(location => {
        setCurrentLocation(location);
        console.log('location');
        console.log(location);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 3600000,
      })
        .then(location => {
          console.log('currentLocation');
          console.log(location);
          setLiveLocation(location);
          let distance = getPreciseDistance(
            {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            },
            {
              latitude: liveLocation.latitude,
              longitude: liveLocation.longitude,
            },
            0.01,
          );
          console.log(distance);
          setDistance(distance);
        })
        .catch(error => {
          const {code, message} = error;
          console.warn(code, message);
        });
    }, 3000);
  }, [liveLocation]);

  useEffect(() => {
    if (selectedLanguage === 'Mile') {
      setDistanceCovered(
        isAscending
          ? text * 1000 * 0.621371 + distance
          : text * 1000 * 0.621371 - distance,
      );
    } else {
      setDistanceCovered(
        isAscending ? text * 1000 + distance : text * 1000 - distance,
      );
    }
  }, [liveLocation]);
  function sendNotification() {
    PushNotification.localNotification({
      channelId: 'channel-id',
      //... You can use all the options from localNotifications
      message: 'My Notification Message', // (required)
      date: new Date(Date.now() + 60 * 1000), // in 60 secs
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      /* Android Only Properties */
      repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
    });
  }
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'channel-id', // (required)
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    if (time !== 0 && time === text) {
      sendNotification();
    }
  }, [text, time]);
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
          }}>
          <Image
            source={require('../assets/logo.png')}
            style={{
              resizeMode: 'contain',
              width: '60%',
              marginLeft: '20%',
            }}
          />
          <View style={{paddingHorizontal: 20, width: '100%'}}>
            {time === 0 ? null : (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: '#242424',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Alarm Time
                </Text>
                <Text
                  style={{
                    color: '#242424',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  {time}
                </Text>
              </View>
            )}
            {calcDistance ? (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  backgroundColor: '#F1F1F1',
                  paddingHorizontal: 20,
                  marginVertical: 10,
                  height: 45,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#242424',
                    textAlign: 'right',
                    flex: 1,
                    marginRight: 5,
                  }}>
                  {isInMile
                    ? (distanceCovered * 0.000621371192).toFixed(1)
                    : (distanceCovered / 1000).toFixed(1)}
                </Text>
                <Text style={{color: '#0086b0'}}>
                  {isInMile ? 'Miles' : 'Km'}
                </Text>
              </View>
            ) : (
              <TextInput
                placeholder="Start / Current Marker"
                placeholderTextColor="#929292"
                keyboardType="number-pad"
                onChangeText={e => {
                  setText(e);
                }}
                style={{
                  color: '#242424',
                  backgroundColor: '#F1F1F1',
                  width: '100%',
                  marginVertical: 10,
                  borderRadius: 5,
                  paddingHorizontal: 20,
                }}
              />
            )}
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setIsAscending(true);
                }}
                style={{
                  backgroundColor: isAscending ? '#0086b0' : '#E6F9FF',
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  marginRight: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: isAscending ? '#E6F9FF' : '#0086b0'}}>
                  Ascending
                </Text>
                {isAscending ? (
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      width: 20,
                      height: 20,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14.017}
                      height={10.199}
                      viewBox="0 0 15.017 11.199">
                      <Path
                        data-name="Icon awesome-check"
                        d="M5.1 15.556L.22 10.675a.751.751 0 010-1.062l1.062-1.062a.751.751 0 011.062 0l3.288 3.288L12.674 4.8a.751.751 0 011.062 0L14.8 5.859a.751.751 0 010 1.062l-8.638 8.635a.751.751 0 01-1.062 0z"
                        transform="translate(0 -4.577)"
                        fill="#0086b0"
                      />
                    </Svg>
                  </View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsAscending(false);
                }}
                style={{
                  backgroundColor: isAscending ? '#E6F9FF' : '#0086b0',
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: isAscending ? '#0086b0' : '#ffffff'}}>
                  Descending
                </Text>
                {isAscending ? null : (
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      width: 20,
                      height: 20,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14.017}
                      height={10.199}
                      viewBox="0 0 15.017 11.199">
                      <Path
                        data-name="Icon awesome-check"
                        d="M5.1 15.556L.22 10.675a.751.751 0 010-1.062l1.062-1.062a.751.751 0 011.062 0l3.288 3.288L12.674 4.8a.751.751 0 011.062 0L14.8 5.859a.751.751 0 010 1.062l-8.638 8.635a.751.751 0 01-1.062 0z"
                        transform="translate(0 -4.577)"
                        fill="#0086b0"
                      />
                    </Svg>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <TouchableOpacity
                onPress={() => {
                  setIsInMile(true);
                }}
                style={{
                  backgroundColor: isInMile ? '#0086b0' : '#E6F9FF',
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  marginRight: 10,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: isInMile ? '#E6F9FF' : '#0086b0'}}>
                  Miles
                </Text>
                {isInMile ? (
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      width: 20,
                      height: 20,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14.017}
                      height={10.199}
                      viewBox="0 0 15.017 11.199">
                      <Path
                        data-name="Icon awesome-check"
                        d="M5.1 15.556L.22 10.675a.751.751 0 010-1.062l1.062-1.062a.751.751 0 011.062 0l3.288 3.288L12.674 4.8a.751.751 0 011.062 0L14.8 5.859a.751.751 0 010 1.062l-8.638 8.635a.751.751 0 01-1.062 0z"
                        transform="translate(0 -4.577)"
                        fill="#0086b0"
                      />
                    </Svg>
                  </View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsInMile(false);
                }}
                style={{
                  backgroundColor: isInMile ? '#E6F9FF' : '#0086b0',
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: isInMile ? '#0086b0' : '#ffffff'}}>
                  Km
                </Text>
                {isInMile ? null : (
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      width: 20,
                      height: 20,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14.017}
                      height={10.199}
                      viewBox="0 0 15.017 11.199">
                      <Path
                        data-name="Icon awesome-check"
                        d="M5.1 15.556L.22 10.675a.751.751 0 010-1.062l1.062-1.062a.751.751 0 011.062 0l3.288 3.288L12.674 4.8a.751.751 0 011.062 0L14.8 5.859a.751.751 0 010 1.062l-8.638 8.635a.751.751 0 01-1.062 0z"
                        transform="translate(0 -4.577)"
                        fill="#0086b0"
                      />
                    </Svg>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={
                calcDistance
                  ? () => {
                      setCalcDistance(false);
                    }
                  : () => {
                      GetLocation.getCurrentPosition({
                        enableHighAccuracy: true,
                        timeout: 2000,
                        maximumAge: 3600000,
                      })
                        .then(location => {
                          setCurrentLocation(location);
                          setCalcDistance(true);
                        })
                        .catch(error => {
                          const {code, message} = error;
                          console.warn(code, message);
                        });
                    }
              }
              style={{
                backgroundColor: '#EE5713',
                flex: 1,
                minHeight: 45,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                marginBottom: 10,
              }}>
              <Text style={{color: 'white'}}>
                {calcDistance ? 'Stop' : 'Start'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText(0);
                setTime(0);
              }}
              style={{
                backgroundColor: '#C5C5C5',
                flex: 1,
                minHeight: 45,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
              }}>
              <Text style={{color: '#242424'}}>Reset</Text>
            </TouchableOpacity>
            <TextInput
              style={{
                color: '#242424',
                backgroundColor: '#f1f1f1',
                minHeight: 45,
                maxWidth: '50%',
                marginLeft: '25%',
                borderRadius: 5,
                marginTop: 100,
                paddingHorizontal: 20,
              }}
              placeholder="Alarm"
              placeholderTextColor="#929292"
              keyboardType="number-pad"
              onChangeText={e => {
                setTime(e);
              }}
            />
          </View>

          {/* <TextInput
          placeholder="hello"
          placeholderTextColor="#242424"
          value={text}
          onChangeText={e => {
            setText(e);
          }}
          style={{
            backgroundColor: 'gray',
            width: '100%',
            marginBottom: 10,
            color: '#ffffff',
          }}
        />
        <Text style={{color: '#242424'}}>
          {isInMile
            ? distanceCovered * 0.000621371
            : (distanceCovered * 0.000621371) / 1.6}
        </Text> */}

          {/* <Text style={{color: '#242424'}}>
          {currentLocation.latitude}
          {currentLocation.longitude}
        </Text>

        <Button
          title={calcDistance ? 'stop' : 'start'}
          onPress={
            calcDistance
              ? () => {
                  setPollCurrentLocation(false);
                }
              : () => {
                  GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 2000,
                    maximumAge: 3600000,
                  })
                    .then(location => {
                      setLocation(location);
                      setPollCurrentLocation(true);
                    })
                    .catch(error => {
                      const {code, message} = error;
                      console.warn(code, message);
                    });
                }
          }
        />
        <Button
          title="Reset"
          onPress={() => {
            setText('');
          }}
        />
        <BouncyCheckbox
          size={25}
          fillColor="red"
          unfillColor="#FFFFFF"
          text="Custom Checkbox"
          iconStyle={{borderColor: 'red'}}
          textStyle={{fontFamily: 'JosefinSans-Regular'}}
          onPress={value => {
            if (value === true) {
              console.log('alarm on');
            } else {
              console.log('alarm off');
            }
          }}
        />
        <RadioForm
          radio_props={radio_props}
          initial={0}
          onPress={value => {
            if (value === 0) {
              console.log('ascending');
            } else {
              console.log('descending');
            }
          }}
        />
        <RadioForm
          radio_props={radio_props}
          initial={0}
          onPress={value => {
            if (value === 0) {
              console.log('km');
            } else {
              console.log('miles');
            }
          }}
        /> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
