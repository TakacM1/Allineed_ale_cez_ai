import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const AppContext = createContext();

// Sample initial data
const initialWorkouts = [
  {
    id: '1',
    name: 'Full Body Blast',
    category: 'strength',
    duration: 45,
    difficulty: 'intermediate',
    calories: 350,
    exercises: [
      { id: 'e1', name: 'Push-ups', sets: 3, reps: 15, weight: 0 },
      { id: 'e2', name: 'Squats', sets: 4, reps: 12, weight: 0 },
      { id: 'e3', name: 'Deadlifts', sets: 3, reps: 10, weight: 50 },
      { id: 'e4', name: 'Plank', sets: 3, duration: '45s', weight: 0 },
    ]
  },
  {
    id: '2',
    name: 'HIIT Cardio',
    category: 'cardio',
    duration: 30,
    difficulty: 'advanced',
    calories: 400,
    exercises: [
      { id: 'e5', name: 'Burpees', sets: 3, reps: 15, weight: 0 },
      { id: 'e6', name: 'Mountain Climbers', sets: 3, duration: '45s', weight: 0 },
      { id: 'e7', name: 'Jump Rope', sets: 3, duration: '1m', weight: 0 },
      { id: 'e8', name: 'High Knees', sets: 3, duration: '45s', weight: 0 },
    ]
  },
  {
    id: '3',
    name: 'Core Crusher',
    category: 'core',
    duration: 20,
    difficulty: 'beginner',
    calories: 200,
    exercises: [
      { id: 'e9', name: 'Crunches', sets: 3, reps: 20, weight: 0 },
      { id: 'e10', name: 'Russian Twists', sets: 3, reps: 16, weight: 5 },
      { id: 'e11', name: 'Leg Raises', sets: 3, reps: 12, weight: 0 },
      { id: 'e12', name: 'Bicycle Crunches', sets: 3, reps: 20, weight: 0 },
    ]
  }
];

const initialMeals = [
  {
    id: '1',
    name: 'Protein Breakfast',
    category: 'breakfast',
    calories: 450,
    protein: 35,
    carbs: 30,
    fat: 15,
    ingredients: [
      '3 egg whites',
      '1 whole egg',
      '1/2 cup oatmeal',
      '1 banana',
      '1 tbsp peanut butter'
    ]
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    category: 'lunch',
    calories: 380,
    protein: 40,
    carbs: 15,
    fat: 12,
    ingredients: [
      '150g grilled chicken breast',
      '2 cups mixed greens',
      '1/4 avocado',
      '1 tbsp olive oil',
      '1 tbsp balsamic vinegar'
    ]
  },
  {
    id: '3',
    name: 'Post-Workout Shake',
    category: 'snack',
    calories: 250,
    protein: 30,
    carbs: 25,
    fat: 5,
    ingredients: [
      '1 scoop whey protein',
      '1 banana',
      '1 cup almond milk',
      '1 tbsp honey'
    ]
  }
];

const initialMeasurements = {
  weight: [],
  bodyFat: [],
  chest: [],
  waist: [],
  hips: [],
  arms: [],
  thighs: [],
};

const initialHabits = [
  { id: '1', name: 'Morning Workout', target: 5, completed: [false, true, true, false, false, false, false] },
  { id: '2', name: 'Drink 8 glasses of water', target: 7, completed: [true, true, true, true, false, false, false] },
  { id: '3', name: 'Take vitamins', target: 7, completed: [true, true, true, true, true, false, false] },
];

