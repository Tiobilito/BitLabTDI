import { React, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ClientPage = ({navigation}) => {
    const route = useRoute();
    const { idCli } = route.params;

    useEffect(() => {
        
    }, []);

    return (
        <View
            style={styles.background}
        >
            <ScrollView style = {styles.scrollData}>
                <View>
                    <Text style = {styles.text} >Id Cliente: {idCli}</Text>
                    <Text style = {styles.text} >Id Cliente: {idCli}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#095ea7',
    },
    scrollData: {
        margin: 18,
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default ClientPage;