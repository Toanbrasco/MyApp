import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

const Loading = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#00ff00" />
        </View>
    )
}

export default Loading