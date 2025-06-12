import { View, StyleSheet, Text, Alert, Platform, TouchableOpacity, Image } from "react-native"
import * as Linking from 'expo-linking'
import { scale } from 'react-native-size-matters'

export default ({ link = null, idReport = null, setData, buttonStyle = {} }) => {

  const updateStatus = async (status) => {
    setData(status)
  }
  
  const openGoogleDrive = async () => {
    const driveLink = link || `https://drive.google.com/drive`
    let appUrl = link
    
    if (link === null) {
      if (Platform.OS === "android")
        appUrl = "https://drive.google.com/"
        // appUrl = "com.google.android.apps.docs://"
      else if (Platform.OS === "ios")
        appUrl = "googledrive://"
    }
      
      const marketUrl = 
      Platform.OS === "ios"
      ? "https://apps.apple.com/app/google-drive/id507874739"
      : Platform.OS === "android"
      ? "market://details?id=com.google.android.apps.docs"
      : "https://drive.google.com/drive"

      try {
        if (idReport == null)
          throw Error("No se encontro idReport")

        // App URL
        console.log("app url: ", appUrl)
        const res = await Linking.openURL(appUrl)
        console.log("response -> ", res)
        if (res === true) {
          updateStatus("pcb_revision")
          return
        }
        
        // Market URL
        console.log("Market url: ", marketUrl)
        res = await Linking.openURL(marketUrl)
        console.log("response -> ", res)
        if (res === true) {
          updateStatus("pcb_revision")
          return
        }

        // Web URL
        console.log("web url: ", driveLink)
        res = await Linking.openURL(driveLink)
        console.log("response -> ", res)
        if (res === true) {
          updateStatus("pcb_revision")
          return
        }
        
        else {
          Alert.alert("Error", "No se logro abrir Google Drive")
          updateStatus("approved")
        }
      } catch (err) {
        console.log("[x] openGoogleDrive Err -> ", err)
      }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={openGoogleDrive}
        style={[styles.button, buttonStyle]}
      >
        <Image
          source={require("../Resources/imagenes/Google-Drive-PNG.png")}
          style={styles.img}
        />
        <Text style={styles.text}> Drive</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(8),
    paddingHorizontal: scale(8),
    borderColor: "#2272A7",
    borderWidth: 2,
  },
  img: {
    width: scale(40),
    height: scale(40),
  },
  text: {
    color: "#2272A7",
    fontWeight: "bold",
    fontSize: 20,
  }
})