// Provider component
export const AppProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [meals, setMeals] = useState(initialMeals);
  const [consumedMeals, setConsumedMeals] = useState([]);
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [habits, setHabits] = useState(initialHabits);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [user, setUser] = useState({
    name: 'Alex',
    goal: 'Build Muscle',
    weight: 75,
    height: 180,
    age: 28
  });

  // Load data from AsyncStorage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedWorkouts = await AsyncStorage.getItem('workouts');
        if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts));
        
        const storedCompletedWorkouts = await AsyncStorage.getItem('completedWorkouts');
        if (storedCompletedWorkouts) setCompletedWorkouts(JSON.parse(storedCompletedWorkouts));
        
        const storedMeals = await AsyncStorage.getItem('meals');
        if (storedMeals) setMeals(JSON.parse(storedMeals));
        
        const storedConsumedMeals = await AsyncStorage.getItem('consumedMeals');
        if (storedConsumedMeals) setConsumedMeals(JSON.parse(storedConsumedMeals));
        
        const storedMeasurements = await AsyncStorage.getItem('measurements');
        if (storedMeasurements) setMeasurements(JSON.parse(storedMeasurements));
        
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) setHabits(JSON.parse(storedHabits));
        
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        
        const storedDailyCalories = await AsyncStorage.getItem('dailyCalories');
        if (storedDailyCalories) setDailyCalories(JSON.parse(storedDailyCalories));
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save data to AsyncStorage when changed
  const saveData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to AsyncStorage:`, error);
    }
  };

  // Save changes to AsyncStorage
  useEffect(() => {
    saveData('workouts', workouts);
  }, [workouts]);

  useEffect(() => {
    saveData('completedWorkouts', completedWorkouts);
  }, [completedWorkouts]);

  useEffect(() => {
    saveData('meals', meals);
  }, [meals]);

  useEffect(() => {
    saveData('consumedMeals', consumedMeals);
  }, [consumedMeals]);

  useEffect(() => {
    saveData('measurements', measurements);
  }, [measurements]);

  useEffect(() => {
    saveData('habits', habits);
  }, [habits]);

  useEffect(() => {
    saveData('user', user);
  }, [user]);

  useEffect(() => {
    saveData('dailyCalories', dailyCalories);
  }, [dailyCalories]);

  // Workout functions
  const addWorkout = (workout) => {
    const newWorkout = { ...workout, id: Date.now().toString() };
    setWorkouts([...workouts, newWorkout]);
  };

  const updateWorkout = (updatedWorkout) => {
    setWorkouts(workouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
  };

  const deleteWorkout = (workoutId) => {
    setWorkouts(workouts.filter(w => w.id !== workoutId));
  };

  const completeWorkout = (workoutId, date = new Date(), exerciseResults = []) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const completedWorkout = {
      id: Date.now().toString(),
      workoutId,
      workoutName: workout.name,
      date: date.toISOString(),
      duration: workout.duration,
      calories: workout.calories,
      exercises: exerciseResults.length > 0 ? exerciseResults : workout.exercises
    };

    setCompletedWorkouts([...completedWorkouts, completedWorkout]);
  };

  // Meal functions
  const addMeal = (meal) => {
    const newMeal = { ...meal, id: Date.now().toString() };
    setMeals([...meals, newMeal]);
  };

  const updateMeal = (updatedMeal) => {
    setMeals(meals.map(m => m.id === updatedMeal.id ? updatedMeal : m));
  };

  const deleteMeal = (mealId) => {
    setMeals(meals.filter(m => m.id !== mealId));
  };

  const consumeMeal = (mealId, date = new Date(), quantity = 1) => {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;

    const consumedMeal = {
      id: Date.now().toString(),
      mealId,
      mealName: meal.name,
      date: date.toISOString(),
      calories: meal.calories * quantity,
      protein: meal.protein * quantity,
      carbs: meal.carbs * quantity,
      fat: meal.fat * quantity,
      quantity
    };

    setConsumedMeals([...consumedMeals, consumedMeal]);
  };

  // Measurement functions
  const addMeasurement = (type, value, date = new Date()) => {
    if (!measurements[type]) return;

    const newMeasurement = {
      id: Date.now().toString(),
      value,
      date: date.toISOString()
    };

    setMeasurements({
      ...measurements,
      [type]: [...measurements[type], newMeasurement]
    });
  };

  // Habit functions
  const addHabit = (habit) => {
    const newHabit = { 
      ...habit, 
      id: Date.now().toString(),
      completed: [false, false, false, false, false, false, false] 
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (habitId, dayIndex, completed) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const newCompleted = [...h.completed];
        newCompleted[dayIndex] = completed;
        return { ...h, completed: newCompleted };
      }
      return h;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(h => h.id !== habitId));
  };

  // User functions
  const updateUser = (updatedUser) => {
    setUser({ ...user, ...updatedUser });
  };

  const updateDailyCalories = (calories) => {
    setDailyCalories(calories);
  };

  return (
    <AppContext.Provider value={{
      workouts,
      completedWorkouts,
      meals,
      consumedMeals,
      measurements,
      habits,
      user,
      dailyCalories,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      completeWorkout,
      addMeal,
      updateMeal,
      deleteMeal,
      consumeMeal,
      addMeasurement,
      addHabit,
      updateHabit,
      deleteHabit,
      updateUser,
      updateDailyCalories
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};