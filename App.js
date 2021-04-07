
import * as React from 'react'
import { Button, View, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Map from './Map.js'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import MapView from 'react-native-maps'

import Details from './Details.js'


function CreateReport({ navigation, route }) {

  const [postText, setPostText] = React.useState('');
  return (
    <>
      <TextInput
        multiline
        placeholder="What's on your mind?"
        style={{ height: 200, padding: 10, backgroundColor: 'white' }}
        value={postText}
        onChangeText={setPostText}
      />
      <Button
        title="Done"
        onPress={() => {
          // Pass params back to home screen
          navigation.navigate('Home', { post: postText })
        }}
      />
    </>
  );
}

function HomeScreen({route, navigation}) {
  React.useEffect(() => {
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
    }
  }, [route.params?.post])

  return (
    <View style={styles.container}>
      <Map/>
      <View style={styles.buttonContainer}>
      <Text style={{ margin: 10 }}>Post: {route.params?.post}</Text>
        <Button style={styles.button} title="Submit a report"
            onPress={() => navigation.push('CreateReport')}  />

     </View>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      
        <Stack.Screen
         name="Home"
          component={HomeScreen}
          options={{ title: 'Weather Report App',
                    headerStyle: {
                      backgroundColor: '#00a6ff',
                    },
                    headerTintColor: '#fff',
                     }} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="CreateReport" component={CreateReport} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App

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