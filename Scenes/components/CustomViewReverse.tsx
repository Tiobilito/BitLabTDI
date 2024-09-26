import React, { ReactNode } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

interface Props {
  children: ReactNode;
}

const Scale = Dimensions.get("window").width;

export const CustomViewReverse = ({ children }: Props) => {
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
    //resizeMode: "cover",
    // alignItems: "center",
    // justifyContent: "center",
    //backgroundColor: "#1C3144",
  },
  mainTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 550,
    borderRightWidth: 0,
    borderBottomWidth: 300,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#328EC5",
    //transform: [{ rotateZ: "0deg" }],
    marginTop: "125%",
    marginLeft: "-30%",
    position: "absolute",
  },
  backTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderRightWidth: 390,
    borderBottomWidth: 250,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#57A9D9",
    //transform: [{ rotate: "95deg" }],
    marginTop: "140%",
    marginLeft: "0%",
    position: "absolute",
  },
});
