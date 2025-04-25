import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import './global.css';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function ProtectedLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === 'auth'; // i.e. 'auth/login', 'auth/signup'

  useEffect(() => {
    if (!isLoading) {
      if (!user && !inAuthGroup) {
        router.replace('/auth/login');
      } else if (user && inAuthGroup) {
        router.replace('/(tabs)'); // your main home screen
      }
    }
  }, [user, inAuthGroup, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: true }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="courses/CourseRegistration" options={{ headerShown: true, title: 'Course registration' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedLayout />
    </AuthProvider>
  );
}
