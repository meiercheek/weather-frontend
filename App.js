import React, { useEffect, useMemo, useReducer, useContext } from 'react'
import { Button, View, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Map from './Map.js'
import Details from './Details.js'
import CreateReport from './CreateReport.js'
import WeatherPicker from './WeatherPicker.js'
import Login from './Login.js'
import * as SecureStore from 'expo-secure-store'
import {fetchLogin, fetchRegister} from './API.js'
import {AuthContext} from './Auth.js'
import SplashScreen from './SplashScreen.js'
import Register from './Register.js'

const AppStack = () => {
  const {signOut} = useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home Screen"
        component={HomeScreen}
        initialParams={{singOut: signOut}}
        options={{ title: 'Weather Report App',
        headerStyle: {
          backgroundColor: '#008bff',
        },
        headerTintColor: '#fff',
      }}
      />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="CreateReport" component={CreateReport} />
      <Stack.Screen name="WeatherPicker" component={WeatherPicker}  options={{ title: 'Pick a weather situation' }} />
    </Stack.Navigator>
  );
}

const HomeScreen = ({route, navigation}) => {
  useEffect(() => {
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
    }
  }, [route.params?.post])

  return (
    
    <View style={styles.container}>
      <Map/>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} title="Submit a report"
            onPress={() => navigation.push('CreateReport')}  />

     </View>
    </View>
  )
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
            }
          case 'TO_SIGNIN_PAGE':
            return {
              ...prevState,
              isLoading: false,
              isSignedIn: false,
              noAccount: false,
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
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken

      try {
        userToken = await SecureStore.getItemAsync('userToken')
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        if (data && data.username !== undefined && data.password !== undefined){
        const { username, password } = data
        let r = await fetchLogin(username, password)
        console.log(r)
        if (r.auth == true){
          console.log(r)
           dispatch({ type: 'SIGN_IN', token: r.token })
        }
        else {
          dispatch({type: 'TO_SIGNIN_PAGE'})
        }
      }
        else {
          dispatch({type: 'TO_SIGNIN_PAGE'})
        }
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        console.log(data)
        if (data && data.email !== undefined 
          && data.username !== undefined && data.password !== undefined){
          const { email, username, password } = data
          let r = await fetchRegister(email, username, password)
          if (r.auth === true){
              dispatch({ type: 'SIGNED_UP', token: r.token })
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
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