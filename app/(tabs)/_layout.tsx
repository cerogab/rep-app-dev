import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { BlurView } from "expo-blur";
import { SymbolView } from "expo-symbols";
import { Platform, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/lib/theme-context";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
        <Label>Contacts</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="dashboard">
        <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
        <Label>Trends</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.greyOlive,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === "web" ? 84 : 56,
          paddingBottom: Platform.OS === "web" ? 34 : 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color, size }) => (
            Platform.OS === "ios" ? (
              <SymbolView name="person.2" tintColor={color} size={size} />
            ) : (
              <Ionicons name="people-outline" size={size} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Trends",
          tabBarIcon: ({ color, size }) => (
            Platform.OS === "ios" ? (
              <SymbolView name="chart.bar" tintColor={color} size={size} />
            ) : (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            )
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            Platform.OS === "ios" ? (
              <SymbolView name="gearshape" tintColor={color} size={size} />
            ) : (
              <Ionicons name="settings-outline" size={size} color={color} />
            )
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
