import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TabBarIcon = ({ focused, name, label }) => {
  return (
    <View className="flex flex-col gap-1 items-center justify-center flex-1 min-w-[90px] min-h-[45px] overflow-hidden rounded-full mt-[25px]" >
      <Ionicons name={name} size={22} color={focused ? '#663399' : '#888'} />
      <Text
        className={`text-[10px] mt-1 ${focused ? 'text-[#663399] font-medium' : 'text-gray-500'}`}
      >
        {label}
      </Text>
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 65,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EFEFEF',
        },
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="home" label="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="calendar-outline" label="Schedule" />
          ),
        }}
      />

      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="school" label="Courses" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} name="person-outline" label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;