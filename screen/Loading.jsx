import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native'

const Loading = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
                style={{ width: 100, height: 100 }}
                source={require('../assets/Images/Logo.png')}
            />
            <ActivityIndicator size="large" color="#A5A5A5" />
        </View>
    )
}

export default Loading