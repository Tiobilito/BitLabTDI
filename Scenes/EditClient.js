import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const AddCPage = ({ navigation }) => {
  const route = useRoute();
  const { idClient } = route.params;
  const [Name, setName] = useState("");
  const [Addres, setAddres] = useState("");
  const [Colony, setColony] = useState("");
  const [City, setCity] = useState("");
  const [PostCode, setPostCode] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Phone2, setPhone2] = useState("");

  useEffect(() => {
    GetClientData();
  }, []);

  const GetClientData = () => {
    fetch("http://10.214.150.5:3000/clientes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        return response.json();
      })
      .then((data) => {
        data.forEach((item) => {
          if (item.idCliente === idClient) {
            setName(item.nombre);
            setAddres(item.direccion);
            setColony(item.colonia);
            setCity(item.ciudad);
            setPostCode(item.cp);
            setEmail(item.correo);
            setPhone(item.telefono);
            setPhone2(item.telefono2);
          }
        });
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  };

  const SentData = async () => {
    const Data = {
      idCliente: idClient,
      nombre: Name.toUpperCase(),
      direccion: Addres,
      colonia: Colony,
      ciudad: City,
      cp: PostCode,
      correo: Email,
      telefono: Phone,
      telefono2: Phone2,
    };
    fetch(`http://10.214.150.5:3000/clientes/${idClient}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((Data) => console.log(Data))
      .catch((err) => console.log(err));
    navigation.goBack();
  };

  const VerifyAllContents = () => {
    if (
      Name.trim() !== "" &&
      Addres.trim() !== "" &&
      Colony.trim() !== "" &&
      City.trim() !== "" &&
      PostCode.trim() !== "" &&
      Email.trim() !== "" &&
      Phone.trim() !== "" &&
      Phone2.trim() !== ""
    ) {
      SentData();
    } else {
      Alert.alert("Por favor rellene todos los datos correctamente");
    }
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
                source={require("../Resources/imagenes/actualizar.png")}
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
    flex: 1,
    padding: 10,
    fontSize: 30,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20, // Espacio horizontal entre elementos
    marginTop: 10,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    marginRight: 10,
    color: "white",
  },
  Buttons: {
    width: 150,
    height: 150,
    margin: 20,
  },
});

export default AddCPage;
