import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome as Icon } from '@expo/vector-icons'

export default ({ navigation }) => {
  
  const handlePress = () => navigation.navigate("Check")
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fab} onPress={handlePress}>
        <Icon name='rotate-left' size={28} color="#FFF"/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    // position: 'absolute',
    top: 16,
    // bottom: 16,
    // alignSelf: "flex-end",
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