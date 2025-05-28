import React, { ReactNode, useEffect } from "react"
import { View, StyleSheet, Dimensions, Keyboard, StatusBar } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated"

interface Props {
  children: ReactNode
}

const { width, height } = Dimensions.get("window")

export const CustomViewReverse = ({ children }: Props) => {
  const translateX = useSharedValue(-1000)
  const translateY = useSharedValue(1000)
  const rotateMain = useSharedValue(0)
  const rotateBack = useSharedValue(140)
  const opacity = useSharedValue(1)

  useEffect(() => {
    StatusBar.setBarStyle("dark-content")
    StatusBar.setBackgroundColor("#f5f5f5")
    handleTranslate()
  }, [])

  // Evita que al aparecer el teclado se muestre cortado el fondo
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      opacity.value = 0
    })
    
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      opacity.value = withDelay(50, withTiming(1, { duration: 50 }))
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  const handleTranslate = () => {
    translateX.value = withTiming(-width * 0.3, { duration: 1000 })
    translateY.value = withTiming(height * 0.48, { duration: 900 })
    rotateBack.value = withTiming(70, { duration: 1000 })
    rotateMain.value = withTiming(5, { duration: 900 })
  }

  const animatedTranslateXStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value as number },
      { rotate: `${rotateBack.value}deg` as string },
    ] as const,
    opacity: opacity.value,
  }))

  const animatedTranslateYStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value as number },
      { rotate: `${rotateMain.value}deg` as string },
    ] as const,
  }))

  return (
    <View style={styles.background}>
      <Animated.View style={[styles.backTriangle, animatedTranslateXStyle]} />
      <Animated.View style={[styles.mainTriangle, animatedTranslateYStyle]} />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {children}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  mainTriangle: {
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
    // bottom: -height * 0.15,
    left: -width * 0.01,
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
  },
})
