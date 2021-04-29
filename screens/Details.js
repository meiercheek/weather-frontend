import * as React from 'react'
import {  View, Text, StyleSheet, ActivityIndicator, Image, FlatList, SafeAreaView } from 'react-native'
import { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import {fetchWholeReport} from '../API.js'
import * as SecureStore from 'expo-secure-store'
import moment from 'moment'
import { Icon } from 'react-native-elements'
import {icons} from '../assets/Data'
import {mapStyle} from '../assets/mapstyle.js'

const Details = ({route, navigation}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [report, setReport] = useState(null)
    const [error, setError] = useState(false)
    const [marker, setMarker] = useState(null)
    //const [token, setToken] = useState(null)
    //console.table(route)
    report_id = route.params?.marker.report_id
    useEffect(() => { 
      SecureStore.getItemAsync('userToken').then((token) =>
        fetchWholeReport(token, report_id).then((responseData) => {
          if(responseData.hasOwnProperty("response")){
            if(responseData.response.hasOwnProperty("report")) { 
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
                value: moment(report.uploadtime).format('MMMM Do YYYY, h:mm:ss a')
              },
              {
                title: "Photo",
                value: report.photo
              },
            ]
          setMarker({
            latitude: report.latitude,
            longitude: report.longitude,
            icon: icons(report.characteristic)
          })
          setIsLoading(false)
          setReport(array)
          console.log(array)
          }
          
        }
        else if(responseData.hasOwnProperty("error")) {
          setIsLoading(false)
          setError(true)
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
        {error && <View style={{}}>
          <Icon name='error' color='#313237' />
          <Text style={{textAlign:'center'}}>Server error occured, try again later.</Text>
          </View>}  
        {report &&  
        <>
            <MapView style={styles.map}
            customMapStyle={mapStyle}
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
                          longitude: parseFloat(marker.longitude) }}>
                     <Image source={marker.icon} style={{height: 35, width:35 }} />       
                    </Marker>
              
            </MapView>
          <FlatList style={{margin:10}}
              data={report}
              renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'column' }}>
                
                { item.value != "-" && item.value != null && <>
                  <Text style={styles.title}>{item.title}</Text>
                  {item.title != "Photo" && item.value != null &&
                  <Text style={styles.value}>{item.value}</Text>}
                  {item.title == "Photo" &&  item.value != "LQ=="  &&<>
                    
                    <Image style={styles.imageThumbnail} source={{uri: `data:image/jpg;base64,${item.value}`}} ></Image>
                </>}
                </>}
                  
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
    flex: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageThumbnail: {
    height: 100,
    width: 100
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