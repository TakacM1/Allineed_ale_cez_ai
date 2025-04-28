import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const HABIT_ICONS = [
  { icon: 'dumbbell', name: 'Workout' },
  { icon: 'water', name: 'Water' },
  { icon: 'food-apple', name: 'Nutrition' },
  { icon: 'run', name: 'Running' },
  { icon: 'sleep', name: 'Sleep' },
  { icon: 'meditation', name: 'Meditation' },
  { icon: 'pill', name: 'Vitamins' },
  { icon: 'book-open-page-variant', name: 'Reading' },
];

const HabitsScreen = ({ navigation }) => {
  const { habits, addHabit, updateHabit, deleteHabit } = useAppContext();
  
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isIconModalVisible, setIconModalVisible] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitTarget, setHabitTarget] = useState('7');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0].icon);
  const [editingHabit, setEditingHabit] = useState(null);
  
  // Get today's index (0 = Sunday, 6 = Saturday)
  const today = new Date().getDay();
  
  // Calculate habit completion progress
  const getCompletionRate = (habit) => {
    const completedDays = habit.completed.filter(Boolean).length;
    return Math.round((completedDays / habit.target) * 100);
  };
  
  // Handle habit toggle
  const toggleHabit = (habitId, dayIndex) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      updateHabit(habitId, dayIndex, !habit.completed[dayIndex]);
    }
  };
  
  // Handle add habit
  const handleAddHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }
    
    const target = parseInt(habitTarget);
    if (isNaN(target) || target < 1 || target > 7) {
      Alert.alert('Error', 'Please enter a valid target (1-7)');
      return;
    }
    
    addHabit({
      name: habitName,
      target: target,
      icon: selectedIcon
    });
    
    setHabitName('');
    setHabitTarget('7');
    setSelectedIcon(HABIT_ICONS[0].icon);
    setAddModalVisible(false);
  };
  
  // Handle edit habit
  const handleEditHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }
    
    const target = parseInt(habitTarget);
    if (isNaN(target) || target < 1 || target > 7) {
      Alert.alert('Error', 'Please enter a valid target (1-7)');
      return;
    }
    
    const updatedHabit = {
      ...editingHabit,
      name: habitName,
      target: target,
      icon: selectedIcon
    };
    
    // Since we don't have a dedicated updateHabitDetails function,
    // we'll delete and re-add with same completed status
    deleteHabit(editingHabit.id);
    addHabit(updatedHabit);
    
    setEditingHabit(null);
    setHabitName('');
    setHabitTarget('7');
    setSelectedIcon(HABIT_ICONS[0].icon);
    setEditModalVisible(false);
  };
  
  // Handle delete habit
  const handleDeleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteHabit(editingHabit.id);
            setEditingHabit(null);
            setEditModalVisible(false);
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Open edit modal
  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setHabitName(habit.name);
    setHabitTarget(habit.target.toString());
    setSelectedIcon(habit.icon || HABIT_ICONS[0].icon);
    setEditModalVisible(true);
  };
  
  // Select icon
  const selectIcon = (icon) => {
    setSelectedIcon(icon);
    setIconModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color={COLORS.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Habits</Text>
        <TouchableOpacity
          style={styles.addHeaderButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Feather name="plus" size={24} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
      
      {/* Habits List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.habitsListContainer}
      >
        {habits.map((habit) => (
          <View key={habit.id} style={styles.habitCard}>
            <View style={styles.habitHeader}>
              <View style={styles.habitTitleContainer}>
                <View style={styles.habitIconContainer}>
                  <MaterialCommunityIcons 
                    name={habit.icon || 'checkbox-marked-circle-outline'} 
                    size={24} 
                    color={COLORS.primary} 
                  />
                </View>
                <Text style={styles.habitTitle}>{habit.name}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.habitEditButton}
                onPress={() => openEditModal(habit)}
              >
                <Feather name="edit-2" size={18} color={COLORS.textGrey} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.habitProgress}>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${getCompletionRate(habit)}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {habit.completed.filter(Boolean).length}/{habit.target} days
              </Text>
            </View>
            
            <View style={styles.daysContainer}>
              {DAY_NAMES.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    habit.completed[index] && styles.completedDayButton,
                    index === today && styles.todayButton
                  ]}
                  onPress={() => toggleHabit(habit.id, index)}
                >
                  <Text style={[
                    styles.dayText,
                    habit.completed[index] && styles.completedDayText,
                    index === today && styles.todayText
                  ]}>
                    {day}
                  </Text>
                  
                  {habit.completed[index] && (
                    <View style={styles.checkmark}>
                      <Feather name="check" size={12} color={COLORS.accent} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        {habits.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="calendar-check" 
              size={60} 
              color={COLORS.textGrey} 
            />
            <Text style={styles.emptyText}>No habits added yet</Text>
            <Text style={styles.emptySubtext}>
              Start building better habits by adding your first habit
            </Text>
            
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Habit</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {/* Add Habit Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Habit</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Habit Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter habit name"
                placeholderTextColor={COLORS.textGrey}
                value={habitName}
                onChangeText={setHabitName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Icon</Text>
              <TouchableOpacity
                style={styles.iconSelector}
                onPress={() => setIconModalVisible(true)}
              >
                <MaterialCommunityIcons 
                  name={selectedIcon} 
                  size={24} 
                  color={COLORS.primary} 
                />
                <Text style={styles.iconSelectorText}>
                  {HABIT_ICONS.find(item => item.icon === selectedIcon)?.name || 'Select Icon'}
                </Text>
                <Feather name="chevron-down" size={18} color={COLORS.textGrey} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Target Days Per Week (1-7)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter target (1-7)"
                placeholderTextColor={COLORS.textGrey}
                keyboardType="number-pad"
                value={habitTarget}
                onChangeText={setHabitTarget}
                maxLength={1}
              />
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setHabitName('');
                  setHabitTarget('7');
                  setSelectedIcon(HABIT_ICONS[0].icon);
                  setAddModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddHabit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Edit Habit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Habit</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Habit Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter habit name"
                placeholderTextColor={COLORS.textGrey}
                value={habitName}
                onChangeText={setHabitName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Icon</Text>
              <TouchableOpacity
                style={styles.iconSelector}
                onPress={() => setIconModalVisible(true)}
              >
                <MaterialCommunityIcons 
                  name={selectedIcon} 
                  size={24} 
                  color={COLORS.primary} 
                />
                <Text style={styles.iconSelectorText}>
                  {HABIT_ICONS.find(item => item.icon === selectedIcon)?.name || 'Select Icon'}
                </Text>
                <Feather name="chevron-down" size={18} color={COLORS.textGrey} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Target Days Per Week (1-7)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter target (1-7)"
                placeholderTextColor={COLORS.textGrey}
                keyboardType="number-pad"
                value={habitTarget}
                onChangeText={setHabitTarget}
                maxLength={1}
              />
            </View>
            
            <View style={styles.editModalButtonsContainer}>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDeleteHabit}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              
              <View style={styles.editActionButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditingHabit(null);
                    setHabitName('');
                    setHabitTarget('7');
                    setSelectedIcon(HABIT_ICONS[0].icon);
                    setEditModalVisible(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleEditHabit}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Icon Selector Modal */}
      <Modal
        visible={isIconModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIconModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.iconModalContainer]}>
            <Text style={styles.modalTitle}>Select Icon</Text>
            
            <View style={styles.iconsGrid}>
              {HABIT_ICONS.map((item) => (
                <TouchableOpacity
                  key={item.icon}
                  style={[
                    styles.iconItem,
                    selectedIcon === item.icon && styles.selectedIconItem
                  ]}
                  onPress={() => selectIcon(item.icon)}
                >
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={32} 
                    color={selectedIcon === item.icon ? COLORS.accent : COLORS.primary} 
                  />
                  <Text style={[
                    styles.iconItemText,
                    selectedIcon === item.icon && styles.selectedIconItemText
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.closeIconModalButton}
              onPress={() => setIconModalVisible(false)}
            >
              <Text style={styles.closeIconModalButtonText}>Cancel</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.secondary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  addHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitsListContainer: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  habitCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    ...SHADOWS.medium,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  habitTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base,
  },
  habitTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  habitEditButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 4,
    marginRight: SIZES.base,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    ...FONTS.body4,
    color: COLORS.textGrey,
    minWidth: 60,
    textAlign: 'right',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  completedDayButton: {
    backgroundColor: COLORS.primary,
  },
  todayButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dayText: {
    ...FONTS.body4,
    color: COLORS.textGrey,
  },
  completedDayText: {
    color: COLORS.accent,
  },
  todayText: {
    color: COLORS.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
  checkmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 2,
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
    maxWidth: '80%',
  },
  addFirstButton: {
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    marginTop: SIZES.padding,
  },
  addFirstButtonText: {
    ...FONTS.body2,
    color: COLORS.accent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.dark,
  },
  iconModalContainer: {
    maxHeight: '80%',
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
    height: 50,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius / 2,
    paddingHorizontal: SIZES.padding,
    color: COLORS.textLight,
    ...FONTS.body2,
  },
  iconSelector: {
    height: 50,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius / 2,
    paddingHorizontal: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconSelectorText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    flex: 1,
    marginLeft: SIZES.base,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editModalButtonsContainer: {
    marginTop: SIZES.base,
  },
  editActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius / 2,
    marginRight: SIZES.base / 2,
    backgroundColor: COLORS.backgroundLight,
  },
  cancelButtonText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius / 2,
    marginLeft: SIZES.base / 2,
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.error,
  },
  deleteButtonText: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  iconItem: {
    width: '30%',
    height: 90,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.radius / 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.base,
    marginBottom: SIZES.base,
  },
  selectedIconItem: {
    backgroundColor: COLORS.primary,
  },
  iconItemText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginTop: SIZES.base / 2,
    textAlign: 'center',
  },
  selectedIconItemText: {
    color: COLORS.accent,
  },
  closeIconModalButton: {
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.backgroundLight,
  },
  closeIconModalButtonText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
});

export default HabitsScreen;