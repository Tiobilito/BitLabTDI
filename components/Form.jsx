import { useEffect } from "react"
import { View, StyleSheet, ScrollView, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

export default ({
  title,
  children,
  bodyStyle = {},
  shadow = true,
  transition = "translate",
}) => {
  const translateX = useSharedValue(transition === "translate" ? -width : 0)

  const letters = title.split("").map(() => ({
    translateY: useSharedValue(-20),
    scale: useSharedValue(0),
  }))

  const handleTranslate = () => {
    translateX.value = withTiming(0, { duration: 600 })
  }

  const handleSpring = () => {
    // Animar cada letra con un retraso
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.translateY.value = withSequence(
          withSpring(0, {
            damping: 8,
            stiffness: 100,
          })
        )
        letter.scale.value = withSequence(
          withSpring(1.2, {
            damping: 8,
            stiffness: 100,
          }),
          withSpring(1, {
            damping: 8,
            stiffness: 100,
          })
        )
      }, index * 40)
    })
  }

  useEffect(() => {
    if (transition === "translate") handleTranslate()
    if (transition === "spring") handleSpring()
  }, [])

  const animatedTranslate = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View style={styles.mainContainer}>
      {/* Contenedor del título animado */}
      <View style={styles.titleWrapper}>
        <Animated.View style={[animatedTranslate]} pointerEvents="none">
          {transition === "translate" ? (
            <Animated.Text style={styles.title}>{title}</Animated.Text>
          ) : (
            <View style={styles.titleContainer}>
              {title.split("").map((letter, index) => (
                <Animated.Text
                  key={index}
                  style={[
                    styles.titleLetter,
                    useAnimatedStyle(() => ({
                      transform: [
                        { translateY: letters[index].translateY.value },
                        { scale: letters[index].scale.value },
                      ],
                    })),
                  ]}
                >
                  {letter}
                </Animated.Text>
              ))}
            </View>
          )}
        </Animated.View>
      </View>

      {/* Contenedor del contenido scrolleable */}
      <View style={styles.contentContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          pointerEvents="auto"
        >
          <View style={[styles.body, shadow ? styles.shadow : {}, bodyStyle]}>
            {children}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingBottom: height * 0.08,
  },
  titleWrapper: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: "box-none",
  },
  titleContainer: {
    margin: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 12,
  },
  contentContainer: {
    flex: 1,
    marginTop: 50, // Espacio para el título
  },
  scrollView: {
    flex: 1,
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
  titleLetter: {
    fontSize: 16,
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
    minWidth: width * 0.8,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
})
