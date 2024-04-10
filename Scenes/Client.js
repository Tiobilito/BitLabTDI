import { React } from 'react';
import { View, ScrollView } from 'react-native';

const ClientPage = ({navigation}) => {

    

    return (
        <View
            style={styles.background}
        >
            <ScrollView>
                <Text></Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#1875c7',
    },
});

export default ClientPage;