import React, { useState, useEffect } from 'react'
import MapView, {Marker} from 'react-native-maps'
import { Button, 
    StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {imageAssets} from './Data.js'


const WeatherPicker = () => {
    const navigation = useNavigation()
    const [weatherType, setWeatherType] = useState('');

    return (
    <SafeAreaView style={styles.container}>
        <FlatList
            data={imageAssets}
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