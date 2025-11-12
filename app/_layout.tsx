
import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SystemBars } from "react-native-edge-to-edge";
import "react-native-reanimated";
import { useNetworkState } from "expo-network";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import React, { useEffect } from "react";
import { useColorScheme, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/styles/commonStyles";

SplashScreen.preventAutoHideAsync();

const customDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

function RootLayoutContent() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
      
      // Redirect to auth if not logged in
      if (!user) {
        router.replace('/auth');
      }
    }
  }, [user, isLoading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="results" options={{ headerShown: false }} />
      <Stack.Screen name="subscription" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={customDarkTheme}>
        <SystemBars style="light" />
        <StatusBar style="light" />
        <WidgetProvider>
          <LocalizationProvider>
            <AuthProvider>
              <RootLayoutContent />
            </AuthProvider>
          </LocalizationProvider>
        </WidgetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
