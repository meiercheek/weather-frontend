import React, {useState, useContext} from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { AuthContext } from '../Auth.js'
import { validateAll } from 'indicative/validator'

const Login = ({navigation}) => {
  const [username, setUsername] = useState('lubko')
  const [password, setPassword] = useState('lubko')
  const [SignUpErrors, setSignUpErrors] = useState(null)

  const { signIn, signUp } = useContext(AuthContext)

  const handleSignIn = () => {
    const rules = {
        username: 'required|alpha',
        password: 'required|string|min:5|max:40'
    }

    const data = {
        username: username,
        password: password
    }

    const messages = {
        required: field => `${field} is required`,
        'username.alpha': 'Username contains unallowed characters',
        'password.min': 'Password is too shorter than 6 characters.'
    }

    validateAll(data, rules, messages)
        .then(() => {
            //console.log('successful sign in')
            signIn({ username, password })
        })
        .catch(err => {
            const formatError = {}
            err.forEach(err => {
                formatError[err.field] = err.message
            })
            setSignUpErrors(formatError)
        })
}

  return (
    <View style={styles.container}>
      <View style={styles.logogroup}>
        <Text style={styles.logo}>Weather</Text>
        <Text style={styles.logo}>Report</Text>
        <Text style={styles.logo}>App</Text>
      </View>
      <View style={styles.inputView} >
        <TextInput style={styles.inputText}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputView} >
        <TextInput style={styles.inputText}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
        />
      </View>

    <Text style={styles.forgot}> {SignUpErrors ? SignUpErrors.username : null}</Text>
    <Text style={styles.forgot}> {SignUpErrors ? SignUpErrors.password : null}</Text>

      <TouchableOpacity 
        onPress={() => {
          handleSignIn()
          }
        }
         style={styles.loginBtn}>
          <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => {
          signUp()
        }}
      >
        <Text style={styles.forgot}>Signup</Text>
        
      </TouchableOpacity>


    </View>
  )
}

export default Login

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
