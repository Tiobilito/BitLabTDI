import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Reanimated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated'
import { MaterialIcons } from "@expo/vector-icons"
import { scale } from 'react-native-size-matters';

export default ({ onPress }) => {
    
    const rotation = useSharedValue(0)

    const handlePress = () => {
        const current = rotation.value
        rotation.value = withTiming(current === 0 ? 180 : 0, { duration: 300 })
        onPress()
    }

    const rotationStyle = useAnimatedStyle(() => ({
        transform: [
            {rotate: `${rotation.value}deg`}
        ]
    }))
    
    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>        
            <Reanimated.View style={rotationStyle}>
                <MaterialIcons name="loop" size={30} color="#2272A7" />
            </Reanimated.View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
    padding: scale(6),
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#2272A7"
    }
})