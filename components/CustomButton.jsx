import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native"

const { width } = Dimensions.get("window")

export default ({ title, onPress, buttonStyles = {}, textStyles = {} }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, buttonStyles]} onPress={onPress}>
        <Text style={[styles.buttonText, textStyles]}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    height: width * 0.11,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
})
