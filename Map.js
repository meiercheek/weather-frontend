import React, { useState, useEffect } from 'react'
import MapView, {Marker, getMapBoundaries} from 'react-native-maps'
import { Alert, Modal, Pressable, Button,ActivityIndicator,
    StyleSheet, Text, View, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'

function Map() {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)
  const [region, setRegion] = useState({
    latitude: 48.733333,
    longitude: 18.933333,
    latitudeDelta: 40,
    longitudeDelta: 40
  });

  const [markers, setMarkers] = useState([])
  //const [bounds, setBounds] = useState(null)
  //const [response, setResponse] = useState(null)
  const [mref, setRef] = useState(null)

  useEffect(() => {
    (async () => {
      let status = await Location.requestPermissionsAsync();
      console.log(status)
      if (status !== 'granted') {
        //setModalVisible(false)
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 20,
        longitudeDelta: 20
      })
      
      setModalVisible(true)

    })()
  }, [])

  let fetchReports = async(swlat, swlong, nelat, nelong) => {
    let url = "http://e330590adce4.ngrok.io"
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNWJmMDA1LTFkOTQtNGJkNy1hNjgxLTdkN2U2YjllYzdjNSIsImlhdCI6MTYxNzc4NDQyMCwiZXhwIjoxNjE3ODcwODIwfQ.x_HyooHzwhC3s2a1c4OD6NrNjxlMVsvsZD6azw4wVuc"
 

    return fetch(`${url}/georeports?SWlat=${swlat}&SWlong=${swlong}&NElat=${nelat}&NElong=${nelong}`, {  
                    method: 'GET',
                    headers: {
                        'x-access-token': token,
                    },
    }).then((response) => response.json())
    .then((responseData) => {
      //console.log(responseData)
      return responseData
    })
    .catch(error => console.error(error))
    }

  let handleResponse = (response) => {
    if (response.error == undefined){
      //console.log(response.response.reports)
      let colors = ["tomato","orange","yellow","gold",
        "wheat","tan","linen","green", "blue", "navy",
        "aqua",  "turquoise", "violet",
        "purple",  "plum", "indigo"]
      arr = response.response.reports
      let markers = []
      for (let i = 0; i < arr.length; i++){
        //console.log(i)
        markers.push({
          report_id: arr[i].report_id,
          latlng:{
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
      
    }
    else{
      console.log(response.error)
    }
      
  }


  let onRegionChangeComplete = async () => {
    let promis = await mref.getMapBoundaries()
    if (promis.northEast.latitude < 1){
        return
    }
    else {
        fetchReports(
        promis.southWest.latitude, 
        promis.southWest.longitude,
        promis.northEast.latitude,
        promis.northEast.longitude).then( r => handleResponse(r))
        //console.log(reports)
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
            onMapReady={()=>{
              
            }}
            onRegionChangeComplete={region => {
                setRegion(region)
                onRegionChangeComplete()
                setModalVisible(false)
            }}
            >

          {markers.map((marker) => (
            <Marker
            //image={require('./assets/icons/sun.png')}
            key={marker.report_id}
            identifier={marker.report_id}
            //onPress={() => console.log(navigation)}
            onPress={() => navigation.navigate("Details", {marker})}
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
  buttonContainer:{
    position: 'absolute',
    elevation: 5,
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: Dimensions.get('window').width-85,
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
  }
  
})
