import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LogOut, User, Mail, Calendar } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    loadUserData();
    loadTaskStats();
  }, []);

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadTaskStats = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        setTaskCount(tasks.length);
        setCompletedCount(tasks.filter((task: any) => task.completed).length);
      }
    } catch (error) {
      console.error('Error loading task stats:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userLoggedIn');
              await AsyncStorage.removeItem('userEmail');
              router.replace('/(auth)/onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const clearAllTasks = () => {
    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to delete all tasks? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('tasks');
              setTaskCount(0);
              setCompletedCount(0);
              Alert.alert('Success', 'All tasks have been cleared!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear tasks. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>TODO TASK</Text>
            <Text style={styles.subtitle}>PROFILE</Text>
          </View>
          
          <View style={styles.content}>
            <View style={styles.profileCard}>
              <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                  <User size={40} color="#3498DB" />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Welcome!</Text>
                  <View style={styles.emailContainer}>
                    <Mail size={16} color="#7F8C8D" />
                    <Text style={styles.userEmail}>{userEmail}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{taskCount}</Text>
                <Text style={styles.statLabel}>Total Tasks</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{completedCount}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{taskCount - completedCount}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.clearButton} onPress={clearAllTasks}>
                <Text style={styles.clearButtonText}>Clear All Tasks</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 30,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3498DB',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 15,
  },
  clearButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: 'rgba(127, 140, 141, 0.8)',
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(127, 140, 141, 0.3)',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 1,
  },
});