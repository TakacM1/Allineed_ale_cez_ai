import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Switch,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const FITNESS_GOALS = [
  'Weight Loss',
  'Build Muscle',
  'Maintain Weight',
  'Improve Fitness',
  'Increase Strength'
];

const ProfileScreen = ({ navigation }) => {
  const { user, updateUser, dailyCalories, updateDailyCalories } = useAppContext();
  
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isGoalModalVisible, setGoalModalVisible] = useState(false);
  const [isCaloriesModalVisible, setCaloriesModalVisible] = useState(false);
  
  const [editName, setEditName] = useState(user.name);
  const [editWeight, setEditWeight] = useState(user.weight.toString());
  const [editHeight, setEditHeight] = useState(user.height.toString());
  const [editAge, setEditAge] = useState(user.age.toString());
  const [editGoal, setEditGoal] = useState(user.goal);
  const [editCalories, setEditCalories] = useState(dailyCalories.toString());
  
  // Toggle states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [useMetricSystem, setUseMetricSystem] = useState(true);
  
  // Handle update profile
  const handleUpdateProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    
    const weight = parseFloat(editWeight);
    const height = parseFloat(editHeight);
    const age = parseInt(editAge);
    
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }
    
    if (isNaN(height) || height <= 0) {
      Alert.alert('Error', 'Please enter a valid height');
      return;
    }
    
    if (isNaN(age) || age <= 0) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }
    
    updateUser({
      name: editName,
      weight,
      height,
      age
    });
    
    setEditModalVisible(false);
  };
  
  // Handle update goal
  const handleUpdateGoal = (goal) => {
    updateUser({ goal });
    setEditGoal(goal);
    setGoalModalVisible(false);
  };
  
  // Handle update calories
  const handleUpdateCalories = () => {
    const calories = parseInt(editCalories);
    
    if (isNaN(calories) || calories <= 0) {
      Alert.alert('Error', 'Please enter a valid calorie target');
      return;
    }
    
    updateDailyCalories(calories);
    setCaloriesModalVisible(false);
  };
  
  // Calculate BMI
  const calculateBMI = () => {
    const heightInMeters = user.height / 100;
    const bmi = user.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };
  
  // Get BMI category
  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    
    if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmi < 24.9) return { category: 'Normal', color: '#2ecc71' };
    if (bmi < 29.9) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obese', color: '#e74c3c' };
  };
  
  // BMI information
  const bmiCategory = getBMICategory();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCardContainer}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.profileCardGradient}
          >
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Text style={styles.profileInitial}>{user.name.charAt(0)}</Text>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileGoal}>{user.goal}</Text>
              
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => {
                  setEditName(user.name);
                  setEditWeight(user.weight.toString());
                  setEditHeight(user.height.toString());
                  setEditAge(user.age.toString());
                  setEditModalVisible(true);
                }}
              >
                <Text style={styles.editProfileButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        
        {/* Body Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Body Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name="weight" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{user.weight} kg</Text>
                <Text style={styles.statLabel}>Weight</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <MaterialCommunityIcons name="human-male-height" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{user.height} cm</Text>
                <Text style={styles.statLabel}>Height</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Feather name="calendar" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{user.age}</Text>
                <Text style={styles.statLabel}>Age</Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <View style={[
                styles.statIconContainer, 
                { backgroundColor: `${bmiCategory.color}20` }
              ]}>
                <MaterialCommunityIcons 
                  name="scale-bathroom" 
                  size={20} 
                  color={bmiCategory.color} 
                />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={[styles.statValue, { color: bmiCategory.color }]}>
                  {calculateBMI()}
                </Text>
                <Text style={styles.statLabel}>BMI ({bmiCategory.category})</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Nutrition Goal */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Nutrition</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={styles.settingIconContainer}>
                <MaterialCommunityIcons name="target" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Fitness Goal</Text>
                <Text style={styles.settingValue}>{user.goal}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.settingActionButton}
              onPress={() => setGoalModalVisible(true)}
            >
              <Feather name="edit-2" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={styles.settingIconContainer}>
                <MaterialCommunityIcons name="fire" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Daily Calorie Target</Text>
                <Text style={styles.settingValue}>{dailyCalories} calories</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.settingActionButton}
              onPress={() => {
                setEditCalories(dailyCalories.toString());
                setCaloriesModalVisible(true);
              }}
            >
              <Feather name="edit-2" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* App Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={styles.settingIconContainer}>
                <Feather name="bell" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive workout and meal reminders
                </Text>
              </View>
            </View>
            
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.backgroundLight, true: COLORS.primaryLight }}
              thumbColor={notificationsEnabled ? COLORS.primary : COLORS.textGrey}
            />
          </View>
          
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={styles.settingIconContainer}>
                <Feather name="moon" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Use dark theme for the app
                </Text>
              </View>
            </View>
            
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: COLORS.backgroundLight, true: COLORS.primaryLight }}
              thumbColor={darkModeEnabled ? COLORS.primary : COLORS.textGrey}
            />
          </View>
          
          <View style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={styles.settingIconContainer}>
                <MaterialCommunityIcons name="scale-balance" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Units</Text>
                <Text style={styles.settingDescription}>
                  {useMetricSystem ? 'Metric (kg, cm)' : 'Imperial (lb, in)'}
                </Text>
              </View>
            </View>
            
            <Switch
              value={useMetricSystem}
              onValueChange={setUseMetricSystem}
              trackColor={{ false: COLORS.backgroundLight, true: COLORS.primaryLight }}
              thumbColor={useMetricSystem ? COLORS.primary : COLORS.textGrey}
            />
          </View>
        </View>
        
        {/* About & Support */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About & Support</Text>
          
          <TouchableOpacity style={styles.linkCard}>
            <View style={styles.linkContent}>
              <View style={styles.linkIconContainer}>
                <Feather name="help-circle" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.linkText}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.textGrey} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkCard}>
            <View style={styles.linkContent}>
              <View style={styles.linkIconContainer}>
                <Feather name="shield" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.textGrey} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkCard}>
            <View style={styles.linkContent}>
              <View style={styles.linkIconContainer}>
                <Feather name="file-text" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.linkText}>Terms of Service</Text>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.textGrey} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkCard}>
            <View style={styles.linkContent}>
              <View style={styles.linkIconContainer}>
                <Feather name="info" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.linkText}>About App</Text>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.textGrey} />
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Feather name="log-out" size={20} color={COLORS.error} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        
        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textGrey}
                value={editName}
                onChangeText={setEditName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your weight"
                placeholderTextColor={COLORS.textGrey}
                keyboardType="numeric"
                value={editWeight}
                onChangeText={setEditWeight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your height"
                placeholderTextColor={COLORS.textGrey}
                keyboardType="numeric"
                value={editHeight}
                onChangeText={setEditHeight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                placeholderTextColor={COLORS.textGrey}
                keyboardType="numeric"
                value={editAge}
                onChangeText={setEditAge}
              />
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Goal Modal */}
      <Modal
        visible={isGoalModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Fitness Goal</Text>
            
            {FITNESS_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalItem,
                  editGoal === goal && styles.selectedGoalItem
                ]}
                onPress={() => handleUpdateGoal(goal)}
              >
                <Text style={[
                  styles.goalItemText,
                  editGoal === goal && styles.selectedGoalItemText
                ]}>
                  {goal}
                </Text>
                
                {editGoal === goal && (
                  <Feather name="check" size={20} color={COLORS.accent} />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setGoalModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Calories Modal */}
      <Modal
        visible={isCaloriesModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCaloriesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Daily Calorie Target</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter daily calorie target"
                placeholderTextColor={COLORS.textGrey}
                keyboardType="numeric"
                value={editCalories}
                onChangeText={setEditCalories}
              />
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setCaloriesModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleUpdateCalories}
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
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.secondary,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.accent,
  },
  profileCardContainer: {
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  profileCardGradient: {
    flexDirection: 'row',
    padding: SIZES.padding,
  },
  profileImageContainer: {
    marginRight: SIZES.padding,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    ...FONTS.h1,
    color: COLORS.accent,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    ...FONTS.h2,
    color: COLORS.accent,
  },
  profileGoal: {
    ...FONTS.body3,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SIZES.base,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: SIZES.base,
  },
  editProfileButtonText: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
  statsContainer: {
    margin: SIZES.padding,
    marginTop: 0,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.padding / 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding / 2,
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.card,
    marginBottom: SIZES.padding / 2,
    ...SHADOWS.light,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.textGrey,
  },
  sectionContainer: {
    margin: SIZES.padding,
    marginTop: 0,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card,
    marginBottom: SIZES.padding / 2,
    ...SHADOWS.light,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding / 2,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.h4,
    color: COLORS.accent,
  },
  settingValue: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  settingDescription: {
    ...FONTS.body4,
    color: COLORS.textGrey,
  },
  settingActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card,
    marginBottom: SIZES.padding / 2,
    ...SHADOWS.light,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding / 2,
  },
  linkText: {
    ...FONTS.body2,
    color: COLORS.accent,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: `${COLORS.error}20`,
  },
  logoutButtonText: {
    ...FONTS.body2,
    color: COLORS.error,
    marginLeft: SIZES.base,
  },
  versionText: {
    ...FONTS.body4,
    color: COLORS.textGrey,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
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
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius / 2,
    marginBottom: SIZES.base,
    backgroundColor: COLORS.backgroundLight,
  },
  selectedGoalItem: {
    backgroundColor: COLORS.primary,
  },
  goalItemText: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  selectedGoalItemText: {
    color: COLORS.accent,
    fontFamily: 'Poppins_600SemiBold',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.backgroundLight,
    marginTop: SIZES.padding / 2,
  },
  closeButtonText: {
    ...FONTS.body3,
    color: COLORS.textLight,
  },
});

export default ProfileScreen;