import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Xanh lá #4BB543
// Xanh dương #2196F3

import HomeScreen from './screen/HomeScreen';
import Spending from './screen/Spending';
import Todo from './screen/Todo';
import TodoDetail from './screen/TodoDetail';
import Nofication from './screen/Nofication';
import Credit from './screen/Credit';
import { enableScreens } from 'react-native-screens';
import TodoNav from './screen/TodoNav';


const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    // const getData = async () => {
    //     const data = await firestore().collection('Todo').get();
    //     setData(data._data)
    // }
    const Tab = createBottomTabNavigator();
    enableScreens();

    // useEffect(() => {
    //     getData()
    // }, [])

    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Home">
                <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
                <Tab.Screen name="Spending" component={Spending} options={{ headerShown: false, tabBarVisible: true, tabBarStyle: { display: 'none' } }} />
                <Tab.Screen name="Todos" component={TodoNav} options={{ headerShown: false, tabBarVisible: true, tabBarStyle: { display: 'none' } }} />
                {/* <Tab.Screen name="Todos" component={Todo} options={{ headerShown: false, tabBarVisible: true, tabBarStyle: { display: 'none' } }} /> */}
                {/* <Tab.Screen name="TodoDetail" component={TodoDetail} options={{ headerShown: false, tabBarVisible: true, tabBarStyle: { display: 'none' } }} /> */}
                <Tab.Screen name="Nofication" component={Nofication} options={{ headerShown: false, tabBarVisible: true, tabBarStyle: { display: 'none' } }} />
                <Tab.Screen name="AddCredit" component={Credit} options={{ headerShown: false, tabBarVisible: true, tabBarStyle: { display: 'none' } }} />
                <Tab.Screen name="EditCredit" component={Credit} options={{ headerShown: false, tabBarVisible: true, tabBarStyle: { display: 'none' } }} />
            </Tab.Navigator>

        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
