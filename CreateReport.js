import React, { useState, useEffect } from 'react'
import MapView, {Marker} from 'react-native-maps'
import { TextInput, Modal, Button, ActivityIndicator,
    StyleSheet, Text, View, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'

const CreateReport = ({route, _navigation}) => {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.container}>
          {isLoading && <View >
                          <ActivityIndicator size="large" color="#00a6ff" />
                  
                        </View>}
          {error && <Text>server error occured, try again later</Text>}  
          {report &&  
          <>
              <MapView style={styles.map}
              zoomEnabled={false}
              showsPointsOfInterest={false}
              zoomTapEnabled={false}
              scrollEnabled={false}
                  region={{
                    latitude: parseFloat(marker.latitude),
                    longitude: parseFloat(marker.longitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}>
                      <Marker
                          coordinate={{
                             latitude: parseFloat(marker.latitude),
                            longitude: parseFloat(marker.longitude) }} 
                      />
                
              </MapView>
            <FlatList style={{margin:10}}
                data={report}
                renderItem={({ item }) => (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.value}>{item.value}</Text>
                </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
          
          </>}
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