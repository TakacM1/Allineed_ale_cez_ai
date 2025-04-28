import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import StartWorkoutScreen from '../screens/StartWorkoutScreen';
import MealsScreen from '../screens/MealsScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import ProgressScreen from '../screens/ProgressScreen';
import MeasurementsScreen from '../screens/MeasurementsScreen';
import HabitsScreen from '../screens/HabitsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import theme
import { COLORS, FONTS } from '../constants/theme';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator 
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.secondary,
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
        borderBottomWidth: 0,
      },
      headerTintColor: COLORS.accent,
      headerTitleStyle: FONTS.h3,
    }}
  >
    <Stack.Screen 
      name="HomeScreen" 
      component={HomeScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="MeasurementsScreen" 
      component={MeasurementsScreen} 
      options={{ 
        title: "Body Measurements",
        headerStyle: {
          backgroundColor: COLORS.secondary,
        }
      }}
    />
    <Stack.Screen 
      name="HabitsScreen" 
      component={HabitsScreen} 
      options={{ 
        title: "Habits",
        headerStyle: {
          backgroundColor: COLORS.secondary,
        }
      }}
    />
  </Stack.Navigator>
);

const WorkoutStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.secondary,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: COLORS.accent,
      headerTitleStyle: FONTS.h3,
    }}
  >
    <Stack.Screen 
      name="WorkoutsScreen" 
      component={WorkoutsScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="WorkoutDetailScreen" 
      component={WorkoutDetailScreen} 
      options={({ route }) => ({ 
        title: route.params?.name || "Workout Details",
        headerStyle: {
          backgroundColor: COLORS.secondary,
        }
      })}
    />
    <Stack.Screen 
      name="StartWorkoutScreen" 
      component={StartWorkoutScreen} 
      options={{ 
        title: "Start Workout",
        headerStyle: {
          backgroundColor: COLORS.secondary,
        }
      }}
    />
  </Stack.Navigator>
);

const MealStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.secondary,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: COLORS.accent,
      headerTitleStyle: FONTS.h3,
    }}
  >
    <Stack.Screen 
      name="MealsScreen" 
      component={MealsScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="MealDetailScreen" 
      component={MealDetailScreen} 
      options={({ route }) => ({ 
        title: route.params?.name || "Meal Details",
        headerStyle: {
          backgroundColor: COLORS.secondary,
        }
      })}
    />
  </Stack.Navigator>
);

const ProgressStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.secondary,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: COLORS.accent,
      headerTitleStyle: FONTS.h3,
    }}
  >
    <Stack.Screen 
      name="ProgressScreen" 
      component={ProgressScreen} 
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.secondary,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: COLORS.accent,
      headerTitleStyle: FONTS.h3,
    }}
  >
    <Stack.Screen 
      name="ProfileScreen" 
      component={ProfileScreen} 
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.secondary,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLightGrey,
        tabBarLabelStyle: {
          ...FONTS.caption,
          marginTop: -5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Meals" 
        component={MealStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="coffee" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;