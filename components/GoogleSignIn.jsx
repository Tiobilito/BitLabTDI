// import { useEffect, useState } from "react";
// import { View, StyleSheet, Button, Text, Modal } from "react-native";
// import { WebView } from "react-native-webview";
// import * as WebBrowser from "expo-web-browser";
// import * as AuthSession from 'expo-auth-session'

// WebBrowser.maybeCompleteAuthSession();

// const GOOGLE_WEB_TOKEN =
//   "955311692015-k7sbk98ks82e3nv389u4nhvbk69obq0n.apps.googleusercontent.com";
// const GOOGLE_ANDROID_TOKEN =
//   "955311692015-ta1lf17m1h1sak8ce4ljjkb5qc6d7dls.apps.googleusercontent.com";

// export default () => {
//   const [accessToken, setAccessToken] = useState(null);
//   const [pickerUrl, setPickerUrl] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const redirectUri = AuthSession.makeRedirectUri({
//     native: `com.tiobilito.BitLabTDI:/oauth2redirect`,
//     useProxy: true,
//   });

//   const SCOPES = [
//     "profile",
//     "email"
//     // 'https://www.googleapis.com/auth/drive',
//     // 'https://www.googleapis.com/auth/drive.file',
//     // 'https://www.googleapis.com/auth/drive.readonly',
//     // 'https://www.googleapis.com/auth/drive.appdata',
//     // 'https://www.googleapis.com/auth/drive.metadata',
//     // 'https://www.googleapis.com/auth/drive.metadata.readonly',
//     // 'https://www.googleapis.com/auth/drive.apps.readonly',
//     // 'https://www.googleapis.com/auth/drive.photos.readonly',
//   ]

//   // const [request, response, promptAsync] = Google.useAuthRequest({
//   //   webClientId: GOOGLE_WEB_TOKEN,
//   //   androidClientId: GOOGLE_ANDROID_TOKEN,
//   //   scopes: SCOPES,
//   //   redirectUri,
//   // });

//   useEffect(() => {
//     GoogleSignin.configure({
//       // androidClientId: GOOGLE_ANDROID_TOKEN,
//       webClientId: GOOGLE_WEB_TOKEN,
//       // profileImageSize: 150,
//       scopes: SCOPES,
//       offlineAccess: true,
//     })
//   });

//   const handleGoogleSignIn = async () => {
//     try {
//       setIsSubmitting(true);
//       await GoogleSignin.hasPlayServices({
//         showPlayServicesUpdateDialog: true
//       });
//       console.log("Band 1")
//       const response = await GoogleSignin.signIn();
//       const token = (await GoogleSignin.getTokens()).accessToken;
//       console.log("response -> ", response)
//       console.log("token -> ", token)
//       console.log("Band 2")
//       if (isSuccessResponse(response)) {
//         console.log("Band 3")
//         const { idToken } = response.data
//         const { name, email, photo } = user
        
//         console.log("idToken: ", idToken)
//         console.log("name: ", name)
//         console.log("email: ", email)
//       } else {
//         console.log("Google SignIn was cancelled")
//       }
      
//       console.log("Band 4")
//       setIsSubmitting(false);
//     } catch (err) {
//       if (isErrorWithCode(err)) {
//         switch(err.code) {
//           case statusCodes.IN_PROGRESS: 
//             console.log("[x] Sign in in progress")
//           break;
//           case statusCodes.PLAY_SERVICES_NOT_AVAILABLE: 
//             console.log("[x] Sign in not available")
//           break;
//           case statusCodes.SIGN_IN_CANCELLED: 
//             console.log("[x] Sign in cancelled")
//           break;
//           case statusCodes.SIGN_IN_REQUIRED:
//             console.log("[x] Sign in required")
//           break;
//           default:
//             console.log("[x] Err code -> ", err.code)
//             console.log("[x] Err -> ", err)
//         }
//       } else {
//         console.log("[x] An unknown error ocurred")
//       }
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <View style={{ padding: 20 }}>
//       <Button
//           title="Sign In With Google"
//           onPress={() =>
//             handleGoogleSignIn()
//           }
//         />
//     </View>
//   );
// };
