import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from 'expo-auth-session'

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_TOKEN =
  "955311692015-k7sbk98ks82e3nv389u4nhvbk69obq0n.apps.googleusercontent.com";
const GOOGLE_ANDROID_TOKEN =
  "955311692015-ta1lf17m1h1sak8ce4ljjkb5qc6d7dls.apps.googleusercontent.com";

const SCOPES = ["https://www.googleapis.com/auth/drive", "profile", "email"];

export default () => {
  const [accessToken, setAccessToken] = useState(null);
  const [pickerUrl, setPickerUrl] = useState(null);

  const redirectUri = AuthSession.makeRedirectUri({ native: `com.tiobilito.BitLabTDI:/oauth2redirect` });
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_TOKEN,
    androidClientId: GOOGLE_ANDROID_TOKEN,
    scopes: ["profile", "email", "https://www.googleapis.com/auth/drive.readonly"],
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("[+] success")
      const { authentication } = response;
      if (authentication?.accessToken)
        setAccessToken(authentication.accessToken)
    }

    if (response?.type !== "success") {
      console.log("[x] -> ", response)
    }

    console.log("Response -> ", response)
    // console.log("params 1 -> ", response.params)
    // console.log("params 2 -> ", response.params?.access_token)

  }, [response])

  const openGooglePicker = () => {
    if(!accessToken) {
      console.log("Inicia sesión")
      return;
    }

    const pickerUrl = `https://drive.google.com/embeddedfolderview?id=root&authuser=0#grid`;
    // const pickerUrl = "https://accounts.google.com/ServiceLogin?continue=https://drive.google.com/embeddedfolderview?id=root&authuser=0";
    setPickerUrl(pickerUrl)
  }

  const PickerModal = ({ pickerUrl, onClose }) => {
    return (
      <Modal
        visible={!!pickerUrl}
        animationType="slide"
        transparent={false}
      >
        <View style={{ flex: 1 }}>
          <Button title="Cerrar" onPress={onClose}/>
          <WebView source={{ uri: pickerUrl }} style={{flex: 1, marginTop: 10 }} />
        </View>
      </Modal>
    )
  }
  
  return (
    <View style={{ padding: 20 }}>
      {!accessToken ? (
        <Button title="Iniciar sesión con Google" onPress={() => promptAsync()} />
      ) : (
        <>
          <Text>Autenticado con éxito</Text>
          <Button title="Abrir Google Picker" onPress={openGooglePicker} />
        </>
      )}
  
      <PickerModal pickerUrl={pickerUrl} onClose={() => setPickerUrl(null)} />
    </View>
  );
};