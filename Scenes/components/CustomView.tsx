import React, { ReactNode } from "react"
import { View, StyleSheet, Dimensions } from "react-native"

interface Props {
  children: ReactNode
}

const { width, height } = Dimensions.get("window")

export const CustomView = ({ children }: Props) => {
  return (
    <View style={[styles.background]}>
      <View style={styles.backTriangle} />
      <View style={styles.mainTriangle} />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  mainTriangle: {
    width: 0,
    height: 0,
    position: "absolute",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: width * 1,
    borderRightWidth: width * 0.6,
    borderBottomWidth: height * 0.7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#328EC5",
    transform: [{ rotate: "30deg" }],
    top: -height * 0.45,
    right: -width * 0.7,
  },
  backTriangle: {
    width: 0,
    height: 0,
    position: "absolute",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: width * 0.75,
    borderRightWidth: width * 0.75,
    borderBottomWidth: height * 0.9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#57A9D9",
    transform: [{ rotate: "80deg" }],
    top: -height * 0.6,
    right: -width * 0.5,
  },
})
