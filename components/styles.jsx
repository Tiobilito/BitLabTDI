import { Dimensions, StyleSheet } from "react-native"
import { ErrorToast } from 'react-native-toast-message';

const { width, height } = Dimensions.get("window")

export const mainStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#394F66",
    marginBottom: 4,
  },
  input: {
    fontSize: 18,
    color: "#555",
    backgroundColor: "#C5E0F2",
    borderRadius: width > 400 ? 20 : 15,
    minHeight: height * 0.05,
    textAlignVertical: "center",
    padding: width * 0.02,
  },
})

export const toastConfig = {
  error: props => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: "#DC3545"}}
      text1Style={{color: "#DC3545"}}
      text2Style={{color: "#DC3545"}}
    />
  )
}