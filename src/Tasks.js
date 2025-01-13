import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import getEnvVars from '../config';
const { apiUrl } = getEnvVars();

const Tasks = ({navigation}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleAddTask = async () => {
        try {
            const body = {
                title: title,
                description: description,
                deadline: deadline?.toISOString()  // Convert date to ISO string
            };
            if(title && description){
            const response = await axios.post(`${apiUrl}/api/addTask`, body);

            if (!response.data.success) {
                const errorText = await response.text();
                throw new Error(`Task creation failed: ${errorText}`);
            }

            setTitle('');
            setDescription('');
            navigation.navigate('Task List');
        }
        else{
            Alert.alert(`Please fill details!`, `Fields can't be empty`)
        }
        } catch (err) {
            console.error(err);
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDeadline(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create New Task</Text>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput 
                    placeholder="Enter task title" 
                    value={title} 
                    onChangeText={setTitle} 
                    style={styles.input}
                    placeholderTextColor="#999" 
                />
                <Text style={styles.label}>Description</Text>
                <TextInput 
                    placeholder="Enter task description" 
                    value={description} 
                    onChangeText={setDescription} 
                    style={[styles.input, styles.descriptionInput]}
                    multiline={true}
                    numberOfLines={4}
                    placeholderTextColor="#999"
                />

            <Text style={styles.label}>Deadline</Text>
            <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateButtonText}>
                    {deadline?.toLocaleDateString()}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={deadline}
                    mode="date"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                />
            )}
                <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Create Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center'
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    input: {
        height: 50,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        fontSize: 16
    },
    descriptionInput: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 12
    },
    dateButton: {
        height: 50,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center'
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333'
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        marginTop: 10
    },
    addButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default Tasks;