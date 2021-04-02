import React, { useState, useEffect } from 'react';
import MapView, {Marker, getMapBoundaries} from 'react-native-maps';
import { Alert, Modal, Pressable, 
    StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false)
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });
  const [initLocation, setInitLoc] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });

  const [markers, setMarkers] = useState([])
  const [bounds, setBounds] = useState(null)
  const [response, setResponse] = useState(null)
  const [mref, setRef] = useState(null)

  useEffect(() => {
    (async () => {
      let status = await Location.requestPermissionsAsync();
      console.log(status)
      if (status !== 'granted') {
        setModalVisible(false)
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      })
      
      

    })()
  }, [])

  let fetchReports = async(swlat, swlong, nelat, nelong) => {
    let url = `https://8ed49643a8a7.ngrok.io`
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNWJmMDA1LTFkOTQtNGJkNy1hNjgxLTdkN2U2YjllYzdjNSIsImlhdCI6MTYxNzQwMzIwOCwiZXhwIjoxNjE3NDg5NjA4fQ.WqfX6xAy3EhEwnosJ0BmjrStvGk1X69pbXNIcpYNaXk"
   // let url = `192.168.0.104:3000`
    // 192.168.0.104:3000/georeports?SWlat=${swlat}&SWlong=${swlong}&NElat=${nelat}&NElong=${nelong}
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
    .catch(error => console.warn(error))
  }

  let handleResponse = (response) => {
    if (response.error == undefined){
      //console.log(response.response.reports)
      let colors = ["tomato","orange","yellow","gold",
        "wheat","tan","linen","green", "blue", "navy",
        "aqua / teal",  "turquoise", "violet",
        "purple",  "plum", "indigo"]
      arr = response.response.reports
      let markers = []
      for (let i = 0; i < arr.length; i++){
        console.log(i)
        markers.push({
          latlng:{
            latitude: parseFloat(arr[i].latitude),
            longitude: parseFloat(arr[i].longitude)
          },
          clr: colors[Math.floor(Math.random() * colors.length)]
        })
      }
      console.log(markers)
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
     <View style={styles.centeredView}>
      <MapView style={styles.map}
            region={region}
            ref={(ref) => {
                setRef(ref)
             }}
            onMapReady={()=>{
                setInitLoc(region)
                //console.log(mref.getMapBoundaries())
            }}
            onRegionChangeComplete={region => {
                setRegion(region)
                onRegionChangeComplete()
            }
            }
            >
          {markers.map((marker, index) => (
            <Marker
            key={index}
            coordinate={marker.latlng}
            pinColor={marker.clr}
            />
        ))}      

     </MapView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>GPS permission not given</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                  setModalVisible(!modalVisible)
            } 
            }
            >
              <Text style={styles.textStyle}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    zIndex: 0,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
