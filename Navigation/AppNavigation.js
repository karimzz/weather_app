import React from 'react'
import HomeScreen from '../Screen/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function AppNavigation() {

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen options={{headerShown : false}} name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}