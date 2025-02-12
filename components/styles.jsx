import { Dimensions, StyleSheet } from "react-native"

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
