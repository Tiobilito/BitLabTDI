import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

export default ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: height * 0.08,
    marginTop: 10,
    // height: height * 1,
    // justifyContent: "center",
    // alignContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    margin: 8,
    marginLeft: 12,
    letterSpacing: 0.33,
    color: "#A69F9F",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  body: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    minWidth: width * 0.8,
    // height: height * 0.8,
  },
})
