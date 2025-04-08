import { View, StyleSheet, Text, Alert, Platform, TouchableOpacity, Image } from "react-native"
import * as Linking from 'expo-linking'
import { scale, verticalScale } from 'react-native-size-matters'

export default ({link = null, buttonStyle = {} }) => {
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
        // App URL
        console.log("app url: ", appUrl)
        const res = await Linking.openURL(appUrl)
        console.log("response -> ", res)
        if (res === true)
          return
        
        // Market URL
        console.log("Market url: ", marketUrl)
        res = await Linking.openURL(marketUrl)
        console.log("response -> ", res)
        if (res === true)
          return

        // Web URL
        console.log("web url: ", driveLink)
        res = await Linking.openURL(driveLink)
        console.log("response -> ", res)
        if (res === true)
          return
        else
          Alert.alert("Error", "No se logro abrir Google Drive")
      } catch (err) {
        console.log("[x] openGoogleDrive Err -> ", err)
      }
      
      // await Linking.canOpenURL(marketUrl)
      // .then((supported) => {
      //   if(supported) {
      //     console.log("market suported: ", marketUrl)
      //     Linking.openURL(marketUrl)
      //   } else {
      //     Linking.canOpenURL(driveLink).then((supported) => {
      //       if (supported) {
      //         console.log("link  suported: ", driveLink)
      //         Linking.openURL(driveLink)
      //       }
      //       else
      //         Alert.alert("Error", "No se logro abrir Google Drive")
      //     })
      //   }
      // })
      // .catch(err => console.log("[x] openGoogleDrive Err -> ", err))
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
    backgroundColor: "#2272A7",
  },
  img: {
    width: scale(40),
    height: scale(40),
  },
  text: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  }
})