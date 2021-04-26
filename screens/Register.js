import React, {useState, useContext, useEffect} from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import {AuthContext} from '../Auth.js'
import { validateAll } from 'indicative/validator'
import { Input } from 'react-native-elements'


const Register = ({navigation}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [SignUpErrors, setSignUpErrors] = useState(null)

  const { signUp, signIn } = useContext(AuthContext)

  const handleSignUp = () => {
    const rules = {
        email: 'required|email',
        username: 'required|alpha',
        password: 'required|string|min:6|max:40'
    }

    const data = {
        email: email,
        username: username,
        password: password,
    }

    const messages = {
        required: field => `${field} is required`,
        'username.alpha': 'Username contains unallowed characters',
        'email.email': 'Please enter a valid email address',
        'password.min':
            'Password is too short. Must be greater than 6 characters',
    }

    validateAll(data, rules, messages)
        .then(() => {
            console.log('successful sign up')
            signUp({ email, username, password })
        })
        .catch(err => {
            console.log(err)
              const formatError = {}
            err.forEach(err => {
                formatError[err.field] = err.message
            })
            setSignUpErrors(formatError)
            
            
        })
}

useEffect(() => {}, [SignUpErrors])

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
                  onChangeText={setEmail}
        />
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

    <Text style={styles.forgot}> {SignUpErrors ? SignUpErrors.email : null}</Text>  
    <Text style={styles.forgot}> {SignUpErrors ? SignUpErrors.username : null}</Text>
    <Text style={styles.forgot}> {SignUpErrors ? SignUpErrors.password : null}</Text>
    
      <TouchableOpacity 
        onPress={() => {
            handleSignUp()
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
  )
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
})
