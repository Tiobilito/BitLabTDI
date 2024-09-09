import { React, useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { AddClient } from "../../Modules/OperacionesBD";

const Scale = Dimensions.get("window").width;

const AddCPage = ({ navigation }) => {
  const [Name, setName] = useState("");
  const [Addres, setAddres] = useState("");
  const [Colony, setColony] = useState("");
  const [City, setCity] = useState("");
  const [PostCode, setPostCode] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Phone2, setPhone2] = useState("");
  var Data = {
    idCliente: 0,
    nombre: "",
    direccion: "",
    colonia: "",
    ciudad: "",
    cp: "",
    correo: "",
    telefono: "",
    telefono2: "",
  };

  const VerifyAllContents = async () => {
    if (
      Name &&
      Addres &&
      Colony &&
      City &&
      PostCode &&
      Email &&
      Phone &&
      Phone2
    ) {
      Data.nombre = Name.toUpperCase();
      Data.direccion = Addres;
      Data.colonia = Colony;
      Data.ciudad = City;
      Data.cp = PostCode;
      Data.correo = Email;
      Data.telefono = Phone;
      Data.telefono2 = Phone2;
      await AddClient(Data);
      navigateToWorker();
    } else {
      Alert.alert("Por favor rellene todos los datos");
    }
  };

  const navigateToWorker = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={{ margin: 20 }}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Nombre: </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setName(text);
              }}
              value={Name}
              placeholder="Nombre"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Direccion: </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setAddres(text);
              }}
              value={Addres}
              placeholder="Direccion"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Colonia: </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setColony(text);
              }}
              value={Colony}
              placeholder="Colonia"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Ciudad: </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setCity(text);
              }}
              value={City}
              placeholder="Ciudad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Codigo Postal: </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                if (/^\d+$/.test(text) || text === "") setPostCode(text);
              }}
              keyboardType="numeric"
              value={PostCode}
              placeholder="Codigo Postal"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Corre electronico: </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setEmail(text);
              }}
              value={Email}
              placeholder="Correo"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Telefono: </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                if (/^\d+$/.test(text) || text === "") setPhone(text);
              }}
              keyboardType="numeric"
              value={Phone}
              placeholder="Telefono"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Otro Telefono: </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                if (/^\d+$/.test(text) || text === "") setPhone2(text);
              }}
              keyboardType="numeric"
              value={Phone2}
              placeholder="Telefono"
            />
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={VerifyAllContents}>
              <Image
                source={require("../../Resources/imagenes/agregar1.png")}
                style={styles.Buttons}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToWorker}>
              <Image
                source={require("../../Resources/imagenes/cancelar.png")}
                style={styles.Buttons}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#095ea7",
  },
  input: {
    height: Scale > 400 ? 60 : 35,
    flex: 1,
    padding: 10,
    fontSize: Scale > 400 ? 30 : 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: '1%', // Espacio horizontal entre elementos
    marginTop: '1%',
  },
  text: {
    fontSize: Scale > 400 ? 30 : 20,
    fontWeight: "bold",
    marginRight: 10,
    color: "white",
  },
  Buttons: {
    width: Scale > 400 ? 150 : 100,
    height: Scale > 400 ? 150 : 100,
    margin: 20,
  },
});

export default AddCPage;
