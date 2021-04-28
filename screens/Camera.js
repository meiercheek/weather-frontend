import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native'
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native'
import * as ImageManipulator from 'expo-image-manipulator';





const CameraView = ({ route, _navigation }) => {
  const [hasPermission, setHasPermission] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [ref, setRef] = useState(null)
  const navigation = useNavigation()
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    if (route.params != undefined) {
      if (route.params.hasOwnProperty("edit")) {
        setEdit(true)
      }
    }
  }, [])

  const snap = async () => {
    if (ref) {
        setModalVisible(true)
        let photo = await ref.takePictureAsync({
          quality: 0,
          base64: true
        })

        const {base64} = await ImageManipulator.manipulateAsync(
          photo.uri, [{resize: {width: 700}}], {base64:true}
        )
        setModalVisible(false)
        if (edit) {
          navigation.navigate('EditReport', {b64: base64})
        }
        else {
          navigation.navigate('CreateReport', {b64: base64})
        }
        
    }
    
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()

  }, [])

  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera}
      ref={ref => {
        setRef(ref)
      }}
      type={type}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.button}
            onPress={() => {
              snap()
            }}>
            <Text style={styles.text}> Take picture </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#00a6ff" />
              <Text style={styles.modalText}>Capturing</Text>
            </View>
          </View>
        </Modal>
      </View>
      
    </View>
  )
}

export default CameraView

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: -1
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
})
