// renter@one.com - password
// renter@two.com - password


import {
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
  } from "react-native";
  import { UserContext, getUser } from "../controllers/UsersDB";
  import { useContext, useState } from "react";
  import { Colors } from "react-native/Libraries/NewAppScreen";
  
  const LoginScreen = ({ navigation }) => {
    const toHome = () => {
      getUser(email, password, (user) => {
        if (user == null) {
          setError("Invalid Credentials");
        } else if (user.type == "owner") {
          setError("");
          alert(`Login successful!`);
          //setCurrUser(user);
          navigation.navigate("Home");
        } else {
          setError("Invalid Credentials");
        }
      });
    };
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    //const { setCurrUser } = useContext(UserContext);
  
    return (
      <SafeAreaView style={[styles.content, { gap: 10 }]}>
        <TextInput
          style={styles.tb}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.tb}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />
        <Text style={styles.errorStyle}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={toHome}>
          <Text style={{ fontWeight: "bold", color: "white" }}>L O G I N</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={addUsers}>
          <Text>ADD USERS</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    );
  };
  
  export default LoginScreen;
  
  const styles = StyleSheet.create({
    content: {
      margin: 10,
      alignItems: "center",
    },
    button: {
      width: "100%",
      padding: 10,
      borderRadius: 10,
      backgroundColor: "rgb(120, 166, 90)",
      alignItems: "center",
    },
    tb: {
      width: "100%",
      padding: 10,
      borderRadius: 10,
      backgroundColor: "rgb(239, 239, 239)",
    },
    errorStyle: {
      color: "rgb(255,0,0)",
      fontWeight: "bold",
    },
  });
  