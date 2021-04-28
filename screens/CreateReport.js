import React, { useState, useEffect } from 'react'
import MapView, {Marker} from 'react-native-maps'
import { SafeAreaView, TextInput, Modal, ActivityIndicator,
    StyleSheet, Text, View, Dimensions, FlatList, Alert, Image, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import {imageAssets, empty} from '../assets/Data.js'
import * as SecureStore from 'expo-secure-store'
import {fetchLocationName, getThisUser, sendReport} from '../API.js'

const CreateReport = ({route, _navigation}) => {
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [text, onChangeText] = React.useState("")
    const [icon, setIcon] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [displayLoc, setDisplayLoc] = useState(null)
    const [region, setRegion] = useState(null)
    const [weatherType, setWeatherType] = useState(null)
    const [pb64, setPb64] = useState('-')


    let location = route.params.location.coords

    const getDisplayLocation = async () => {
      try {     
        let response = await fetchLocationName(location.latitude, location.longitude)
        if(response.hasOwnProperty("display_name")){
          let divide = response.display_name.split(',')
          let city = divide[0]
          let country = divide[divide.length - 1]
        
          setDisplayLoc(`${city},${country}`)
        }
        else{
          setDisplayLoc(`No approximate location found.`)
        }
        
      } catch (e) {
        console.error(`display loc failed: ${e}`)
      }
    }

    const postReport = async () => {
        let description
        //console.log("lel")
        let token = await SecureStore.getItemAsync('userToken')
        let userIdResponse = await getThisUser(token)
        userIdResponse = userIdResponse.response.user_id
        //console.log(`${token}, ${userIdResponse}`)
        if(text == ""){
          description = "-"
        }
        else{
          description = text
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
          //console.log(sentReport)
          if(sentReport.response == "success"){
            navigation.navigate('HomeScreen')
          }
          else{
            Alert.alert("Check your report and try again")
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
      
      
    })

    let optionsList = [
      {
        title: "Approximate location name:",
        value: displayLoc
      },
      {
        title: "weatherPicker",
        value: "placeholder"
      },
      {
        title: "Description",
        value: "description"
      },
      {
        title: "cameraPressable",
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
            <FlatList style={{margin:30}}
                data={optionsList}
                renderItem={({ item }) => (
                <View style={{ flex: 1,justifyContent:'center', flexDirection: 'column' }}>
                  {item.title == "Approximate location name:" && <>
                   <Text style={styles.title}>{item.title}</Text>
                   <Text style={styles.value}>{item.value}</Text>
                  </>}
                   {item.title == "Description" && <>
                   <Text style={styles.title}>{item.title}</Text>

                   <View style={styles.inputView} >
                      <TextInput style={styles.inputText}
                                placeholder="Enter a description here"
                                onChangeText={onChangeText}
                                value={text} />
                  </View>
                  </>}
                   {item.title == "weatherPicker" && 
                   <>
                    <Image style={styles.imageThumbnail} source={icon} />
                    <Text>{weatherType}</Text>
                    <Pressable style={styles.button}
                        onPress={() => {
                          navigation.push('WeatherPicker')
                        }}>
                          <Text style={styles.textStyle}>Pick a weather situation</Text>
                    </Pressable>
                    </>}
                    {item.title == "cameraPressable" && 
                    <>
                    {photo && <Image style={styles.imageThumbnail} source={{uri: photo}} />}
                    <Pressable
                      style={styles.button}
                      onPress={() => {
                        navigation.navigate('Camera')
                      }}>
                      <Text style={styles.textStyle}>Take a photo</Text>
                    </Pressable>
                    </>
                   }
                    {item.title == "submit" && 
                   <>
                    <Pressable style={styles.button}
                        onPress={() => {
                          if(weatherType == null){
                            Alert.alert("Weather situation is a required field.")
                          }
                          else{
                            setModalVisible(true)
                            postReport()
                          }
                          
                          
                          
                        }}>
                          <Text style={styles.textStyle}>Submit report</Text>
                      </Pressable>
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
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  button: {
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    backgroundColor: "#2196F3",
    width: '70%',
    marginBottom: 20
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
    width: 85,
    margin:20
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
  inputView: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "black"
  },
  })