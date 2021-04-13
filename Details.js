
import * as React from 'react'
import {  View, Text, StyleSheet, Dimensions, ActivityIndicator, FlatList, ScrollView, SafeAreaView } from 'react-native'
import { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import {fetchWholeReport} from './API.js'
import * as SecureStore from 'expo-secure-store'


const Details = ({route, navigation}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [report, setReport] = useState(null)
    const [error, setError] = useState(false)
    const [marker, setMarker] = useState(null)
    //const [token, setToken] = useState(null)
    report_id = route.params?.marker.report_id
    useEffect(() => { 
      SecureStore.getItemAsync('userToken').then((token) =>
        fetchWholeReport(token, report_id).then((responseData) => {
          
          if(responseData != undefined && responseData.response.report != undefined) {
            
            let report = responseData.response.report
            let array = [
              {
                title: "Weather type",
                value: report.characteristic
              },
              {
                title: "Location",
                value: report.location
              },
              {
                title: "Description",
                value: report.description
              },
              {
                title: "Time of submission",
                value: report.uploadtime
              },
              {
                title: "Photo",
                value: "bude dobre"
              },
            ]
          setMarker({
            latitude: report.latitude,
            longitude: report.longitude
          })
          setIsLoading(false)
          setReport(array)
          }
          else if(responseData.response.error != undefined) {
            setError(true)
            setIsLoading(false)
          }
        }
        ).catch(e => console.error("details:" + e))



      )
      .catch(e =>
        console.error(`Token restoration failed in Details: ${e}`)
      ) 
    }, [])
  
    
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
    );
  }

export default Details

const styles = StyleSheet.create({
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