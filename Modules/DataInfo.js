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

export const StoreUserData = async (code, password, user_type) => {
  var UserData = {
    Code: "",
    Password: "",
    User_type: "",
  };
  UserData.Code = code;
  UserData.Password = password;
  UserData.User_type = user_type;
  try {
    const UDjson = JSON.stringify(UserData);
    await AsyncStorage.setItem("@UserCr", UDjson);
  } catch (error) {
    console.error("Error al guardar datos:", error);
  }
};
