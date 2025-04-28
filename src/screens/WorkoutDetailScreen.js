import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  FlatList
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const DIFFICULTY_COLORS = {
  'beginner': '#28C76F',
  'intermediate': '#FFAB00',
  'advanced': '#EA5455'
};

const WorkoutDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { workouts, completeWorkout } = useAppContext();
  
  // Find workout by id
  const workout = workouts.find(w => w.id === id);
  
  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Workout not found</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 200;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp'
  });
  
  const headerScale = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });
  
  // Render exercise item
  const renderExerciseItem = ({ item, index }) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseNameContainer}>
          <View style={styles.exerciseIndexCircle}>
            <Text style={styles.exerciseIndexText}>{index + 1}</Text>
          </View>
          <Text style={styles.exerciseName}>{item.name}</Text>
        </View>
        <TouchableOpacity style={styles.exerciseInfoButton}>
          <Feather name="info" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.exerciseDetails}>
        {item.sets && (
          <View style={styles.exerciseDetailItem}>
            <MaterialCommunityIcons name="repeat" size={16} color={COLORS.textGrey} />
            <Text style={styles.exerciseDetailText}>{item.sets} sets</Text>
          </View>
        )}
        
        {item.reps && (
          <View style={styles.exerciseDetailItem}>
            <MaterialCommunityIcons name="counter" size={16} color={COLORS.textGrey} />
            <Text style={styles.exerciseDetailText}>{item.reps} reps</Text>
          </View>
        )}
        
        {item.duration && (
          <View style={styles.exerciseDetailItem}>
            <Feather name="clock" size={16} color={COLORS.textGrey} />
            <Text style={styles.exerciseDetailText}>{item.duration}</Text>
          </View>
        )}
        
        {item.weight > 0 && (
          <View style={styles.exerciseDetailItem}>
            <FontAwesome5 name="weight" size={14} color={COLORS.textGrey} />
            <Text style={styles.exerciseDetailText}>{item.weight} kg</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [{ scale: headerScale }]
          }
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerInfo}>
              <View style={styles.badgesContainer}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {workout.category.charAt(0).toUpperCase() + workout.category.slice(1)}
                  </Text>
                </View>
                
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: DIFFICULTY_COLORS[workout.difficulty] }
                ]}>
                  <Text style={styles.difficultyText}>
                    {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.workoutName}>{workout.name}</Text>
              
              <View style={styles.workoutMetaContainer}>
                <View style={styles.workoutMetaItem}>
                  <Feather name="clock" size={16} color={COLORS.accent} />
                  <Text style={styles.workoutMetaText}>{workout.duration} min</Text>
                </View>
                
                <View style={styles.workoutMetaItem}>
                  <MaterialCommunityIcons name="fire" size={16} color={COLORS.accent} />
                  <Text style={styles.workoutMetaText}>{workout.calories} cal</Text>
                </View>
                
                <View style={styles.workoutMetaItem}>
                  <MaterialCommunityIcons name="dumbbell" size={16} color={COLORS.accent} />
                  <Text style={styles.workoutMetaText}>{workout.exercises.length} exercises</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.contentPadding} />
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          <FlatList
            data={workout.exercises}
            renderItem={renderExerciseItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.exercisesList}
          />
        </View>
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>
            Perform each exercise for the prescribed number of sets and reps, taking 60-90 seconds of rest between sets. 
            Focus on maintaining proper form throughout each movement.
          </Text>
        </View>
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips</Text>
          <View style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <Feather name="droplet" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.tipText}>Stay hydrated throughout your workout</Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <Feather name="heart" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.tipText}>Warm up properly before starting</Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <Feather name="check-circle" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.tipText}>Focus on correct form rather than speed</Text>
          </View>
        </View>
      </Animated.ScrollView>
      
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {/* Navigate to edit screen */}}
        >
          <Feather name="edit-2" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('StartWorkoutScreen', { id: workout.id })}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    ...FONTS.h3,
    color: COLORS.textLight,
    marginBottom: SIZES.padding,
  },
  errorButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
  },
  errorButtonText: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    justifyContent: 'flex-end',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  headerInfo: {
    flex: 1,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.base,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.transparentWhite,
    marginRight: SIZES.base,
  },
  categoryText: {
    ...FONTS.body4,
    color: COLORS.accent,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    ...FONTS.body4,
    color: COLORS.accent,
  },
  workoutName: {
    ...FONTS.h2,
    color: COLORS.accent,
    marginBottom: SIZES.base,
  },
  workoutMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  workoutMetaText: {
    ...FONTS.body3,
    color: COLORS.accent,
    marginLeft: 6,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  contentPadding: {
    height: 190,
  },
  sectionContainer: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.padding,
  },
  exercisesList: {
    
  },
  exerciseCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    ...SHADOWS.light,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  exerciseNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIndexCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base,
  },
  exerciseIndexText: {
    ...FONTS.body4,
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.accent,
  },
  exerciseName: {
    ...FONTS.h4,
    color: COLORS.accent,
  },
  exerciseInfoButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.base,
  },
  exerciseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
    marginBottom: SIZES.base / 2,
  },
  exerciseDetailText: {
    ...FONTS.body3,
    color: COLORS.textGrey,
    marginLeft: 6,
  },
  instructionsContainer: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  instructionsTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.base,
  },
  instructionsText: {
    ...FONTS.body3,
    color: COLORS.textGrey,
    lineHeight: 22,
  },
  tipsContainer: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  tipsTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.padding,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base,
  },
  tipText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    flex: 1,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    backgroundColor: COLORS.secondary,
  },
  editButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding,
  },
  startButton: {
    flex: 1,
    height: 46,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    ...FONTS.h4,
    color: COLORS.accent,
  },
});

export default WorkoutDetailScreen;