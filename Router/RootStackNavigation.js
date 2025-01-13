import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '../src/Register';
import Login from '../src/Login';
import Tasks from '../src/Tasks';
import TaskList from '../src/TaskList';

const Stack = createNativeStackNavigator();

const RootStackNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
                <Stack.Screen name="Add Task" component={Tasks} />
                <Stack.Screen name="Task List" component={TaskList} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootStackNavigation;