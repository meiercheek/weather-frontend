import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, Modal, Pressable, View, Text, Alert, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import Card from '../components/Card.js'
import {getThisUsersReports, getThisUser} from '../API.js'
import { useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'


const ReportList = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(true)
  const [list, setList] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const getList = async () => {
 
    let reportlist
    let token = await SecureStore.getItemAsync('userToken')
    let userIdResponse = await getThisUser(token)
    userIdResponse = userIdResponse.response.user_id
    getThisUsersReports(token, userIdResponse).then((responseData)=> {
        if(responseData != undefined){
          if (responseData.response != undefined){
            reportlist = responseData.response.reports
            let array = []
            for (let i = 0; i < reportlist.length; i++){
              array.push({title: reportlist[i].characteristic, value: reportlist[i]})
            }
            setList(array)
            setIsLoading(false)
          }
        }
    })
  
  }

  useEffect(() => { 
    getList()
  },[])

  return (
    <SafeAreaView style={styles.container}>
        {isLoading && <View >
                        <ActivityIndicator size="large" color="#00a6ff" />
                
                      </View>
        }
        {list &&
          <FlatList
          data={list}
          renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
              <TouchableOpacity onPress={()=>
                  navigation.navigate('Details', {marker: item.value})}>
                  <Card>
                    <Text style={styles.titleText}>
                      {item.title}
                    </Text>
                      <Text>{item.value.location}</Text>
                      <Text>{moment(item.value.uploadtime).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                      <Pressable
                          style={[styles.button, styles.buttonEdit]}
                          onPress={() => {
  
                            
                          }}>
                      
                        <Text style={styles.textStyle}>Edit</Text>
                      </Pressable>      
                      <Pressable
                          style={[styles.button, styles.buttonDelete]}
                          onPress={() => {
                            setModalVisible(!modalVisible)
                            
                          }}>
                      
                        <Text style={styles.textStyle}>Delete</Text>
                      </Pressable>    
                  </Card>
              </TouchableOpacity>
          </View>
          )}

          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
      />
        }
        
        <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Are you sure? This action is irreversible.</Text>
                  <Pressable
                      style={[styles.modalbutton, styles.buttonDelete]}
                      onPress={() => {
                        setModalVisible(!modalVisible)

                      }}
                  >
                      <Text style={styles.textStyle}>Delete report</Text>
                  </Pressable>
                  <Pressable
                      style={[styles.modalbutton, styles.buttonEdit]}
                      onPress={() => {
                        setModalVisible(!modalVisible)

                      }}
                  >
                      <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>  
      </SafeAreaView>
  )
}
export default ReportList

export const styles = StyleSheet.create({
    titleText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    paragraph: {
      marginVertical: 8,
      lineHeight: 20,
    },
    container: {
      flex: 1,
      padding: 20,
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
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      width: '30%',
      marginTop:5
    },
    modalbutton: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      margin:5
    },
    buttonEdit: {
      backgroundColor: "#45a6f3",
    },
    buttonDelete: {
      backgroundColor: "#ff4c4c",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
  })