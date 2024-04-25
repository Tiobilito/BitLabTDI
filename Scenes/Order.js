import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TextInput } from 'react-native';

const OrderPage = ({ navigation }) => {
    const [ShowCost, setShowCost] = useState(false);
    const [idOrder, setIdOrder] = useState(0);
    const [idDevice, setIdDevice] = useState(0);
    const [idClient, setIdClient] = useState(0);
    const [partsUsed, setPartsUsed] = useState('');
    const [geneDiag, setGeneDiag] = useState('');
    const [status, setStatus] = useState('');
    const [department, setDepartment] = useState('');
    const [discounts, setDiscounts] = useState(0);
    const [typePay, setTypePay] = useState('');
    const [total, setTotal] = useState(0);

    return (
        <View style={styles.background}>
            <ScrollView>
                <View style = {{ margin: 20 }}>
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
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#095ea7',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20, // Espacio horizontal entre elementos
        marginTop: 10,
    },
});

export default OrderPage;