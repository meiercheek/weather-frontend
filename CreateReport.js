import React, { useState, useEffect } from 'react'
import MapView, {Marker} from 'react-native-maps'
import { SafeAreaView, TextInput, Modal, Button, ActivityIndicator,
    StyleSheet, Text, View, Dimensions, FlatList, Alert, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import {imageAssets} from './Data.js'


const CreateReport = ({route, _navigation}) => {
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(false)
    const [text, onChangeText] = React.useState("Useless Text")
    const [error, setError] = useState(false)
    const [icon, setIcon] = useState(imageAssets[0].imageLink)
    const [type, setType] = useState(null)
    const [photo, setPhoto] = useState(null)

    let location = route.params?.location

    useEffect(() => {
      let weatherType = route.params?.weatherType
      switch (weatherType) {
        case("Sunny"):
          setIcon(imageAssets[0].imageLink)
          break
        case("Rain"):
          setIcon(imageAssets[1].imageLink)
        break
        case("Cloudy"):
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
      
      
    })

    let optionsList = [
      {
        title: "weatherPicker",
        value: imageAssets[0].imageLink
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
              {photo && <Text>{JSON.stringify(photo.uri)} </Text>}
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
                </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
          
        </SafeAreaView>
      )
      /*
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