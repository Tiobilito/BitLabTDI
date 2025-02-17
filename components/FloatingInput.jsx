import { View, Text, StyleSheet, TextInput } from "react-native"
import { mainStyles } from "./styles"

export default ({
  label,
  value,
  onChangeText,
  keyboardType,
  editable = true,
  secureTextEntry = false,
  placeholder,
  determinante = "tu",
  multiline = false,
  containerStyle = {},
  inputStyle = {},
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={mainStyles.title}>{label}</Text>
      <TextInput
        style={[mainStyles.input, inputStyle, multiline && { height: "auto" }]}
        placeholder={
          placeholder ?? `Ingresa ${determinante} ${label.toLowerCase()}`
        }
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
})
