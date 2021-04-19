import React, { useState, useEffect } from 'react'
import MapView, {Marker} from 'react-native-maps'
import { SafeAreaView, TextInput, Modal, Button, ActivityIndicator,
    StyleSheet, Text, View, Dimensions, FlatList, Alert, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import {imageAssets, empty} from './Data.js'
import * as SecureStore from 'expo-secure-store'
import {fetchLocationName, getThisUser, sendReport} from './API.js'



const CreateReport = ({route, _navigation}) => {
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [text, onChangeText] = React.useState("")
    const [error, setError] = useState(false)
    const [icon, setIcon] = useState(null)
    const [type, setType] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [displayLoc, setDisplayLoc] = useState(null)
    const [currentUserId, setUserId] = useState('')
    const [region, setRegion] = useState(null)
    const [weatherType, setWeatherType] = useState(null)
    const [pb64, setPb64] = useState('-')
    const [outcome, setOutcome] = useState(null)

    let location = route.params.location.coords

    const getDisplayLocation = async () => {
      try {
        let response = await fetchLocationName(location.latitude, location.longitude)
        setDisplayLoc(`${response.address.city}, ${response.address.country}`)
      } catch (e) {
        console.error(`display loc failed: ${e}`)
      }
    }

    const postReport = async () => {
        let description
        console.log("lel")
        let token = await SecureStore.getItemAsync('userToken')
        let userIdResponse = await getThisUser(token)
        userIdResponse = userIdResponse.response.user_id
        console.log(`${token}, ${userIdResponse}`)
        if(text == ""){
          description = "-"
        }
        sendReport(token, {
          user_id: userIdResponse,
          description: description,
          characteristic: weatherType,
          location: displayLoc,
          latitude: region.latitude,
          longitude: region.longitude,
          photo: pb64
        }).then((sentReport )=>{
          setModalVisible(false)
          if(sentReport.response == "success"){
            navigation.navigate('HomeScreen')
          }
          
        }).catch((e) =>{
          console.error(`display loc failed: ${e}`)
        })
        
        
        
      
        
      
      
    }

    useEffect(() => {
      setRegion(location)
      getDisplayLocation()
      setIsLoading(false)
      let weatherType = route.params?.weatherType
      //console.log(route)
      switch (weatherType) {
        case("Sunny"):
          setWeatherType("Sunny")
          setIcon(imageAssets[0].imageLink)
          break
        case("Rain"):
          setWeatherType("Rain")
          setIcon(imageAssets[1].imageLink)
        break
        case("Cloudy"):
          setWeatherType("Cloudy")
          setIcon(imageAssets[2].imageLink)
        break
        default:
          setIcon(empty.imageLink) 
      }
      //console.log(route.params?.photo)
      let p = route.params?.photo
      let pp = route.params?.b64
      if (p != undefined) {
        setPhoto(`${p}`)
        setPb64(`${pp}`)
      }

      if(outcome == true){
        
      }
      
      
    })

    let optionsList = [
      {
        title: "weatherPicker",
        value: "placeholder"
      },
      {
        title: "Description",
        value: "description"
      },
      {
        title: "cameraButton",
        value: "bude dobre"
      },
      {
        title: "submit",
        value: "bude dobre"
      }
    ]
    return (
        <SafeAreaView style={styles.container}>
          {isLoading && <View >
                        <ActivityIndicator size="large" color="#00a6ff" />
                
                      </View>}
           {region && <>
            
            <Text>Approximate location name:</Text>
            <Text>{displayLoc}</Text>
            <FlatList style={{margin:10}}
                data={optionsList}
                renderItem={({ item }) => (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                   {item.title == "Description" && <>
                   <Text style={styles.title}>{item.title}</Text>
                   <TextInput
                   style={styles.input}
                   onChangeText={onChangeText}
                   value={text}/></>}
                   {item.title == "weatherPicker" && 
                   <>
                    <Image style={styles.imageThumbnail} source={icon} />
                    <Button
                        title="Pick a weather situation"
                        onPress={() => {
                          navigation.push('WeatherPicker')
                        }}
                      />
                    </>}
                    {item.title == "cameraButton" && 
                    <>
                    {photo && <Image style={styles.imageThumbnail} source={{uri: photo}} />}
                    <Button
                      title="Take a photo"
                      onPress={() => {
                        navigation.navigate('Camera')
                      }}
                    />
                    </>
                   }
                    {item.title == "submit" && 
                   <>
                    <Button
                        title="Submit report"
                        onPress={() => {
                          setModalVisible(true)
                          postReport()
                          
                        }}
                      />
                    </>}
                    
                </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
           
           
           
           </>}   
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <ActivityIndicator size="large" color="#00a6ff" />
                  <Text style={styles.modalText}>Sending report</Text>
                </View>
              </View>
            </Modal>
          </View>  
        </SafeAreaView>
      )
  
}

export default CreateReport

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  map:{
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title:{
    fontSize:16,
    fontWeight:'bold'
  },
  value:{
    fontSize:14,
  },
  imageThumbnail: {
    height: 85,
    width: 85
  },
  button:{
    alignItems: 'center',
    justifyContent: 'center'

  },
  title:{
    fontSize:16,
    fontWeight:'bold'
  },
  value:{
    fontSize:14,
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