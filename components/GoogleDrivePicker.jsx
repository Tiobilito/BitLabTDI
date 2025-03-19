import { useEffect, useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
// import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_TOKEN = "955311692015-k7sbk98ks82e3nv389u4nhvbk69obq0n.apps.googleusercontent.com";
const GOOGLE_ANDROID_TOKEN = "955311692015-ta1lf17m1h1sak8ce4ljjkb5qc6d7dls.apps.googleusercontent.com";
const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true });

const SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive",
  "profile",
  "email",
];

export default () => {
  const [access_token, setAccess_token] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [fileUrl, setFileUrl] = useState(null);
  const [pickerUrl, setPickerUrl] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
        androidClientId: "955311692015-ta1lf17m1h1sak8ce4ljjkb5qc6d7dls.apps.googleusercontent.com",
        webClientId: GOOGLE_WEB_TOKEN,
        scopes: ["profile", "email"],
    },
    {
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    },
  );

  useEffect(() => {
    if (response?.type === "success") {
      setIsLoading(true);
      const { authentication } = response;
      if (authentication) {
          setAccess_token(authentication.accessToken);
          fetchUserInfo(authentication.accessToken);
      }
    } else if (response?.type === "error") {
      console.log("Error de autenticación: ", response.error || "Error de autenticación");
      setIsLoading(false)
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Error HTTP: " + response.status);
      }

      const user = await response.json();
      setUserInfo(user);
    } catch (err) {
      console.log("Err -> ", err);
      console.log("Err response -> ", err.response);
      console.error("Error al intercambio de token: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
        setIsLoading(true);
        await promptAsync();
    } catch (err) {
      console.log("Err -> ", err);
      console.log("Err response -> ", err.response);
      setIsLoading(false);
    }
  }

  const getPublicFileLink = async (fileId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webViewLink`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visibility: "anyoneWithLink",
          }),
        }
      );

      const file = await response.json();
      setFileUrl(file.webViewLink);
    } catch (err) {
      console.log("[x] Err -> ", err);
      console.log("[x] Err response -> ", err.response);
      console.error("Error getting public file link");
    }
  };

  const authenticateGoogle = async () => await promptAsync();

  const openGooglePicker = (token) => {
    const pickerUrl = `https://drive.google.com/embeddedfolderview?id=root&authuser=0#grid`;

    setPickerUrl(pickerUrl);
  };

  return (
    <View style={{ padding: 20 }}>
      {!userInfo ? (
        <View>
            <Text>Iniciar sesión con Google</Text>
            <Button
            title={isLoading ? "Cargando..." : "Iniciar sesión con Google"}
            onPress={handleGoogleSignIn}
            disabled={!request || isLoading}
            />
        </View>
      ) : (
        <>
          <Text>Bienvenido, {userInfo?.name}</Text>
          <Text>Email: {userInfo?.email}</Text>
          <Text>Tu Access Token: {access_token}</Text>
          <Button
            title="Obtener enlace público de archivo"
            onPress={() => getPublicFileLink}
          />
          {fileUrl && (
            <Text>
              Enlace público del archivo: <Text>{fileUrl}</Text>
            </Text>
          )}
        </>
      )}
    </View>
  );
};
