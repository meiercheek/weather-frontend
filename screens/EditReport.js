import React, { useState, useEffect } from 'react'
import { SafeAreaView, TextInput, Modal, ActivityIndicator,
    StyleSheet, Text, View, Dimensions, FlatList, Alert, Image, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {imageAssets, empty} from '../assets/Data.js'
import * as SecureStore from 'expo-secure-store'
import {updateReport, fetchWholeReport} from '../API.js'

const EditReport = ({route, _navigation}) => {
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [text, onChangeText] = React.useState("")
    const [error, setError] = useState(false)
    const [icon, setIcon] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [displayLoc, setDisplayLoc] = useState(null)
    const [region, setRegion] = useState(null)
    const [weatherType, setWeatherType] = useState(null)
    const [pb64, setPb64] = useState('-')
    const [userId, setUserId] = useState('-')
    const [reportId, setReportId] = useState('-')
    let receivedType = undefined
    const getWholeReport = async(id) =>{
        SecureStore.getItemAsync('userToken').then((token) =>{
            fetchWholeReport(token, id)
        .then((responseData) => {
            if(responseData.hasOwnProperty("response")){
              if(responseData.response.hasOwnProperty("report")) { 
                let report = responseData.response.report
                setWeatherType(report.characteristic)
                setUserId(report.user_id)
                setReportId(report.report_id)
                setRegion({
                    latitude: report.latitude,
                    longitude: report.longitude
                })
                onChangeText(report.description)
                setDisplayLoc(report.location)
                setIsLoading(false)
                setPhoto("data:image/jpg;base64,"+report.photo)
              }
            }
            else if(responseData.hasOwnProperty("error")) {
                setError(true)
                setIsLoading(false)
              }
            })
            
        .catch(e => console.error("edit:" + e))
        })
        
        
    }

    const postReport = async () => {
        let description
        let token = await SecureStore.getItemAsync('userToken')
        if(text == ""){
          description = "-"
        }
        else{
          description = text
        }
        updateReport(token, reportId ,{
          user_id: userId,
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
            navigation.navigate('ReportList', {refresh:true})
          }
          else{
            Alert.alert("Check your report and try again")
          }
          
        }).catch((e) =>{
          console.error(`display loc failed: ${e}`)
        })

    }
    useEffect(() => {

      //let p = route.params?.photo
      let pp = route.params?.b64
      
      if (pp != undefined) {
        //console.log(pp.slice(0,30))
        setPhoto(`data:image/jpg;base64,${pp}`)
        setPb64(`${pp}`)
      }
        let receivedType = route.params.weatherType
        if (receivedType != undefined){
            setWeatherType(receivedType)
        }
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
                setIcon(empty.imageLink) 
        }
        
        
    })
    useEffect(() => {
        let report_id= route.params.report
        getWholeReport(report_id)
    },[])

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
                          navigation.navigate('WeatherPicker', {edit:true})
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
                        navigation.navigate('Camera', {edit:true})
                      }}>
                      <Text style={styles.textStyle}>Take a photo</Text>
                    </Pressable>
                    </>
                   }
                    {item.title == "submit" && 
                   <>
                    <Pressable style={styles.button}
                        onPress={() => {
                          setModalVisible(true)
                          postReport()
                          
                        }}>
                          <Text style={styles.textStyle}>Update report</Text>
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
                  <Text style={styles.modalText}>Updating report</Text>
                </View>
              </View>
            </Modal>
          </View>  
        </SafeAreaView>
      )
  
}

export default EditReport

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