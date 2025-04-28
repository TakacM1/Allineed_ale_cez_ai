import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const { 
    completedWorkouts, 
    consumedMeals, 
    measurements, 
    habits 
  } = useAppContext();
  
  const [selectedTab, setSelectedTab] = useState('workouts');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Get data for charts based on period
  const getDateRange = () => {
    const today = new Date();
    const dates = [];
    const labels = [];
    
    if (selectedPeriod === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
    } else if (selectedPeriod === 'month') {
      // Last 4 weeks (each point is a week)
      for (let i = 3; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - (i * 7));
        dates.push(date);
        labels.push(`Week ${4-i}`);
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(today.getMonth() - i);
        dates.push(date);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
    }
    
    return { dates, labels };
  };
  
  // Get workout data
  const getWorkoutData = () => {
    const { dates, labels } = getDateRange();
    
    // Count workouts for each date
    const data = dates.map(date => {
      if (selectedPeriod === 'week') {
        // For weekly view, count workouts for each day
        return completedWorkouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate.getDate() === date.getDate() && 
                   workoutDate.getMonth() === date.getMonth() &&
                   workoutDate.getFullYear() === date.getFullYear();
          }).length;
        } else if (selectedPeriod === 'month') {
          // For monthly view, count workouts for each week
          const weekStart = new Date(date);
          const weekEnd = new Date(date);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          return completedWorkouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= weekStart && workoutDate <= weekEnd;
          }).length;
        } else {
          // For yearly view, count workouts for each month
          return completedWorkouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate.getMonth() === date.getMonth() &&
                   workoutDate.getFullYear() === date.getFullYear();
          }).length;
        }
      });
      
      return {
        labels,
        datasets: [
          {
            data,
            color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
            strokeWidth: 2
          }
        ],
        legend: ["Workouts"]
      };
    };
    
    // Get calories data
    const getCaloriesData = () => {
      const { dates, labels } = getDateRange();
      
      // Calculate calories for each date
      const data = dates.map(date => {
        if (selectedPeriod === 'week') {
          // For weekly view, calculate calories for each day
          return consumedMeals.filter(meal => {
            const mealDate = new Date(meal.date);
            return mealDate.getDate() === date.getDate() && 
                   mealDate.getMonth() === date.getMonth() &&
                   mealDate.getFullYear() === date.getFullYear();
          }).reduce((total, meal) => total + meal.calories, 0);
        } else if (selectedPeriod === 'month') {
          // For monthly view, calculate calories for each week
          const weekStart = new Date(date);
          const weekEnd = new Date(date);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          return consumedMeals.filter(meal => {
            const mealDate = new Date(meal.date);
            return mealDate >= weekStart && mealDate <= weekEnd;
          }).reduce((total, meal) => total + meal.calories, 0);
        } else {
          // For yearly view, calculate calories for each month
          return consumedMeals.filter(meal => {
            const mealDate = new Date(meal.date);
            return mealDate.getMonth() === date.getMonth() &&
                   mealDate.getFullYear() === date.getFullYear();
          }).reduce((total, meal) => total + meal.calories, 0);
        }
      });
      
      return {
        labels,
        datasets: [
          {
            data,
            color: (opacity = 1) => `rgba(40, 199, 111, ${opacity})`,
            strokeWidth: 2
          }
        ],
        legend: ["Calories"]
      };
    };
    
    // Get weight data (if available)
    const getWeightData = () => {
      if (!measurements.weight || measurements.weight.length === 0) {
        // No weight data available
        const { labels } = getDateRange();
        return {
          labels,
          datasets: [
            {
              data: Array(labels.length).fill(0),
              color: (opacity = 1) => `rgba(0, 207, 232, ${opacity})`,
              strokeWidth: 2
            }
          ],
          legend: ["Weight (kg)"]
        };
      }
      
      const { dates, labels } = getDateRange();
      
      // Find closest weight measurement for each date
      const data = dates.map(date => {
        // Sort measurements by date difference (closest first)
        const sorted = [...measurements.weight].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return Math.abs(date - dateA) - Math.abs(date - dateB);
        });
        
        // Return value of closest measurement or 0 if none
        return sorted.length > 0 ? sorted[0].value : 0;
      });
      
      return {
        labels,
        datasets: [
          {
            data,
            color: (opacity = 1) => `rgba(0, 207, 232, ${opacity})`,
            strokeWidth: 2
          }
        ],
        legend: ["Weight (kg)"]
      };
    };
    
    // Calculate summary stats
    const getWorkoutSummary = () => {
      // Filter workouts based on selected period
      const today = new Date();
      let filteredWorkouts = [];
      
      if (selectedPeriod === 'week') {
        // Last 7 days
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 6);
        weekStart.setHours(0, 0, 0, 0);
        
        filteredWorkouts = completedWorkouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= weekStart;
        });
      } else if (selectedPeriod === 'month') {
        // Last 4 weeks
        const monthStart = new Date(today);
        monthStart.setDate(today.getDate() - 28);
        monthStart.setHours(0, 0, 0, 0);
        
        filteredWorkouts = completedWorkouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= monthStart;
        });
      } else {
        // Last 6 months
        const yearStart = new Date(today);
        yearStart.setMonth(today.getMonth() - 6);
        yearStart.setHours(0, 0, 0, 0);
        
        filteredWorkouts = completedWorkouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= yearStart;
        });
      }
      
      const totalWorkouts = filteredWorkouts.length;
      const totalDuration = filteredWorkouts.reduce((total, workout) => total + workout.duration, 0);
      const totalCalories = filteredWorkouts.reduce((total, workout) => total + workout.calories, 0);
      
      return {
        totalWorkouts,
        totalDuration,
        totalCalories
      };
    };
    
    // Get habit completion rate
    const getHabitCompletionRate = () => {
      if (habits.length === 0) return 0;
      
      const totalCompleted = habits.reduce((total, habit) => {
        const completedDays = habit.completed.filter(Boolean).length;
        return total + (completedDays / habit.target);
      }, 0);
      
      return Math.round((totalCompleted / habits.length) * 100);
    };
    
    // Get current chart data based on selected tab
    const getCurrentChartData = () => {
      switch (selectedTab) {
        case 'workouts':
          return getWorkoutData();
        case 'nutrition':
          return getCaloriesData();
        case 'weight':
          return getWeightData();
        default:
          return getWorkoutData();
      }
    };
    
    // Chart configuration
    const chartConfig = {
      backgroundGradientFrom: COLORS.card,
      backgroundGradientTo: COLORS.card,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: COLORS.background
      }
    };
    
    // Workout summary
    const summary = getWorkoutSummary();
    const habitRate = getHabitCompletionRate();
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress</Text>
          <TouchableOpacity 
            style={styles.calendarButton}
            onPress={() => navigation.navigate('MeasurementsScreen')}
          >
            <Feather name="activity" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
        
        {/* Period Selector */}
        <View style={styles.periodSelectorContainer}>
          <TouchableOpacity 
            style={[
              styles.periodButton,
              selectedPeriod === 'week' && styles.selectedPeriodButton
            ]}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'week' && styles.selectedPeriodButtonText
            ]}>
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.selectedPeriodButton
            ]}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'month' && styles.selectedPeriodButtonText
            ]}>
              Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.periodButton,
              selectedPeriod === 'year' && styles.selectedPeriodButton
            ]}
            onPress={() => setSelectedPeriod('year')}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === 'year' && styles.selectedPeriodButtonText
            ]}>
              6 Months
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Summary Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryCardsContainer}
        >
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <MaterialCommunityIcons name="dumbbell" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryValue}>{summary.totalWorkouts}</Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Feather name="clock" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryValue}>{summary.totalDuration} min</Text>
              <Text style={styles.summaryLabel}>Duration</Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <MaterialCommunityIcons name="fire" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryValue}>{summary.totalCalories}</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Feather name="check-circle" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryValue}>{habitRate}%</Text>
              <Text style={styles.summaryLabel}>Habits</Text>
            </View>
          </View>
        </ScrollView>
        
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton,
              selectedTab === 'workouts' && styles.selectedTabButton
            ]}
            onPress={() => setSelectedTab('workouts')}
          >
            <Text style={[
              styles.tabButtonText,
              selectedTab === 'workouts' && styles.selectedTabButtonText
            ]}>
              Workouts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabButton,
              selectedTab === 'nutrition' && styles.selectedTabButton
            ]}
            onPress={() => setSelectedTab('nutrition')}
          >
            <Text style={[
              styles.tabButtonText,
              selectedTab === 'nutrition' && styles.selectedTabButtonText
            ]}>
              Nutrition
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabButton,
              selectedTab === 'weight' && styles.selectedTabButton
            ]}
            onPress={() => setSelectedTab('weight')}
          >
            <Text style={[
              styles.tabButtonText,
              selectedTab === 'weight' && styles.selectedTabButtonText
            ]}>
              Weight
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {selectedTab === 'workouts' ? 'Workouts Completed' : 
             selectedTab === 'nutrition' ? 'Calories Consumed' : 'Weight Trend'}
          </Text>
          
          <LineChart
            data={getCurrentChartData()}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        
        {/* Activity List */}
        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          
          <ScrollView style={styles.activityList}>
            {completedWorkouts.slice(0, 5).map((workout, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <MaterialCommunityIcons name="dumbbell" size={18} color={COLORS.primary} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>{workout.workoutName}</Text>
                  <Text style={styles.activityDate}>
                    {new Date(workout.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                <View style={styles.activityStats}>
                  <Text style={styles.activityStatValue}>{workout.duration} min</Text>
                  <Text style={styles.activityStatValue}>{workout.calories} cal</Text>
                </View>
              </View>
            ))}
            
            {completedWorkouts.length === 0 && (
              <View style={styles.emptyActivityContainer}>
                <Text style={styles.emptyActivityText}>No workouts completed yet</Text>
                <TouchableOpacity 
                  style={styles.startWorkoutButton}
                  onPress={() => navigation.navigate('Workouts')}
                >
                  <Text style={styles.startWorkoutButtonText}>Start a Workout</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
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
    periodSelectorContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: SIZES.padding,
      paddingVertical: SIZES.padding / 2,
      backgroundColor: COLORS.secondary,
    },
    periodButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: SIZES.base / 2,
      paddingHorizontal: SIZES.base,
      borderRadius: SIZES.radius / 2,
      marginHorizontal: SIZES.base / 2,
      backgroundColor: COLORS.backgroundLight,
    },
    selectedPeriodButton: {
      backgroundColor: COLORS.primary,
    },
    periodButtonText: {
      ...FONTS.body3,
      color: COLORS.textLight,
    },
    selectedPeriodButtonText: {
      color: COLORS.accent,
      fontFamily: 'Poppins_500Medium',
    },
    summaryCardsContainer: {
      paddingHorizontal: SIZES.padding / 2,
      paddingVertical: SIZES.padding,
    },
    summaryCard: {
      width: 140,
      height: 100,
      backgroundColor: COLORS.card,
      borderRadius: SIZES.radius,
      padding: SIZES.padding / 2,
      marginHorizontal: SIZES.base / 2,
      ...SHADOWS.light,
      justifyContent: 'center',
    },
    summaryIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.backgroundLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SIZES.base,
    },
    summaryTextContainer: {
      
    },
    summaryValue: {
      ...FONTS.h3,
      color: COLORS.accent,
    },
    summaryLabel: {
      ...FONTS.body4,
      color: COLORS.textGrey,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: SIZES.padding,
      marginBottom: SIZES.padding / 2,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: SIZES.base,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    selectedTabButton: {
      borderBottomColor: COLORS.primary,
    },
    tabButtonText: {
      ...FONTS.body3,
      color: COLORS.textGrey,
    },
    selectedTabButtonText: {
      color: COLORS.primary,
      fontFamily: 'Poppins_500Medium',
    },
    chartContainer: {
      paddingHorizontal: SIZES.padding,
      marginBottom: SIZES.padding,
      alignItems: 'center',
    },
    chartTitle: {
      ...FONTS.h3,
      color: COLORS.accent,
      marginBottom: SIZES.base,
      alignSelf: 'flex-start',
    },
    chart: {
      borderRadius: SIZES.radius,
      ...SHADOWS.medium,
    },
    activityContainer: {
      flex: 1,
      paddingHorizontal: SIZES.padding,
    },
    activityTitle: {
      ...FONTS.h3,
      color: COLORS.accent,
      marginBottom: SIZES.padding / 2,
    },
    activityList: {
      flex: 1,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SIZES.padding / 2,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.backgroundLight,
    },
    activityIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.backgroundLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SIZES.base,
    },
    activityInfo: {
      flex: 1,
    },
    activityName: {
      ...FONTS.body3,
      color: COLORS.textLight,
    },
    activityDate: {
      ...FONTS.body4,
      color: COLORS.textGrey,
    },
    activityStats: {
      alignItems: 'flex-end',
    },
    activityStatValue: {
      ...FONTS.body4,
      color: COLORS.textGrey,
    },
    emptyActivityContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SIZES.padding,
    },
    emptyActivityText: {
      ...FONTS.body3,
      color: COLORS.textGrey,
      marginBottom: SIZES.padding,
    },
    startWorkoutButton: {
      paddingHorizontal: SIZES.padding,
      paddingVertical: SIZES.base,
      backgroundColor: COLORS.primary,
      borderRadius: SIZES.radius / 2,
    },
    startWorkoutButtonText: {
      ...FONTS.body3,
      color: COLORS.accent,
    },
  });
  
  export default ProgressScreen;