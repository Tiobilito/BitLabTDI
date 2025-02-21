import { View, Text, StyleSheet } from "react-native"
import { mainStyles } from "./styles"

export default ({ title, text, containerStyle = {}, textStyle = {} }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={mainStyles.title}>{title}</Text>
      <Text style={[mainStyles.input, { color: "#FFFA" }, textStyle]}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
})
