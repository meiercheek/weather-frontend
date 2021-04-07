import React, { useState, useEffect } from 'react'
import MapView, {Marker} from 'react-native-maps'
import { Button, 
    StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'



const WeatherPicker = () => {
    const navigation = useNavigation()
    const [weatherType, setWeatherType] = useState('');

    let array = [
        {
            imageLink: require("./assets/icons/sun.png"),
            title: "Sunny"

        },
        {
            imageLink: require("./assets/icons/rain.png"),
            title: "Rain"

        },
        {
            imageLink: require("./assets/icons/cloud.png"),
            title: "Cloudy"

        }
    ]

    return (
    <SafeAreaView style={styles.container}>
        <FlatList
            data={array}
            renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                <TouchableOpacity style={styles.button} onPress={()=>
                    navigation.navigate('CreateReport', {weatherType: item.title})}>
                    <Image style={styles.imageThumbnail} source={item.imageLink} />
                    <Text>{item.title}</Text>
                </TouchableOpacity>
            </View>
            )}
 
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
        />
    </SafeAreaView>
    )
  }

export default WeatherPicker

const styles = StyleSheet.create({
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
  });