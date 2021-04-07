
import * as React from 'react'
import { Button, View, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Map from './Map.js'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import MapView, { Marker } from 'react-native-maps'


const Details = ({route, navigation}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [report, setReport] = useState(null)
    const [error, setError] = useState(false)
    report_id = route.params?.marker.report_id
    useEffect(() => { 
      (async () => {
          let url = "http://e330590adce4.ngrok.io"
          let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNWJmMDA1LTFkOTQtNGJkNy1hNjgxLTdkN2U2YjllYzdjNSIsImlhdCI6MTYxNzc4NDQyMCwiZXhwIjoxNjE3ODcwODIwfQ.x_HyooHzwhC3s2a1c4OD6NrNjxlMVsvsZD6azw4wVuc"
       
         fetch(`${url}/report/${report_id}`, {  
                          method: 'GET',
                          headers: {
                              'x-access-token': token,
                          },
          }).then((response) => response.json())
          .then((responseData) => {
            if(responseData.response.report !== undefined) {
              setIsLoading(false)
              setReport(responseData.response.report)
            }
            else if(responseData.response.error) {
              setError(true)
              setIsLoading(false)
            }
          })
          .catch(error => setError(error))
        })()
      
    }, [])
  
    
    return (
      <SafeAreaView style={styles.detailsXContainer}>
        {isLoading && <View >
                        <ActivityIndicator size="large" color="#00a6ff" />
                        <Text >Loading</Text>
                      </View>}
        {error && <Text>server error occured, try again later</Text>}  
      <ScrollView contentContainerStyle={styles.detailsScrollView}>
         
        {report &&  
        <View style={styles.detailsListContainer}>
          
            <MapView style={styles.mapDetailsContainer}
            zoomEnabled={false}
            zoomTapEnabled={false}
            scrollEnabled={false}
                region={{
                  latitude: parseFloat(report.latitude),
                  longitude: parseFloat(report.longitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                    <Marker
                        coordinate={{ latitude: parseFloat(report.latitude) , longitude: parseFloat(report.longitude) }}
                       
                        />
              
            </MapView>

           <View style={styles.textDetails}>
            <Text style={styles.title}>Type of weather</Text>
            <Text style={styles.txts}>{report.characteristic}</Text>
          
            <Text style={styles.title}>Location</Text>
            <Text style={styles.txts}>{report.location}</Text>
  
            {report.description.length > 1  &&
            <><Text style={styles.title}>Description</Text>
            <Text style={styles.txts}>{report.description}</Text></>}
          </View>
        </View>
        
        }
                   
      </ScrollView>
      </SafeAreaView>
    );
  }

export default Details

const styles = StyleSheet.create({
    detailscontainer: {
      flex: 1,
      backgroundColor: '#fff',

    },
    detailsXContainer:{
      flex: 1,
      backgroundColor: '#fff',
      
    },
    detailsScrollView:{
      flex: 1,
      margin:25,
     
    },
    textDetails:{

    },
    detailsListContainer:{
      flex: 1,
      backgroundColor: '#fff',

    },
    mapContainer:{
      flex:1,
  
    },
    mapDetailsContainer: {
      flex: 1,
      width: Dimensions.get('window').width,
    },
    txts: {
      fontSize: 10,
      textAlign:'left'
    },
    title: {
      fontSize: 24,
      textAlign:'left'
    },
  
  })