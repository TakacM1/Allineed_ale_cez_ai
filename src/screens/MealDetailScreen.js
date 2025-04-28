import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Animated
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const MealDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { meals, consumeMeal } = useAppContext();
  
  // Find meal by id
  const meal = meals.find(m => m.id === id);
  
  if (!meal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Meal not found</Text>
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
  const headerHeight = 250;
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

  // Calculate macros percentages
  const totalMacros = meal.protein + meal.carbs + meal.fat;
  const proteinPercentage = Math.round((meal.protein / totalMacros) * 100);
  const carbsPercentage = Math.round((meal.carbs / totalMacros) * 100);
  const fatPercentage = Math.round((meal.fat / totalMacros) * 100);
  
  // Render ingredient item
  const renderIngredientItem = ({ item }) => (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientBullet} />
      <Text style={styles.ingredientText}>{item}</Text>
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
              <View style={styles.mealCategoryBadge}>
                <Text style={styles.mealCategoryText}>
                  {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
                </Text>
              </View>
              
              <Text style={styles.mealName}>{meal.name}</Text>
              
              <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                  <MaterialCommunityIcons name="fire" size={16} color={COLORS.accent} />
                  <Text style={styles.macroText}>{meal.calories} cal</Text>
                </View>
                
                <View style={styles.macroItem}>
                  <MaterialCommunityIcons name="food-steak" size={16} color={COLORS.accent} />
                  <Text style={styles.macroText}>{meal.protein}g protein</Text>
                </View>
                
                <View style={styles.macroItem}>
                  <MaterialCommunityIcons name="bread-slice" size={16} color={COLORS.accent} />
                  <Text style={styles.macroText}>{meal.carbs}g carbs</Text>
                </View>
                
                <View style={styles.macroItem}>
                  <FontAwesome5 name="oil-can" size={14} color={COLORS.accent} />
                  <Text style={styles.macroText}>{meal.fat}g fat</Text>
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
        
        <View style={styles.macroCirclesContainer}>
          <View style={styles.macroCircleWrapper}>
            <View style={styles.macroCircle}>
              <Text style={styles.macroCircleValue}>{proteinPercentage}%</Text>
            </View>
            <Text style={styles.macroCircleLabel}>Protein</Text>
          </View>
          
          <View style={styles.macroCircleWrapper}>
            <View style={styles.macroCircle}>
              <Text style={styles.macroCircleValue}>{carbsPercentage}%</Text>
            </View>
            <Text style={styles.macroCircleLabel}>Carbs</Text>
          </View>
          
          <View style={styles.macroCircleWrapper}>
            <View style={styles.macroCircle}>
              <Text style={styles.macroCircleValue}>{fatPercentage}%</Text>
            </View>
            <Text style={styles.macroCircleLabel}>Fat</Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          
          <FlatList
            data={meal.ingredients}
            renderItem={renderIngredientItem}
            keyExtractor={(item, index) => `ingredient-${index}`}
            scrollEnabled={false}
            contentContainerStyle={styles.ingredientsList}
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cooking Instructions</Text>
          <Text style={styles.instructionsText}>
            Prepare all ingredients as listed. Combine them according to the recipe directions. 
            Cook until done and serve immediately.
          </Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Nutrition Tips</Text>
          
          <View style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <Feather name="clock" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.tipText}>Best consumed within 2 hours of workout</Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <MaterialCommunityIcons name="water" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.tipText}>Drink at least 8oz of water with this meal</Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <MaterialCommunityIcons name="food-variant" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.tipText}>This meal is high in protein, great for muscle recovery</Text>
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
          style={styles.logMealButton}
          onPress={() => {
            consumeMeal(meal.id);
            navigation.navigate('Meals', { logged: true });
          }}
        >
          <Text style={styles.logMealButtonText}>Log This Meal</Text>
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
    height: 250,
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
  mealCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: SIZES.base,
  },
  mealCategoryText: {
    ...FONTS.body4,
    color: COLORS.accent,
  },
  mealName: {
    ...FONTS.h2,
    color: COLORS.accent,
    marginBottom: SIZES.base,
  },
  macrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
    marginBottom: SIZES.base / 2,
  },
  macroText: {
    ...FONTS.body3,
    color: COLORS.accent,
    marginLeft: 6,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  contentPadding: {
    height: 240,
  },
  macroCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  macroCircleWrapper: {
    alignItems: 'center',
  },
  macroCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.base / 2,
  },
  macroCircleValue: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  macroCircleLabel: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  sectionContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.padding,
  },
  ingredientsList: {
    
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding / 2,
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: SIZES.base,
  },
  ingredientText: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  instructionsText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding / 2,
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
  logMealButton: {
    flex: 1,
    height: 46,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logMealButtonText: {
    ...FONTS.h4,
    color: COLORS.accent,
  },
});

export default MealDetailScreen;