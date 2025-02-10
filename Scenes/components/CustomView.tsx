import React, { ReactNode, useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"

interface Props {
  children: ReactNode
}

const { width, height } = Dimensions.get("window")

export const CustomView = ({ children }: Props) => {
  const translateX = useSharedValue(-1000)
  const translateY = useSharedValue(-1000)
  const rotateMain = useSharedValue(0)
  const rotateBack = useSharedValue(0)

  useEffect(() => handleTranslate(), [])

  const handleTranslate = () => {
    translateX.value = withTiming(-width * 0.01, { duration: 1200 })
    translateY.value = withTiming(-height * 0.45, { duration: 1000 })
    rotateBack.value = withTiming(80, { duration: 1200 })
    rotateMain.value = withTiming(30, { duration: 1000 })
  }

  const animatedTranslateXStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value as number,
      },
      {
        rotate: `${rotateBack.value}deg` as string,
      },
    ] as const,
  }))

  const animatedTranslateYStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateY.value as number,
      },
      {
        rotate: `${rotateMain.value}deg` as string,
      },
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
  },
  mainTriangle: {
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
    right: -width * 0.7,
  },
  backTriangle: {
    position: "absolute",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: width * 0.75,
    borderRightWidth: width * 0.75,
    borderBottomWidth: height * 0.9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#57A9D9",
    top: -height * 0.6,
  },
})
