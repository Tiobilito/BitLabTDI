import React, { ReactNode } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

interface Props {
  children: ReactNode;
}

const Scale = Dimensions.get("window").width;

export const CustomView = ({ children }: Props) => {
  return (
    <View style={[styles.background]}>
      <View style={styles.backTriangle} />
      <View style={styles.mainTriangle} />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {children}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  mainTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 450,
    borderRightWidth: 280,
    borderBottomWidth: 300,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#328EC5",
    transform: [{ rotate: "30deg" }],
    marginTop: "-35%",
    marginLeft: "-30%",
    position: "absolute",
  },
  backTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 350,
    borderRightWidth: 200,
    borderBottomWidth: 250,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#57A9D9",
    transform: [{ rotate: "95deg" }],
    marginTop: "-25%",
    marginLeft: "-70%",
    position: "absolute",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderBottomWidth: 120,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#328EC5",
  },
});
