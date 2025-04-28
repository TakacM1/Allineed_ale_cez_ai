import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Animated,
  Dimensions
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', name: 'All Workouts' },
  { id: 'strength', name: 'Strength' },
  { id: 'cardio', name: 'Cardio' },
  { id: 'core', name: 'Core' },
  { id: 'flexibility', name: 'Flexibility' }
];

const DIFFICULTY_COLORS = {
  'beginner': '#28C76F',
  'intermediate': '#FFAB00',
  'advanced': '#EA5455'
};

const WorkoutsScreen = ({ navigation }) => {
  const { workouts, completedWorkouts } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  
  // State to trigger re-rendering and re-animations
  const [animationKey, setAnimationKey] = useState(0);
  
  // Filter workouts based on search query and category
  useEffect(() => {
    let result = workouts;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(workout => workout.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(workout => 
        workout.name.toLowerCase().includes(lowercasedQuery) ||
        workout.exercises.some(exercise => 
          exercise.name.toLowerCase().includes(lowercasedQuery)
        )
      );
    }
    
    // Important: We'll set filtered workouts to empty array first to ensure
    // all cards disappear, then set the actual filtered results
    setFilteredWorkouts([]);
    
    // Using setTimeout to ensure the reset happens before new cards are rendered
    setTimeout(() => {
      setFilteredWorkouts(result);
      // Increment animation key to force re-render and re-animation
      setAnimationKey(prev => prev + 1);
    }, 50);
    
  }, [workouts, searchQuery, selectedCategory]);
  
  // Get total number of completed workouts
  const getCompletedCount = (workoutId) => {
    return completedWorkouts.filter(workout => workout.workoutId === workoutId).length;
  };

  // Render category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  // Render workout card with animations
  const renderWorkoutItem = ({ item, index }) => {
    const completedCount = getCompletedCount(item.id);
    
    // Create new animation values for each card
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(50);
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      })
    ]).start();
    
    return (
      <Animated.View
        style={[
          styles.workoutCardContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.workoutCard}
          onPress={() => navigation.navigate('WorkoutDetailScreen', { 
            id: item.id,
            name: item.name 
          })}
          activeOpacity={0.8}
        >
          <View style={styles.workoutHeader}>
            <View>
              <View style={styles.workoutCategoryContainer}>
                <View style={styles.workoutCategoryBadge}>
                  <Text style={styles.workoutCategoryText}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </Text>
                </View>
                
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: DIFFICULTY_COLORS[item.difficulty] }
                ]}>
                  <Text style={styles.difficultyText}>
                    {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.workoutName}>{item.name}</Text>
            </View>
            
            {completedCount > 0 && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>
                  {completedCount}×
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.workoutDetails}>
            <View style={styles.workoutMetaItem}>
              <Feather name="clock" size={16} color={COLORS.primary} />
              <Text style={styles.workoutMetaText}>{item.duration} min</Text>
            </View>
            
            <View style={styles.workoutMetaItem}>
              <MaterialCommunityIcons name="fire" size={16} color={COLORS.primary} />
              <Text style={styles.workoutMetaText}>{item.calories} cal</Text>
            </View>
            
            <View style={styles.workoutMetaItem}>
              <MaterialCommunityIcons name="dumbbell" size={16} color={COLORS.primary} />
              <Text style={styles.workoutMetaText}>{item.exercises.length} exercises</Text>
            </View>
          </View>
          
          <View style={styles.workoutActions}>
            <TouchableOpacity 
              style={styles.detailButton}
              onPress={() => navigation.navigate('WorkoutDetailScreen', { 
                id: item.id,
                name: item.name 
              })}
            >
              <Text style={styles.detailButtonText}>Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => navigation.navigate('StartWorkoutScreen', { id: item.id })}
            >
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workouts</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
      
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={18} color={COLORS.textGrey} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            placeholderTextColor={COLORS.textGrey}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color={COLORS.textGrey} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Workouts list - with key to force re-render */}
      {filteredWorkouts.length > 0 ? (
        <FlatList
          key={`workout-list-${animationKey}`}
          data={filteredWorkouts}
          renderItem={renderWorkoutItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.workoutsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="dumbbell" size={60} color={COLORS.textGrey} />
          <Text style={styles.emptyText}>No workouts found</Text>
          <Text style={styles.emptySubtext}>Try changing your filters or add a new workout</Text>
          
          <TouchableOpacity style={styles.addWorkoutButton}>
            <Text style={styles.addWorkoutText}>Add Workout</Text>
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    backgroundColor: COLORS.secondary,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.textLight,
    ...FONTS.body2,
  },
  categoriesContainer: {
    backgroundColor: COLORS.secondary,
    paddingBottom: SIZES.padding,
  },
  categoriesList: {
    paddingHorizontal: SIZES.padding,
  },
  categoryItem: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    marginRight: SIZES.base,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.backgroundLight,
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  selectedCategoryText: {
    color: COLORS.accent,
    fontFamily: 'Poppins_500Medium',
  },
  workoutsList: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  workoutCardContainer: {
    marginBottom: SIZES.padding,
  },
  workoutCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.medium,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  workoutCategoryContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.base,
  },
  workoutCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    marginRight: SIZES.base,
  },
  workoutCategoryText: {
    ...FONTS.body4,
    color: COLORS.primary,
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
  completedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
  },
  completedText: {
    ...FONTS.body3,
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.accent,
  },
  workoutName: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.base,
  },
  workoutDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  workoutMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  workoutMetaText: {
    ...FONTS.body3,
    color: COLORS.textGrey,
    marginLeft: 6,
  },
  workoutActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailButton: {
    flex: 1,
    marginRight: SIZES.base,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius / 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  detailButtonText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  startButton: {
    flex: 1,
    marginLeft: SIZES.base,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.primary,
  },
  startButtonText: {
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
  addWorkoutButton: {
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    marginTop: SIZES.padding,
  },
  addWorkoutText: {
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

export default WorkoutsScreen;