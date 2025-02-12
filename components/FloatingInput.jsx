import { View, Text, TextInput, StyleSheet } from "react-native"

export default ({title, placeholder = ""}) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <TextInput />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  }
})