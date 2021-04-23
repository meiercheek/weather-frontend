
import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import {AuthContext} from '../Auth.js'



const Register = ({navigation}) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [email, setEmail] = React.useState('')

  const { signUp, signIn } = React.useContext(AuthContext)

  return (
    <View style={styles.container}>
      <View style={styles.logogroup}>
        <Text style={styles.logo}>Weather</Text>
        <Text style={styles.logo}>Report</Text>
        <Text style={styles.logo}>App</Text>
      </View>
      <View style={styles.inputView} >
        <TextInput style={styles.inputText}
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail} />
      </View>
      
      <View style={styles.inputView} >
        <TextInput style={styles.inputText}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername} />
      </View>
      <View style={styles.inputView} >
        <TextInput style={styles.inputText}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry />
      </View>

    <Text style={styles.forgot}>message</Text>

      <TouchableOpacity 
        onPress={() => {
            signUp({ email, username, password })
        } }
         style={styles.loginBtn}>
          <Text style={styles.loginText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => {
          signIn()
        
        }}
      >
        <Text style={styles.forgot}>Have an account? Login</Text>
        
      </TouchableOpacity>


    </View>
  );
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: "bold",
    fontSize: 35,
    color: "#fff",
    marginBottom: 0,
  },
  logogroup:{
    marginBottom: 40
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
  forgot: {
    color: "white",
    fontSize: 11
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    color: "black"
  }
});
