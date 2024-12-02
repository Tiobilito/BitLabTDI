import React, { ReactNode } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

interface Props {
  children: ReactNode;
}

const Scale = Dimensions.get("window").width;

export const CustomView = ({ children }: Props) => {
  return (
    <View style={[styles.background]}>
      {/* Evitar el uso de posiciones absolutas en los triángulos */}
      <View style={styles.triangleBackground}>
        <View style={styles.mainTriangle} />
        <View style={styles.backTriangle} />
      </View>
      <View style={styles.centeredContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center", // Asegura que los hijos estén centrados
    alignItems: "center", // Centra los elementos
  },
  triangleBackground: {
    position: "absolute", // Mantiene la posición de los triángulos en el fondo
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Asegura que los triángulos no tapen los elementos principales
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
  },
  centeredContainer: {
    justifyContent: "center", // Centra los elementos
    alignItems: "center", // Centra los elementos
    flex: 1, // Ocupa todo el espacio disponible
    zIndex: 1, // Asegura que los elementos hijos estén sobre los triángulos
  },
});
