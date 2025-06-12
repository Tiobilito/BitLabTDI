import { useEffect, useState } from 'react'
import { View, TouchableWithoutFeedback, StyleSheet, Dimensions, Keyboard } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated'

const { width } = Dimensions.get("window")

export default ({ visible, onClose, children }) => {
  const opacity = useSharedValue(0)
  const [isVisible, setIsVisible] = useState(visible)
  const DURATION = 300

  useEffect(() => {
    if (visible) {
      setIsVisible(true)
      opacity.value = withTiming(1, { duration: DURATION })
    } else {
      Keyboard.dismiss()
      opacity.value = withTiming(0, { duration: DURATION }, (finished) => {
        if (finished)
          runOnJS(setIsVisible)(false)
      })
    }
  }, [visible, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))
  
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
    backgroundColor: "#000",
  }))

  if (!isVisible) return null

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.overlayBackground, overlayStyle]} />
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss()
        onClose()
      }}>
        <View style={styles.overlayTouchable}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlayBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTouchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: width * 0.8,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})