import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Todo from './Todo';
import TodoDetail from './TodoDetail';

const TodoNav = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Todo" component={Todo} options={{ headerShown: false, tabBarVisible: true, tabBarStyle: { display: 'none' } }} />
            <Tab.Screen name="TodoDetail" component={TodoDetail} options={{ headerShown: false, tabBarVisible: true, tabBarStyle: { display: 'none' } }} />
        </Tab.Navigator>
    )
}

export default TodoNav