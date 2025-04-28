import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Image,
  Animated
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const MEAL_TYPES = [
  { id: 'all', name: 'All Meals' },
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'lunch', name: 'Lunch' },
  { id: 'dinner', name: 'Dinner' },
  { id: 'snack', name: 'Snacks' }
];

const MealsScreen = ({ navigation }) => {
  const { meals, consumedMeals, consumeMeal, dailyCalories } = useAppContext();
  
  const [selectedType, setSelectedType] = useState('all');
  const [filteredMeals, setFilteredMeals] = useState(meals);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayProtein, setTodayProtein] = useState(0);
  const [todayCarbs, setTodayCarbs] = useState(0);
  const [todayFat, setTodayFat] = useState(0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
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
  
  // Filter meals
  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredMeals(meals);
    } else {
      setFilteredMeals(meals.filter(meal => meal.category === selectedType));
    }
  }, [meals, selectedType]);
  
  // Calculate today's nutrition
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayMeals = consumedMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === today.getTime();
    });
    
    const calories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const protein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0);
    const carbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
    const fat = todayMeals.reduce((sum, meal) => sum + meal.fat, 0);
    
    setTodayCalories(calories);
    setTodayProtein(protein);
    setTodayCarbs(carbs);
    setTodayFat(fat);
  }, [consumedMeals]);
  
  // Render meal type
  const renderMealType = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.mealTypeItem,
        selectedType === item.id && styles.selectedMealTypeItem
      ]}
      onPress={() => setSelectedType(item.id)}
    >
      <Text style={[
        styles.mealTypeText,
        selectedType === item.id && styles.selectedMealTypeText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  // Render meal item
  const renderMealItem = ({ item, index }) => {
    // Protein, carbs, fat percentages
    const total = item.protein + item.carbs + item.fat;
    const proteinPercentage = Math.round((item.protein / total) * 100);
    const carbsPercentage = Math.round((item.carbs / total) * 100);
    const fatPercentage = Math.round((item.fat / total) * 100);
    
    return (
      <Animated.View
        style={[
          styles.mealCardContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(index * 0.5 + 1)) }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.mealCard}
          onPress={() => navigation.navigate('MealDetailScreen', { 
            id: item.id,
            name: item.name
          })}
          activeOpacity={0.8}
        >
          <View style={styles.mealCardHeader}>
            <View>
              <View style={styles.mealCategoryBadge}>
                <Text style={styles.mealCategoryText}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Text>
              </View>
              <Text style={styles.mealName}>{item.name}</Text>
            </View>
            <Text style={styles.mealCalories}>{item.calories} cal</Text>
          </View>
          
          <View style={styles.nutritionContainer}>
            <View style={styles.macroItem}>
              <View style={styles.macroIconContainer}>
                <MaterialCommunityIcons 
                  name="food-steak" 
                  size={16} 
                  color={COLORS.primary} 
                />
              </View>
              <View>
                <Text style={styles.macroValue}>{item.protein}g</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
            </View>
            
            <View style={styles.macroItem}>
              <View style={styles.macroIconContainer}>
                <MaterialCommunityIcons 
                  name="bread-slice" 
                  size={16} 
                  color={COLORS.primary} 
                />
              </View>
              <View>
                <Text style={styles.macroValue}>{item.carbs}g</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
            </View>
            
            <View style={styles.macroItem}>
              <View style={styles.macroIconContainer}>
                <FontAwesome5 
                  name="oil-can" 
                  size={14} 
                  color={COLORS.primary} 
                />
              </View>
              <View>
                <Text style={styles.macroValue}>{item.fat}g</Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.macroPercentageBar}>
            <View 
              style={[
                styles.percentageSegment, 
                { 
                  width: `${proteinPercentage}%`,
                  backgroundColor: '#FF6B00'
                }
              ]}
            />
            <View 
              style={[
                styles.percentageSegment, 
                { 
                  width: `${carbsPercentage}%`,
                  backgroundColor: '#28C76F'
                }
              ]}
            />
            <View 
              style={[
                styles.percentageSegment, 
                { 
                  width: `${fatPercentage}%`,
                  backgroundColor: '#FFAB00'
                }
              ]}
            />
          </View>
          
          <View style={styles.mealActions}>
            <TouchableOpacity 
              style={styles.viewRecipeButton}
              onPress={() => navigation.navigate('MealDetailScreen', { 
                id: item.id,
                name: item.name
              })}
            >
              <Text style={styles.viewRecipeText}>View Recipe</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logMealButton}
              onPress={() => {
                consumeMeal(item.id);
                // Show success feedback (could add Toast here)
              }}
            >
              <Text style={styles.logMealText}>Log Meal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nutrition</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Feather name="calendar" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
      
      {/* Daily Calories Summary */}
      <View style={styles.caloriesSummaryContainer}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.caloriesGradient}
        >
          <View style={styles.caloriesHeader}>
            <Text style={styles.caloriesTitle}>Today's Nutrition</Text>
            <View style={styles.remainingContainer}>
              <Text style={styles.remainingLabel}>Remaining</Text>
              <Text style={styles.remainingValue}>{dailyCalories - todayCalories} cal</Text>
            </View>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar,
                { width: `${Math.min((todayCalories / dailyCalories) * 100, 100)}%` }
              ]}
            />
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroCircle}>
              <Text style={styles.macroCircleValue}>{todayProtein}g</Text>
              <Text style={styles.macroCircleLabel}>Protein</Text>
            </View>
            
            <View style={styles.macroCircle}>
              <Text style={styles.macroCircleValue}>{todayCarbs}g</Text>
              <Text style={styles.macroCircleLabel}>Carbs</Text>
            </View>
            
            <View style={styles.macroCircle}>
              <Text style={styles.macroCircleValue}>{todayFat}g</Text>
              <Text style={styles.macroCircleLabel}>Fat</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      
      {/* Meal Types Filter */}
      <View style={styles.mealTypesContainer}>
        <FlatList
          data={MEAL_TYPES}
          renderItem={renderMealType}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mealTypesList}
        />
      </View>
      
      {/* Meals List */}
      {filteredMeals.length > 0 ? (
        <FlatList
          data={filteredMeals}
          renderItem={renderMealItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mealsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="food-apple" size={60} color={COLORS.textGrey} />
          <Text style={styles.emptyText}>No meals found</Text>
          <Text style={styles.emptySubtext}>Try changing the filter or add a new meal</Text>
          
          <TouchableOpacity style={styles.addMealButton}>
            <Text style={styles.addMealText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Floating action button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fabGradient}
        >
          <Feather name="plus" size={24} color={COLORS.accent} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.secondary,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.accent,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesSummaryContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.secondary,
  },
  caloriesGradient: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.medium,
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
  remainingContainer: {
    alignItems: 'flex-end',
  },
  remainingLabel: {
    ...FONTS.body4,
    color: COLORS.accentDark,
  },
  remainingValue: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 5,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroCircleValue: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  macroCircleLabel: {
    ...FONTS.body4,
    color: COLORS.accentDark,
  },
  mealTypesContainer: {
    backgroundColor: COLORS.secondary,
    paddingBottom: SIZES.padding,
  },
  mealTypesList: {
    paddingHorizontal: SIZES.padding,
  },
  mealTypeItem: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    marginRight: SIZES.base,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.backgroundLight,
  },
  selectedMealTypeItem: {
    backgroundColor: COLORS.primary,
  },
  mealTypeText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  selectedMealTypeText: {
    color: COLORS.accent,
    fontFamily: 'Poppins_500Medium',
  },
  mealsList: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  mealCardContainer: {
    marginBottom: SIZES.padding,
  },
  mealCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.medium,
  },
  mealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding / 2,
  },
  mealCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    marginBottom: SIZES.base / 2,
  },
  mealCategoryText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  mealName: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  mealCalories: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.padding / 2,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base / 2,
  },
  macroValue: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  macroLabel: {
    ...FONTS.body4,
    color: COLORS.textGrey,
  },
  macroPercentageBar: {
    height: 6,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SIZES.padding,
  },
  percentageSegment: {
    height: '100%',
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewRecipeButton: {
    flex: 1,
    marginRight: SIZES.base,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius / 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  viewRecipeText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  logMealButton: {
    flex: 1,
    marginLeft: SIZES.base,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.primary,
  },
  logMealText: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  emptyText: {
    ...FONTS.h3,
    color: COLORS.textLight,
    marginTop: SIZES.padding,
  },
  emptySubtext: {
    ...FONTS.body3,
    color: COLORS.textGrey,
    textAlign: 'center',
    marginTop: SIZES.base,
    marginBottom: SIZES.padding,
  },
  addMealButton: {
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    marginTop: SIZES.padding,
  },
  addMealText: {
    ...FONTS.body2,
    color: COLORS.accent,
  },
  fab: {
    position: 'absolute',
    bottom: SIZES.padding,
    right: SIZES.padding,
    ...SHADOWS.dark,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MealsScreen;