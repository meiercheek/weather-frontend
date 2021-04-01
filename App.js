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

  const [markers, setMarkers] = useState([])
  const [bounds, setBounds] = useState(null)
  const [ref, setRef] = useState(null)

  useEffect(() => {
    (async () => {
      let status = await Location.requestPermissionsAsync();
      console.log(status)
      if (status !== 'granted') {
        setModalVisible(true)
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      })
      console.log(bounds)
      

    })()
  }, [])
  let mapref = null
  return (
     <View style={styles.centeredView}>
      <MapView style={styles.map}
            loadingEnabled = {true}
            region={region}
            ref={(ref) => {
                mapref = ref
             }}
            onRegionChangeComplete={region => {
                setRegion(region)
                setBounds(mapref.getMapBoundaries())
            }
            }>
          {markers.map((marker, index) => (
            <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
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
});
