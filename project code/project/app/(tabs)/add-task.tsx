import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    setLoading(true);

    try {
      const newTask: Task = {
        id: Date.now().toString(),
        name: taskName.trim(),
        description: taskDescription.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasks = existingTasks ? JSON.parse(existingTasks) : [];
      const updatedTasks = [...tasks, newTask];

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

      // Clear form
      setTaskName('');
      setTaskDescription('');
      
      Alert.alert('Success', 'Task added successfully!', [
        { text: 'OK', onPress: () => {} }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>TODO TASK</Text>
              <Text style={styles.subtitle}>ADD TASK</Text>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TASK NAME:</Text>
                <TextInput
                  style={styles.input}
                  value={taskName}
                  onChangeText={setTaskName}
                  placeholder="Enter task name"
                  placeholderTextColor="#999"
                  maxLength={100}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TASK DESCRIPTION:</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  placeholder="Enter task description"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />
              </View>
              
              <TouchableOpacity 
                style={[styles.addButton, loading && styles.addButtonDisabled]}
                onPress={handleAddTask}
                disabled={loading || !taskName.trim()}
              >
                <Text style={styles.addButtonText}>
                  {loading ? 'ADDING TASK...' : 'ADD TASK'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    letterSpacing: 2,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },
});