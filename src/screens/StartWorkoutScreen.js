import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput,
  Animated
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const StartWorkoutScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { workouts, completeWorkout } = useAppContext();
  
  // Find workout by id
  const workout = workouts.find(w => w.id === id);
  
  // State
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [exerciseResults, setExerciseResults] = useState([]);
  const [isInputModalVisible, setInputModalVisible] = useState(false);
  const [currentInput, setCurrentInput] = useState({
    reps: '',
    weight: ''
  });
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Timer interval
  const timerInterval = useRef(null);
  
  // Exercise flatlist ref
  const exerciseListRef = useRef(null);
  
  // Initialize exercise results
  useEffect(() => {
    if (workout && exerciseResults.length === 0) {
      setExerciseResults(
        workout.exercises.map(exercise => ({
          ...exercise,
          completedSets: Array(exercise.sets).fill({
            reps: exercise.reps || 0,
            weight: exercise.weight || 0
          })
        }))
      );
    }
    
    // Run entrance animations
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
  }, [workout]);
  
  // Start/stop timer
  useEffect(() => {
    if (isRunning) {
      timerInterval.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }
    
    return () => clearInterval(timerInterval.current);
  }, [isRunning]);
  
  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // If workout not found
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
  
  // Current exercise
  const currentExercise = workout.exercises[currentExerciseIndex];
  
  // Handle exercise completion
  const completeExercise = () => {
    // Mark exercise as completed
    setCompletedExercises([...completedExercises, currentExerciseIndex]);
    
    // Move to next exercise if available
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      
      // Scroll to next exercise
      if (exerciseListRef.current) {
        exerciseListRef.current.scrollToIndex({
          index: currentExerciseIndex + 1,
          animated: true
        });
      }
    } else {
      // All exercises completed
      Alert.alert(
        "Workout Completed",
        "Great job! You've completed all exercises.",
        [
          {
            text: "Finish Workout",
            onPress: finishWorkout
          }
        ]
      );
    }
  };
  
  // Handle finish workout
  const finishWorkout = () => {
    // Stop timer
    setIsRunning(false);
    
    // Complete workout in context
    completeWorkout(id, new Date(), exerciseResults);
    
    // Navigate back to workouts screen
    navigation.navigate('WorkoutsScreen', { completed: true });
  };
  
  // Handle exercise input
  const openInputModal = () => {
    // Pre-populate with current values
    const currentResult = exerciseResults[currentExerciseIndex];
    setCurrentInput({
      reps: currentResult.reps ? currentResult.reps.toString() : '',
      weight: currentResult.weight ? currentResult.weight.toString() : ''
    });
    
    setInputModalVisible(true);
  };
  
  // Save exercise input
  const saveExerciseInput = () => {
    // Update exercise results
    const updatedResults = [...exerciseResults];
    updatedResults[currentExerciseIndex] = {
      ...updatedResults[currentExerciseIndex],
      reps: parseInt(currentInput.reps) || updatedResults[currentExerciseIndex].reps,
      weight: parseInt(currentInput.weight) || updatedResults[currentExerciseIndex].weight
    };
    
    setExerciseResults(updatedResults);
    setInputModalVisible(false);
  };
  
  // Render exercise status (completed/current/upcoming)
  const getExerciseStatus = (index) => {
    if (completedExercises.includes(index)) {
      return 'completed';
    } else if (index === currentExerciseIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };
  
  // Render exercise item in list
  const renderExerciseItem = ({ item, index }) => {
    const status = getExerciseStatus(index);
    
    return (
      <Animated.View
        style={[
          styles.exerciseCard,
          status === 'completed' && styles.completedExerciseCard,
          status === 'current' && styles.currentExerciseCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(index * 0.5 + 1)) }]
          }
        ]}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseNameContainer}>
            <View style={[
              styles.exerciseIndexCircle,
              status === 'completed' && styles.completedIndexCircle,
              status === 'current' && styles.currentIndexCircle
            ]}>
              {status === 'completed' ? (
                <Feather name="check" size={14} color={COLORS.accent} />
              ) : (
                <Text style={[
                  styles.exerciseIndexText,
                  status === 'current' && styles.currentIndexText
                ]}>
                  {index + 1}
                </Text>
              )}
            </View>
            <Text style={[
              styles.exerciseName,
              status === 'completed' && styles.completedExerciseName,
              status === 'current' && styles.currentExerciseName
            ]}>
              {item.name}
            </Text>
          </View>
          
          {status === 'current' && (
            <TouchableOpacity 
              style={styles.inputButton}
              onPress={openInputModal}
            >
              <Feather name="edit-2" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.exerciseDetails}>
          {item.sets && (
            <View style={styles.exerciseDetailItem}>
              <MaterialCommunityIcons 
                name="repeat" 
                size={16} 
                color={status === 'current' ? COLORS.primary : COLORS.textGrey} 
              />
              <Text style={[
                styles.exerciseDetailText,
                status === 'current' && styles.currentDetailText
              ]}>
                {item.sets} sets
              </Text>
            </View>
          )}
          
          {item.reps && (
            <View style={styles.exerciseDetailItem}>
              <MaterialCommunityIcons 
                name="counter" 
                size={16} 
                color={status === 'current' ? COLORS.primary : COLORS.textGrey} 
              />
              <Text style={[
                styles.exerciseDetailText,
                status === 'current' && styles.currentDetailText
              ]}>
                {item.reps} reps
              </Text>
            </View>
          )}
          
          {item.duration && (
            <View style={styles.exerciseDetailItem}>
              <Feather 
                name="clock" 
                size={16} 
                color={status === 'current' ? COLORS.primary : COLORS.textGrey} 
              />
              <Text style={[
                styles.exerciseDetailText,
                status === 'current' && styles.currentDetailText
              ]}>
                {item.duration}
              </Text>
            </View>
          )}
          
          {item.weight > 0 && (
            <View style={styles.exerciseDetailItem}>
              <FontAwesome5 
                name="weight" 
                size={14} 
                color={status === 'current' ? COLORS.primary : COLORS.textGrey} 
              />
              <Text style={[
                styles.exerciseDetailText,
                status === 'current' && styles.currentDetailText
              ]}>
                {item.weight} kg
              </Text>
            </View>
          )}
        </View>
        
        {status === 'current' && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={completeExercise}
          >
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Timer and Controls */}
      <View style={styles.timerContainer}>
        <View style={styles.timerWrapper}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          <Text style={styles.timerLabel}>Workout Time</Text>
        </View>
        
        <View style={styles.timerControls}>
          <TouchableOpacity 
            style={[
              styles.timerButton,
              isRunning ? styles.pauseButton : styles.startTimerButton
            ]}
            onPress={() => setIsRunning(!isRunning)}
          >
            <Feather 
              name={isRunning ? "pause" : "play"} 
              size={20} 
              color={isRunning ? COLORS.accent : COLORS.primary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.timerButton}
            onPress={() => setTimer(0)}
          >
            <Feather name="refresh-ccw" size={20} color={COLORS.textGrey} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Workout Title */}
      <View style={styles.workoutTitleContainer}>
        <Text style={styles.workoutTitle}>{workout.name}</Text>
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${(completedExercises.length / workout.exercises.length) * 100}%` }
            ]}
          />
          <Text style={styles.progressText}>
            {completedExercises.length}/{workout.exercises.length}
          </Text>
        </View>
      </View>
      
      {/* Current Exercise */}
      <View style={styles.currentExerciseContainer}>
        <Text style={styles.currentExerciseLabel}>
          {completedExercises.length === workout.exercises.length 
            ? "All Exercises Completed!" 
            : "Current Exercise"}
        </Text>
        <Text style={styles.currentExerciseName}>
          {completedExercises.length === workout.exercises.length 
            ? "Great job!" 
            : currentExercise.name}
        </Text>
      </View>
      
      {/* Exercise List */}
      <FlatList
        ref={exerciseListRef}
        data={workout.exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item, index) => `exercise-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.exerciseList}
        initialScrollIndex={0}
        onScrollToIndexFailed={() => {}}
      />
      
      {/* Finish Workout Button */}
      <View style={styles.finishButtonContainer}>
        <TouchableOpacity 
          style={styles.finishButton}
          onPress={() => 
            Alert.alert(
              "Finish Workout?",
              "Are you sure you want to finish this workout?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Finish",
                  onPress: finishWorkout
                }
              ]
            )
          }
        >
          <Text style={styles.finishButtonText}>Finish Workout</Text>
        </TouchableOpacity>
      </View>
      
      {/* Input Modal */}
      <Modal
        visible={isInputModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInputModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Update {currentExercise?.name || 'Exercise'}
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Reps</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={currentInput.reps}
                onChangeText={(text) => setCurrentInput({...currentInput, reps: text})}
                placeholder="Enter reps"
                placeholderTextColor={COLORS.textGrey}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={currentInput.weight}
                onChangeText={(text) => setCurrentInput({...currentInput, weight: text})}
                placeholder="Enter weight"
                placeholderTextColor={COLORS.textGrey}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setInputModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveExerciseInput}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    backgroundColor: COLORS.secondary,
  },
  timerWrapper: {
    alignItems: 'flex-start',
  },
  timerText: {
    ...FONTS.h2,
    color: COLORS.accent,
  },
  timerLabel: {
    ...FONTS.body3,
    color: COLORS.textGrey,
  },
  timerControls: {
    flexDirection: 'row',
  },
  timerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.base,
  },
  startTimerButton: {
    backgroundColor: COLORS.transparentWhite,
  },
  pauseButton: {
    backgroundColor: COLORS.primary,
  },
  workoutTitleContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    backgroundColor: COLORS.secondary,
  },
  workoutTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.base,
  },
  progressContainer: {
    height: 10,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    position: 'absolute',
    right: 5,
    top: -1,
  },
  currentExerciseContainer: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  currentExerciseLabel: {
    ...FONTS.body3,
    color: COLORS.textGrey,
  },
  currentExerciseName: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  exerciseList: {
    padding: SIZES.padding,
    paddingBottom: 80,
  },
  exerciseCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    ...SHADOWS.light,
  },
  completedExerciseCard: {
    opacity: 0.7,
  },
  currentExerciseCard: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: COLORS.cardLight,
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base,
  },
  completedIndexCircle: {
    backgroundColor: COLORS.success,
  },
  currentIndexCircle: {
    backgroundColor: COLORS.primary,
  },
  exerciseIndexText: {
    ...FONTS.body4,
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.textLight,
  },
  currentIndexText: {
    color: COLORS.accent,
  },
  exerciseName: {
    ...FONTS.h4,
    color: COLORS.textLight,
  },
  completedExerciseName: {
    color: COLORS.textGrey,
  },
  currentExerciseName: {
    color: COLORS.accent,
  },
  inputButton: {
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
  currentDetailText: {
    color: COLORS.textLight,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius / 2,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    marginTop: SIZES.padding / 2,
  },
  completeButtonText: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
  finishButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    backgroundColor: COLORS.secondary,
  },
  finishButton: {
    backgroundColor: COLORS.success,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.base,
    alignItems: 'center',
  },
  finishButtonText: {
    ...FONTS.h4,
    color: COLORS.accent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.dark,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SIZES.padding,
  },
  inputLabel: {
    ...FONTS.body3,
    color: COLORS.textGrey,
    marginBottom: SIZES.base / 2,
  },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius / 2,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    color: COLORS.textLight,
    ...FONTS.body2,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius / 2,
    marginHorizontal: SIZES.base / 2,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  saveButtonText: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
});

export default StartWorkoutScreen;