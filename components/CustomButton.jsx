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
      <TouchableOpacity
        style={[styles.button, buttonStyles]}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, textStyles]}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: width * 0.35,
    height: width * 0.12,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: width * 0.0,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
})
