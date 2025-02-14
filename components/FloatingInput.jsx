import { View, Text, StyleSheet, TextInput } from "react-native"
import { mainStyles } from "./styles"

export default ({
  label,
  value,
  onChangue,
  keyboardType,
  editable = true,
  secureTextEntry = false,
  placeholder,
  determinante = "tu",
}) => {
  return (
    <View style={styles.container}>
      <Text style={mainStyles.title}>{label}</Text>
      <TextInput
        style={mainStyles.input}
        placeholder={placeholder ?? `Ingresa ${determinante} ${label.toLowerCase()}`}
        value={value}
        onChangeText={onChangue}
        keyboardType={keyboardType}
        editable={editable}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
})
