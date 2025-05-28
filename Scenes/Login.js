import { React, useState, useCallback, useEffect } from "react"
import {
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  View,
  ScrollView,
  StatusBar,
} from "react-native"
import { StoreUserData } from "../Modules/DataInfo"
import { CheckUser } from "../Modules/Operations DB Users"
import { CustomView } from "./components/CustomView"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-toast-message'
import { toastConfig } from '../components/styles';

const Scale = Dimensions.get("window").width

const LoginPage = ({ navigation }) => {
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginEnable, setLoginEnable] = useState(false)

  const translateY = useSharedValue(-1000)
  /*
  useEffect(() => {
    const loadUserData = async () => {
      const data = await GetUserData();
      if (data) {
        setCode(data.Code);
        setPassword(data.Password);
      }
    };
    loadUserData();
  }, []);
  */

  useFocusEffect(
    useCallback(() => {
      // Add 800ms of delay
      setTimeout(() => {
        handleTranslateY()
      }, 800)

      return () => {
        translateY.value = -1000
      }
    }, [])
  )

  useEffect(() => {
    if (!code || !password)
      setLoginEnable(false)
    else
      setLoginEnable(true)
  }, [code, password])
  
  const Verify = async () => {
    const Verify = await CheckUser(code, password)
    if (Verify) {
      await StoreUserData(Verify.code, Verify.password, Verify.user_type) // Esperar a que termine de guardar los datos
      switch (Verify.user_type) {
        case 0:
          navigation.navigate("StaffApp")
          break
        case 1:
          navigation.navigate("StaffApp")
          break
        case 2:
          navigation.navigate("SocialServiceApp")
          break
        case 3:
          navigation.navigate("AcademicApp")
          break
        case 4:
          navigation.navigate("AcademicApp")
          break
      }
    }
  }

  const handleTranslateY = () => {
    translateY.value = withSpring(0, {
      damping: 18,
      stiffness: 180,
      mass: 1,
    })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <CustomView>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#328EC5"
        translucent={true}
      />
      <ScrollView>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Animated.View style={animatedStyle}>
            <Image
              source={require("../Resources/imagenes/BITLABTDI.png")}
              style={styles.Logo}
            />
          </Animated.View>
          <Text style={{ fontSize: Scale > 400 ? 40 : 20, fontWeight: "bold" }}>
            Ingresa a tu cuenta
          </Text>
          <View style={styles.formCont}>
            <Text style={styles.textForm}>Código de usuario</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setCode(text)}
              value={code.toString()}
              keyboardType="numeric"
            />
            
            <Text style={styles.textForm}>Contraseña</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder=""
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(prev => !prev)}
              >
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={32}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Iniciar */}
          <TouchableOpacity
            style={[styles.loginButton, { opacity: loginEnable ? 1 : 0.6 }]}
            onPress={() => Verify(code, password)}
            disabled={!loginEnable}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Iniciar</Text>
          </TouchableOpacity>

          <View style={{ marginBottom: Scale * 0.1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: Scale * 0.04,
              }}
            >
              <View
                style={{
                  height: Scale * 0.002,
                  width: Scale * 0.3,
                  backgroundColor: "#000000",
                }}
              />
              <Text> Ó </Text>
              <View
                style={{
                  height: Scale * 0.002,
                  width: Scale * 0.3,
                  backgroundColor: "#000000",
                }}
              />
            </View>
          </View>

          <View>
            <Text style={{ marginBottom: Scale * 0.04 }}>
              Si no estás registrado
            </Text>
            {/* Registrar */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={{ color: "#2272A7", fontWeight: "bold" }}>
                Registrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast config={toastConfig} />
    </CustomView>
  )
}

const styles = StyleSheet.create({
  input: {
    height: Scale > 400 ? 60 : 40,
    width: "93%",
    backgroundColor: "#C5E0F2",
    borderRadius: Scale > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    fontSize: Scale > 400 ? 30 : 15,
  },
  textForm: {
    fontSize: Scale > 400 ? 35 : 15,
    fontWeight: "regular",
    marginLeft: "5%",
    color: "#000000",
  },
  passwordWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: "8%",
    top: "30%",
  },
  formCont: {
    width: Scale * 0.8,
    marginBottom: Scale * 0.08,
    marginTop: Scale * 0.08,
  },
  Logo: {
    width: Scale * 0.6, // Ancho de la imagen
    height: Scale * 0.6, // Alto de la imagen
    marginTop: "10%",
  },
  loginButton: {
    width: Scale * 0.35,
    // height: "auto",
    height: Scale * 0.11,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: Scale * 0.08,
  },
  registerButton: {
    height: Scale * 0.1,
    borderWidth: 1,
    borderColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
})

export default LoginPage
