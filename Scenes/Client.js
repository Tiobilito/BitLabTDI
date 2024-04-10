import { React } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ClientPage = ({navigation}) => {
    const route = useRoute();
    const { idCli } = route.params;

    return (
        <View
            style={styles.background}
        >
            <ScrollView>
                <Text style = {styles.text} >{idCli}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#1875c7',
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default ClientPage;