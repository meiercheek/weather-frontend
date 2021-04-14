import React, { useState, useEffect } from 'react'
import MapView, { Marker, getMapBoundaries } from 'react-native-maps'
import {
  Alert, Modal, Pressable, Button, ActivityIndicator,
  StyleSheet, Text, View, Dimensions
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import { fetchReports } from './API.js'
import * as SecureStore from 'expo-secure-store'
import { TouchableOpacity } from 'react-native-gesture-handler'

function Map() {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(true)
  const [locError, setLocError] = useState(false)
  const [token, setToken] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [region, setRegion] = useState({
    latitude: 48.733333,
    longitude: 18.933333,
    latitudeDelta: 40,
    longitudeDelta: 40
  });

  const [markers, setMarkers] = useState([])
  const [mref, setRef] = useState(null)

  const getPermission = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        setLocError(true)
      }
    }
    catch(e) {
      setLocError(true)
    }
  }


  const getPosition = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({})
      setCurrentLocation(location)
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 20,
        longitudeDelta: 20
      })
    }
    catch(e) {
      setLocError(true)
    }
    
    
  }

  useEffect(() => {

    const getToken = async () => {
      let userToken = ''
      try {
        userToken = await SecureStore.getItemAsync('userToken')
        setToken(userToken) 
      } catch (e) {
        console.error(`Token restoration failed on Map: ${e}`)
      }
    }

    

    getToken()
    getPermission()
    getPosition()
  }, [])

  let handleResponse = (response) => {
    if (response && response.error == undefined) {
      //console.log(response.response.reports)
      let colors = ["tomato", "orange", "yellow", "gold",
        "wheat", "tan", "linen", "green", "blue", "navy",
        "aqua", "turquoise", "violet",
        "purple", "plum", "indigo"]
      arr = response.response.reports
      let markers = []
      for (let i = 0; i < arr.length; i++) {
        //console.log(i)
        markers.push({
          report_id: arr[i].report_id,
          latlng: {
            latitude: parseFloat(arr[i].latitude),
            longitude: parseFloat(arr[i].longitude)
          },
          title: arr[i].characteristic,
          description: arr[i].description,
          clr: colors[Math.floor(Math.random() * colors.length)]
        })
      }
      //console.log(markers)
      setMarkers(markers)
      setModalVisible(false)
    }
    else {
      console.log(response.error)
    }

  }

  let onRegionChangeComplete = async () => {
    let promis = await mref.getMapBoundaries()
    if (promis.northEast.latitude < 1) {
      return
    }
    else {
      if (token != null) {
        fetchReports(token, promis.southWest.latitude,
          promis.southWest.longitude, promis.northEast.latitude,
          promis.northEast.longitude)
          .then(r => {
            handleResponse(r)
          })
          .catch(e => console.log(e))
      }
    }
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        tracksViewChanges={false}
        rotateEnabled={false}
        showsPointsOfInterest={false}
        showsUserLocation={true}
        userLocationPriority={'passive'}
        region={region}
        ref={(ref) => {
          setRef(ref)
        }}
        onMapReady={() => {
        }}
        onRegionChangeComplete={region => {
          setRegion(region)
          onRegionChangeComplete()
        }}
      >

        {markers.map((marker) => (
          <Marker
            key={marker.report_id}
            identifier={marker.report_id}
            onPress={() => navigation.navigate("Details", { marker })}
            coordinate={marker.latlng}
            pinColor={marker.clr}
          />
        ))}
      </MapView>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#00a6ff" />
              <Text style={styles.modalText}>Loading</Text>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} title="Submit a report"
            onPress={() => {
              if(currentLocation != null || currentLocation != undefined) {
                navigation.navigate('CreateReport', {
                  location: currentLocation
                })
              }
              
              else {
                Alert.alert("No user location")
              }}
            }
        />

     </View>
    </View>
  );
}
export default Map
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1
  },
  refreshButton:{
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#008bff",
  },
  buttonContainer:{
    position: 'absolute',
    elevation: 5,
    justifyContent: 'center',
    width: Dimensions.get('window').width
  },
  button:{
    backgroundColor: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: Dimensions.get('window').width - 85,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

})
