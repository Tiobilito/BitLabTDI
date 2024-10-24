import AsyncStorage from "@react-native-async-storage/async-storage";

export const GetUserData = async () => {
  try {
    const UDjson = await AsyncStorage.getItem("@UserCr");
    if (UDjson !== null) {
      const parsedData = JSON.parse(UDjson);
      return parsedData;
    } else {
      console.log("No data found");
    }
  } catch (error) {
    console.error("Error al leer datos:", error);
  }
};

export const StoreUserData = async (code, password) => {
  var UserData = {
    Code: "",
    Password: "",
  };
  UserData.Code = code;
  UserData.Password = password;
  try {
    const UDjson = JSON.stringify(UserData);
    console.log(UDjson);
    await AsyncStorage.setItem("@UserCr", UDjson);
  } catch (error) {
    console.error("Error al guardar datos:", error);
  }
};
