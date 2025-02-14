import { Text, StyleSheet } from "react-native"

export default ({ title, text }) => {
  return (
    <Text style={[styles.detailText, { fontWeight: "bold" }]}>
      {title}
      <Text style={[styles.detailText, { fontWeight: "normal" }]}>{text}</Text>
    </Text>
  )
}

const styles = StyleSheet.create({
  detailText: {
    fontSize: 14,
    color: "#FFF",
  },
})
