import React, { useState, useEffect, useMemo, useReducer, useContext, useLayoutEffect } from 'react'
import {  SafeAreaView, View, Text,  StyleSheet, Dimensions,  TouchableOpacity, Modal, Pressable } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Map from './screens/Map.js'
import Details from './screens/Details.js'
import CreateReport from './screens/CreateReport.js'
import WeatherPicker from './screens/WeatherPicker.js'
import Login from './screens/Login.js'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import {fetchLogin, fetchRegister} from './API.js'
import {AuthContext} from './Auth.js'
import SplashScreen from './screens/SplashScreen.js'
import Register from './screens/Register.js'
import CameraView from './screens/Camera.js'
import ReportList from './screens/ReportList'
import EditReport from './screens/EditReport.js'
import { Icon } from 'react-native-elements'


const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}

        options={{ title: 'Weather Report App',
        headerStyle: {
          backgroundColor: '#008bff',
        },
        headerTintColor: '#fff',

      }}
      />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="CreateReport" options={{ title: 'Create a report'}}
         component={CreateReport} />
         <Stack.Screen name="EditReport" options={{ title: 'Edit a report'}}
         component={EditReport} />
      <Stack.Screen name="Camera" component={CameraView} />
      <Stack.Screen name="WeatherPicker" options={{ title: 'Pick a weather type'}} component={WeatherPicker}  options={{ title: 'Pick a weather situation' }} />
      <Stack.Screen name="ReportList" options={{ title: 'My reports'}} component={ReportList} />

    </Stack.Navigator>
  );
}

const HomeScreen = ({route, navigation}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const {signOut} = useContext(AuthContext)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection:"row"}}>
            <TouchableOpacity style={{paddingHorizontal:15}}
                      onPress={() => navigation.navigate('ReportList')}>
                        <Icon name='article' color='#fff' />  
            </TouchableOpacity>
            <TouchableOpacity style={{paddingHorizontal:15}}
                      onPress={() => setModalVisible(true) }>
                        <Icon name='logout' color='#fff' /> 
            </TouchableOpacity>
          </View>
        
      ),
    })
  }, [navigation, setModalVisible]);

  return (
    
    <SafeAreaView style={styles.container}>
      <Map/>
      
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Are you sure you want to log out?</Text>
                  <Pressable
                      style={[styles.modalbutton, styles.buttonDelete]}
                      onPress={() => {
                        signOut()
                        setModalVisible(!modalVisible)
                      }}
                  >
                      <Text style={styles.textStyle}>Yes, log me out</Text>
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
            
      
    </SafeAreaView>
  )
}

async function saveToken(key, value) {
  await SecureStore.setItemAsync(key, value);
}


const Stack = createStackNavigator()

export default function App({ navigation }) {
  
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
          case 'TO_SIGNUP_PAGE':
            return {
              ...prevState,
              isLoading: false,
              isSignedUp: false,
              noAccount: true,
              message: ""
            }
          case 'TO_SIGNIN_PAGE':
            return {
              ...prevState,
              isLoading: false,
              isSignedIn: false,
              noAccount: false,
              message: ""
            }
          case 'RESTORE_TOKEN':
            return {
              ...prevState,
              userToken: action.token,
              isLoading: false,
            }
          case 'SIGNED_UP':
            return {
              ...prevState,
              isSignedIn: true,
              isSignedUp: true,
              isLoading: false,
              userToken: action.token,
            }
          case 'SIGN_IN':
            return {
              ...prevState,
              isSignedOut: false,
              isSignedIn: true,
              isSignedUp: true,
              userToken: action.token,
            }
          case 'SIGN_OUT':
            return {
              ...prevState,
              isSignedOut: true,
            }
        }
    },
    {
      isLoading: true,
      isSignedOut: false,
      isSignedUp: false,
      noAccount: false,
      isSignedIn: false,
      userToken: null,
    }
  )

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken

      try {
        userToken = await SecureStore.getItemAsync('userToken')
      } catch (e) {
        console.error(`Token restoration failed: ${e}`)
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        if (data && data.username !== undefined && data.password !== undefined){
        const { username, password } = data
        let r = await fetchLogin(username, password)

        if (r.auth == true){
           dispatch({ type: 'SIGN_IN', token: r.token })
           saveToken("userToken", r.token)
        }
        else {
          dispatch({type: 'TO_SIGNIN_PAGE'})
        }
      }
        else {
          dispatch({type: 'TO_SIGNIN_PAGE'})
        }
      },
      signOut: () => dispatch({ type: 'TO_SIGNIN_PAGE' }),
      signUp: async data => {
        if (data && data.email !== undefined 
          && data.username !== undefined && data.password !== undefined){
          const { email, username, password } = data
          let r = await fetchRegister(email, username, password)
          if (r.auth === true){
              dispatch({ type: 'SIGNED_UP', token: r.token })
              saveToken("userToken", r.token)
          }
          else {
            dispatch({type: 'TO_SIGNUP_PAGE'})
          }
        }
        
        else {
          dispatch({type: 'TO_SIGNUP_PAGE'})
        }
      },
    }),
    []
  )

  const stateConditionString = state => {
    let navigateTo = ''
    if (state.isLoading) {
        navigateTo = 'LOAD_APP'
    }
    if (state.isSignedIn && state.userToken && state.isSignedUp) {
        navigateTo = 'LOAD_HOME'
    }
    if (!state.isSignedUp && state.noAccount) {
        navigateTo = 'LOAD_SIGNUP'
    }
    if (!state.isSignedIn && !state.noAccount) {
        navigateTo = 'LOAD_SIGNIN'
    }
    return navigateTo
}

  const chooseScreen = (state) => {
    let navigateTo = stateConditionString(state)
    let arr = []

    switch (navigateTo) {
      case 'LOAD_APP':
        arr.push(<Stack.Screen name="Splash" component={SplashScreen} />)
        break

      case 'LOAD_SIGNUP':
        arr.push(
          <Stack.Screen
            name="SignUp"
            component={Register}
            options={{
              headerShown: false,
              title: 'Sign Up',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />,
        )
        break
      case 'LOAD_SIGNIN':
        arr.push(<Stack.Screen name="Login" 
        options={{ headerShown: false }}
         component={Login} />)
        break

      case 'LOAD_HOME':
        arr.push(
          <Stack.Screen
            name="Home"
            component={AppStack}
            options={{ headerShown: false }}
            
          />,
        )
        break
      default:
        arr.push(<Stack.Screen name="Login" component={Login} 
        options={{ headerShown: false }}  />)
        break
    }
    return arr[0]
  }



  if (state.isLoading) {
    return <SplashScreen />
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>{chooseScreen(state)}</Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
    
  )
}



const styles = StyleSheet.create({
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
    textAlign: "center",
    fontWeight:'bold'
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
  detailscontainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsXContainer:{
    flex: 1
  },
  detailsScrollView:{
    flex: 1
  },
  detailsListContainer:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  mapContainer:{
    flex:1,

  },
  container: {
    flex: 1,

  },
  mapDetailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    margin:60
  },
  buttonContainer:{
    position: 'absolute',
    elevation: 5,
    justifyContent: 'center',
    width: Dimensions.get('window').width
  },
  button:{
    backgroundColor: '#fff',
  },
  txts: {
    fontSize: 16,
  },
  title: {
    fontSize: 32,
  },

})