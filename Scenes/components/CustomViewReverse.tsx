import React, { ReactNode } from "react"
import { View, StyleSheet, Dimensions } from "react-native"

interface Props {
  children: ReactNode
}

const { width, height } = Dimensions.get("window")

export const CustomViewReverse = ({ children }: Props) => {
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    // zIndex: -2,
    // width: "100%",
    // height: "100%",
  },
  mainTriangle: {
    width: 0,
    height: 0,
    position: "absolute",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: width * 1,
    borderRightWidth: width * 0.6,
    borderBottomWidth: height * 0.35,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#328EC5",
    transform: [{ rotate: "5deg" }],
    bottom: -height * 0.15,
    left: -width * 0.01,
    // zIndex: 0
  },
  backTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: width * 0.7,
    borderRightWidth: width * 0.5,
    borderBottomWidth: height * 0.4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#57A9D9",
    transform: [{ rotate: "70deg" }],
    position: "absolute",
    bottom: -height * 0.2,
    left: -width * 0.3,
    // marginTop: "150%",
    // marginLeft: "-60%",
    // zIndex: -1,
  },
})
