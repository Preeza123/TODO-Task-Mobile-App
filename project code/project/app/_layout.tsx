import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn === null) return; // Still loading

    const inAuthGroup = segments[0] === '(auth)';

    if (isLoggedIn && inAuthGroup) {
      // User is logged in but viewing auth screens, redirect to main app
      router.replace('/(tabs)');
    } else if (!isLoggedIn && !inAuthGroup) {
      // User is not logged in but viewing main app, redirect to auth
      router.replace('/(auth)/onboarding');
    }
  }, [isLoggedIn, segments]);

  const checkAuthStatus = async () => {
    try {
      const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      setIsLoggedIn(userLoggedIn === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    // Show loading screen while checking auth status
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}