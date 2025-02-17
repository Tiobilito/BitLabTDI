import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { mainStyles } from "./styles"

export default ({ label = "Fecha", onPress, showDt, value, onChange }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={mainStyles.title}>{label}</Text>
      <TouchableOpacity onPress={onPress}>
        {showDt && (
          <DateTimePicker value={value} mode="date" onChange={onChange} />
        )}
        <Text style={[mainStyles.input]}>{value.toLocaleDateString()}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
})
