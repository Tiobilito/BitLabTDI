import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome as Icon } from '@expo/vector-icons'
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

export default ({ navigation }) => {
  
  const handlePress = () => navigation.navigate("Check")
  
  const rotation = useSharedValue(90)

  useFocusEffect(
    useCallback(() => {
      rotation.value = withTiming(0, { duration: 1000 })
      
      return () => {
        rotation.value = 90
      }
    }, [])
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg`},
    ],
  }))

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fab} onPress={handlePress}>
        <Reanimated.View style={[animatedStyle]}>
          <Icon name='rotate-left' size={28} color="#FFF"/>
        </Reanimated.View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    top: 16,
    backgroundColor: '#328EC5',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: "#FFF",
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
})