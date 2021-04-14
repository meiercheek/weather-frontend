import React, { useState, useEffect } from 'react'
import MapView, {Marker} from 'react-native-maps'
import { SafeAreaView, TextInput, Modal, Button, ActivityIndicator,
    StyleSheet, Text, View, Dimensions, FlatList, Alert, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import {imageAssets} from './Data.js'


const CreateReport = ({route, _navigation}) => {
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(true)
    const [text, onChangeText] = React.useState("")
    const [error, setError] = useState(false)
    const [icon, setIcon] = useState(null)
    const [type, setType] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [location, setLocation] = useState(null)
    const [weatherType, setWeatherType] = useState(null)
    //let icon = null
    
    //console.log(route)
    //console.log(location)
    useEffect(() => {
      setLocation(route.params?.location)
      let weatherType = route.params?.weatherType
      console.log(route)
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
          setIcon(imageAssets[0].imageLink) 
      }

      let photo = route.params?.photo
      if (photo != undefined) {
        let photolink = `data:image/jpg;base64,${photo.base64}`
        setPhoto(photolink)
      }
      
      setIsLoading(false)
    })

    let optionsList = [
      {
        title: "weatherPicker",
        value: "placeholder"
      },
      {
        title: "description",
        value: "description"
      },
      {
        title: "cameraButton",
        value: "bude dobre"
      },
    ]
    return (
        <SafeAreaView style={styles.container}>
          {isLoading && <View >
                        <ActivityIndicator size="large" color="#00a6ff" />
                
                      </View>}
           {location && <>
            
              <Text>{JSON.stringify(location)}</Text>
            <FlatList style={{margin:10}}
                data={optionsList}
                renderItem={({ item }) => (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                   {item.title == "description" && <TextInput
                   style={styles.input}
                   onChangeText={onChangeText}
                   value={text}/>}
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
                    
                </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
           
           
           
           </>}   
          
        </SafeAreaView>
      )
      /*
       <MapView style={styles.map}
              zoomEnabled={false}
              showsPointsOfInterest={false}
              zoomTapEnabled={false}
              scrollEnabled={false}
                  region={{
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}>
                      <Marker
                          coordinate={{
                             latitude: parseFloat(location.latitude),
                            longitude: parseFloat(location.longitude) }} 
                      />
                
              </MapView>
      <Button
          title="Pick a weather situation"
          onPress={() => {
            navigation.push('WeatherPicker')
          }}
        />
        <TextInput
          placeholder="Enter a description(optional)"
          style={{ padding: 10, backgroundColor: 'white' }}
        />
        <Text>{route.params?.weatherType}</Text>
        
      </>
      
      */
    
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
  }
  
  })