import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, LayoutAnimation, Platform, UIManager 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => { loadTasks(); }, []);
  useEffect(() => { saveTasks(tasks); }, [tasks]);

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.log("Error saving tasks:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch (error) {
      console.log("Error loading tasks:", error);
    }
  };

  const addTask = () => {
    if (task.trim() === '') return;
    LayoutAnimation.easeInEaseOut();
    setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
    setTask('');
  };

  const toggleTask = (id) => {
    LayoutAnimation.easeInEaseOut();
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          LayoutAnimation.easeInEaseOut();
          setTasks(tasks.filter(t => t.id !== id));
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 My To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#888"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Icon name="add-circle" size={40} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity onPress={() => toggleTask(item.id)} style={{ flex: 1 }}>
              <Text style={[styles.task, item.completed && styles.completed]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Icon name="trash" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#555',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 8,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  task: {
    fontSize: 18,
    color: '#fff',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
