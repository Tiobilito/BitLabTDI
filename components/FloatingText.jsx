import { View, Text, StyleSheet } from "react-native"
import { mainStyles } from "./styles"

export default ({ title, text }) => {
  return (
    <View style={styles.container}>
      <Text style={mainStyles.title}>{title}</Text>
      <Text style={mainStyles.input}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
})
