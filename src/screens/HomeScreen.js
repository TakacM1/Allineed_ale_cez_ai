import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { 
    user,
    workouts,
    completedWorkouts,
    habits,
    consumedMeals,
    dailyCalories
  } = useAppContext();

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // Current date
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Calculate weekly stats
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const workoutsThisWeek = completedWorkouts.filter(workout => 
    new Date(workout.date) >= startOfWeek
  );
  
  const caloriesBurned = workoutsThisWeek.reduce((total, workout) => 
    total + workout.calories, 0
  );
  
  // Calculate today's calories consumed
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const todayMeals = consumedMeals.filter(meal => 
    new Date(meal.date) >= startOfDay
  );
  
  const caloriesConsumed = todayMeals.reduce((total, meal) => 
    total + meal.calories, 0
  );
  
  // Calculate remaining calories for today
  const remainingCalories = dailyCalories - caloriesConsumed;
  
  // Suggested workouts (show first 3 workouts for simplicity)
  const suggestedWorkouts = workouts.slice(0, 3);
  
  // Run entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Format date for header
  const formatDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey, {user.name}! 👋</Text>
          <Text style={styles.date}>{formatDate()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Feather name="user" size={24} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calories Summary */}
        <Animated.View 
          style={[
            styles.caloriesSummary,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.caloriesGradient}
          >
            <View style={styles.caloriesHeader}>
              <Text style={styles.caloriesTitle}>Today's Calories</Text>
              <MaterialCommunityIcons name="fire" size={24} color={COLORS.accent} />
            </View>
            
            <View style={styles.caloriesContent}>
              <View style={styles.caloriesItem}>
                <Text style={styles.caloriesValue}>{dailyCalories}</Text>
                <Text style={styles.caloriesLabel}>Goal</Text>
              </View>
              
              <View style={styles.caloriesDivider} />
              
              <View style={styles.caloriesItem}>
                <Text style={styles.caloriesValue}>{caloriesConsumed}</Text>
                <Text style={styles.caloriesLabel}>Food</Text>
              </View>
              
              <View style={styles.caloriesDivider} />
              
              <View style={styles.caloriesItem}>
                <Text style={styles.caloriesValue}>{caloriesBurned}</Text>
                <Text style={styles.caloriesLabel}>Exercise</Text>
              </View>
              
              <View style={styles.caloriesDivider} />
              
              <View style={styles.caloriesItem}>
                <Text style={[
                  styles.caloriesValue,
                  remainingCalories < 0 ? styles.negativeCalories : null
                ]}>
                  {remainingCalories}
                </Text>
                <Text style={styles.caloriesLabel}>Remaining</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* Habits Tracker */}
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => navigation.navigate('HabitsScreen')}
        >
          <Text style={styles.sectionTitle}>Daily Habits</Text>
          <Feather name="chevron-right" size={20} color={COLORS.textGrey} />
        </TouchableOpacity>
        
        <View style={styles.habitsContainer}>
          {habits.map((habit, index) => (
            <TouchableOpacity 
              key={habit.id}
              style={styles.habitCard}
              onPress={() => navigation.navigate('HabitsScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.habitIconContainer}>
                <MaterialCommunityIcons 
                  name={
                    habit.name.includes('water') ? 'water' :
                    habit.name.includes('vitamin') ? 'pill' :
                    habit.name.includes('workout') ? 'dumbbell' : 'checkbox-marked-circle-outline'
                  } 
                  size={24} 
                  color={habit.completed[dayOfWeek] ? COLORS.primary : COLORS.textGrey} 
                />
              </View>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <View style={styles.habitProgress}>
                  <View style={styles.habitDaysContainer}>
                    {habit.completed.map((done, idx) => (
                      <View 
                        key={idx} 
                        style={[
                          styles.habitDay, 
                          { backgroundColor: done ? COLORS.primary : 'transparent' }
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.habitTarget}>
                    {habit.completed.filter(Boolean).length}/{habit.target} days
                  </Text>
                </View>
              </View>
              <View style={[
                styles.habitStatus,
                { backgroundColor: habit.completed[dayOfWeek] ? COLORS.primary : COLORS.backgroundLight }
              ]}>
                <Text style={[
                  styles.habitStatusText,
                  { color: habit.completed[dayOfWeek] ? COLORS.accent : COLORS.textGrey }
                ]}>
                  {habit.completed[dayOfWeek] ? 'Done' : 'Todo'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={styles.addHabitButton}
            onPress={() => navigation.navigate('HabitsScreen')}
          >
            <Feather name="plus" size={20} color={COLORS.textLight} />
            <Text style={styles.addHabitText}>Add New Habit</Text>
          </TouchableOpacity>
        </View>
        
        {/* Body Measurements */}
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => navigation.navigate('MeasurementsScreen')}
        >
          <Text style={styles.sectionTitle}>Body Measurements</Text>
          <Feather name="chevron-right" size={20} color={COLORS.textGrey} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.measurementsCard}
          onPress={() => navigation.navigate('MeasurementsScreen')}
          activeOpacity={0.7}
        >
          <View style={styles.measurementRow}>
            <View style={styles.measurementItem}>
              <View style={styles.measurementIconContainer}>
                <FontAwesome5 name="weight" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.measurementTextContainer}>
                <Text style={styles.measurementValue}>{user.weight} kg</Text>
                <Text style={styles.measurementLabel}>Weight</Text>
              </View>
            </View>
            
            <View style={styles.measurementDivider} />
            
            <View style={styles.measurementItem}>
              <View style={styles.measurementIconContainer}>
                <MaterialCommunityIcons name="human-male-height" size={22} color={COLORS.primary} />
              </View>
              <View style={styles.measurementTextContainer}>
                <Text style={styles.measurementValue}>{user.height} cm</Text>
                <Text style={styles.measurementLabel}>Height</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.updateMeasurementsButton}>
            <Text style={styles.updateMeasurementsText}>Update Measurements</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        
        {/* Suggested Workouts */}
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => navigation.navigate('Workouts')}
        >
          <Text style={styles.sectionTitle}>Suggested # Workouts</Text>
          <Feather name="chevron-right" size={20} color={COLORS.textGrey} />
        </TouchableOpacity>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workoutsContainer}
        >
          {suggestedWorkouts.map((workout) => (
            <TouchableOpacity 
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => navigation.navigate('WorkoutDetailScreen', { 
                id: workout.id,
                name: workout.name 
              })}
              activeOpacity={0.7}
            >
              <View style={styles.workoutCategoryBadge}>
                <Text style={styles.workoutCategoryText}>
                  {workout.category.charAt(0).toUpperCase() + workout.category.slice(1)}
                </Text>
              </View>
              
              <Text style={styles.workoutName}>{workout.name}</Text>
              
              <View style={styles.workoutMetaRow}>
                <View style={styles.workoutMetaItem}>
                  <Feather name="clock" size={14} color={COLORS.textGrey} />
                  <Text style={styles.workoutMetaText}>{workout.duration} min</Text>
                </View>
                
                <View style={styles.workoutMetaItem}>
                  <MaterialCommunityIcons name="fire" size={14} color={COLORS.textGrey} />
                  <Text style={styles.workoutMetaText}>{workout.calories} cal</Text>
                </View>
                
                <View style={styles.workoutMetaItem}>
                  <Feather name="activity" size={14} color={COLORS.textGrey} />
                  <Text style={styles.workoutMetaText}>{workout.difficulty}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => navigation.navigate('StartWorkoutScreen', { id: workout.id })}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={styles.browseMoreCard}
            onPress={() => navigation.navigate('Workouts')}
          >
            <Feather name="grid" size={24} color={COLORS.primary} />
            <Text style={styles.browseMoreText}>Browse All Workouts</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding / 2,
    backgroundColor: COLORS.secondary,
  },
  greeting: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  date: {
    ...FONTS.body3,
    color: COLORS.textLightGrey,
    marginTop: SIZES.base / 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesSummary: {
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.medium
  },
  caloriesGradient: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  caloriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  caloriesTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  caloriesContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caloriesItem: {
    flex: 1,
    alignItems: 'center',
  },
  caloriesValue: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  negativeCalories: {
    color: COLORS.error,
  },
  caloriesLabel: {
    ...FONTS.body4,
    color: COLORS.accentDark,
    marginTop: SIZES.base / 2,
  },
  caloriesDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding / 2,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  habitsContainer: {
    paddingHorizontal: SIZES.padding,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card,
    ...SHADOWS.light,
  },
  habitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding / 2,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...FONTS.h4,
    color: COLORS.accent,
    marginBottom: 4,
  },
  habitProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitDaysContainer: {
    flexDirection: 'row',
    marginRight: SIZES.base,
  },
  habitDay: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 4,
  },
  habitTarget: {
    ...FONTS.body4,
    color: COLORS.textGrey,
  },
  habitStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: SIZES.base,
  },
  habitStatusText: {
    ...FONTS.body4,
    fontFamily: 'Poppins_500Medium',
  },
  addHabitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1,
    borderColor: COLORS.transparentWhite,
    borderStyle: 'dashed',
  },
  addHabitText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginLeft: SIZES.base,
  },
  measurementsCard: {
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card,
    ...SHADOWS.light,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.padding,
  },
  measurementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base,
  },
  measurementTextContainer: {
    alignItems: 'flex-start',
  },
  measurementValue: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  measurementLabel: {
    ...FONTS.body4,
    color: COLORS.textGrey,
  },
  measurementDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.transparentWhite,
  },
  updateMeasurementsButton: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius / 2,
    paddingVertical: SIZES.base,
    alignItems: 'center',
  },
  updateMeasurementsText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  workoutsContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  workoutCard: {
    width: width * 0.2,
    padding: SIZES.padding,
    marginRight: SIZES.padding, 
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card, // backgroundColor: COLORS.card
    ...SHADOWS.light,
  },
  workoutCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundLight,
    marginBottom: SIZES.base,
  },
  workoutCategoryText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  workoutName: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.base,
  },
  workoutMetaRow: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  workoutMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  workoutMetaText: {
    ...FONTS.body4,
    color: COLORS.textGrey,
    marginLeft: 4,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius / 2,
    paddingVertical: SIZES.base,
    alignItems: 'center',
  },
  startButtonText: {
    ...FONTS.body3,
    fontFamily: 'Poppins_500Medium',
    color: COLORS.accent,
  },
  browseMoreCard: {
    width: width * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card,
    ...SHADOWS.light,
  },
  browseMoreText: {
    ...FONTS.body3,
    color: COLORS.accent,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
});

export default HomeScreen;