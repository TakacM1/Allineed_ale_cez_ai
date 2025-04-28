import React, { useState, useRef } from 'react';
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
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useAppContext } from '../context/AppContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const MEASUREMENT_TYPES = [
  { id: 'weight', name: 'Weight', unit: 'kg', icon: 'weight' },
  { id: 'bodyFat', name: 'Body Fat', unit: '%', icon: 'percent' },
  { id: 'chest', name: 'Chest', unit: 'cm', icon: 'human-male' },
  { id: 'waist', name: 'Waist', unit: 'cm', icon: 'human-male' },
  { id: 'hips', name: 'Hips', unit: 'cm', icon: 'human-male' },
  { id: 'arms', name: 'Arms', unit: 'cm', icon: 'arm-flex' },
  { id: 'thighs', name: 'Thighs', unit: 'cm', icon: 'human-male' }
];

const MeasurementsScreen = ({ navigation }) => {
  const { measurements, addMeasurement } = useAppContext();
  
  const [selectedType, setSelectedType] = useState('weight');
  const [isModalVisible, setModalVisible] = useState(false);
  const [measurementValue, setMeasurementValue] = useState('');
  
  // Get measurement data for selected type
  const getMeasurementData = () => {
    const measurementArray = measurements[selectedType] || [];
    
    // Sort by date
    const sortedMeasurements = [...measurementArray].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Last 7 measurements (or less if not enough data)
    const recentMeasurements = sortedMeasurements.slice(-7);
    
    // Format labels as dates
    const labels = recentMeasurements.map(m => 
      new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    
    // Get values
    const data = recentMeasurements.map(m => m.value);
    
    // If no data, return empty chart data
    if (data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [0],
            color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
            strokeWidth: 2
          }
        ]
      };
    }
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };
  
  // Get latest measurement value
  const getLatestMeasurement = () => {
    const measurementArray = measurements[selectedType] || [];
    
    if (measurementArray.length === 0) {
      return { value: 0, date: null };
    }
    
    // Sort by date (newest first)
    const sortedMeasurements = [...measurementArray].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    return {
      value: sortedMeasurements[0].value,
      date: new Date(sortedMeasurements[0].date)
    };
  };
  
  // Handle add measurement
  const handleAddMeasurement = () => {
    if (!measurementValue.trim()) {
      Alert.alert('Error', 'Please enter a valid value');
      return;
    }
    
    const value = parseFloat(measurementValue);
    
    if (isNaN(value)) {
      Alert.alert('Error', 'Please enter a numerical value');
      return;
    }
    
    addMeasurement(selectedType, value);
    setMeasurementValue('');
    setModalVisible(false);
  };
  
  // Get current measurement type details
  const getCurrentType = () => {
    return MEASUREMENT_TYPES.find(type => type.id === selectedType);
  };
  
  // Get unit for selected type
  const getUnit = () => {
    const currentType = getCurrentType();
    return currentType ? currentType.unit : '';
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'No data';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Latest measurement
  const latestMeasurement = getLatestMeasurement();
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo: COLORS.card,
    decimalPlaces: 1,
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color={COLORS.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Body Measurements</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Type Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeSelectorContainer}
      >
        {MEASUREMENT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton,
              selectedType === type.id && styles.selectedTypeButton
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            {type.icon === 'weight' ? (
              <FontAwesome5 
                name={type.icon} 
                size={16} 
                color={selectedType === type.id ? COLORS.accent : COLORS.textGrey} 
              />
            ) : type.icon === 'percent' ? (
              <Feather 
                name={type.icon} 
                size={16} 
                color={selectedType === type.id ? COLORS.accent : COLORS.textGrey} 
              />
            ) : (
              <MaterialCommunityIcons 
                name={type.icon} 
                size={20} 
                color={selectedType === type.id ? COLORS.accent : COLORS.textGrey} 
              />
            )}
            <Text style={[
              styles.typeButtonText,
              selectedType === type.id && styles.selectedTypeButtonText
            ]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Current Measurement */}
      <View style={styles.currentMeasurementContainer}>
        <View style={styles.currentMeasurementContent}>
          <View>
            <Text style={styles.currentMeasurementLabel}>
              Current {getCurrentType()?.name}
            </Text>
            <View style={styles.currentMeasurementValueContainer}>
              <Text style={styles.currentMeasurementValue}>
                {latestMeasurement.value}
              </Text>
              <Text style={styles.currentMeasurementUnit}>
                {getUnit()}
              </Text>
            </View>
            <Text style={styles.currentMeasurementDate}>
              Last updated: {formatDate(latestMeasurement.date)}
              </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Progress Chart</Text>
        
        <LineChart
          data={getMeasurementData()}
          width={SIZES.width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
      
      {/* History */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Measurement History</Text>
        
        <ScrollView 
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
        >
          {(measurements[selectedType] || [])
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyItemIconContainer}>
                  {getCurrentType()?.icon === 'weight' ? (
                    <FontAwesome5 name={getCurrentType()?.icon} size={16} color={COLORS.primary} />
                  ) : getCurrentType()?.icon === 'percent' ? (
                    <Feather name={getCurrentType()?.icon} size={16} color={COLORS.primary} />
                  ) : (
                    <MaterialCommunityIcons name={getCurrentType()?.icon} size={20} color={COLORS.primary} />
                  )}
                </View>
                <View style={styles.historyItemInfo}>
                  <Text style={styles.historyItemValue}>
                    {item.value} {getUnit()}
                  </Text>
                  <Text style={styles.historyItemDate}>
                    {formatDate(new Date(item.date))}
                  </Text>
                </View>
              </View>
            ))}
          
          {(!measurements[selectedType] || measurements[selectedType].length === 0) && (
            <View style={styles.emptyHistoryContainer}>
              <Text style={styles.emptyHistoryText}>
                No {getCurrentType()?.name.toLowerCase()} measurements recorded yet
              </Text>
              <TouchableOpacity 
                style={styles.addFirstButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.addFirstButtonText}>
                  Add Your First Measurement
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
      
      {/* Add Measurement Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Add New {getCurrentType()?.name} Measurement
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={`Enter ${getCurrentType()?.name.toLowerCase()} (${getUnit()})`}
                placeholderTextColor={COLORS.textGrey}
                value={measurementValue}
                onChangeText={setMeasurementValue}
              />
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setMeasurementValue('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddMeasurement}
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
  typeSelectorContainer: {
    paddingHorizontal: SIZES.padding / 2,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.secondary,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding / 2,
    paddingVertical: SIZES.base / 2,
    marginHorizontal: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.backgroundLight,
  },
  selectedTypeButton: {
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    marginLeft: SIZES.base / 2,
  },
  selectedTypeButtonText: {
    color: COLORS.accent,
  },
  currentMeasurementContainer: {
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.card,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  currentMeasurementContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  currentMeasurementLabel: {
    ...FONTS.body3,
    color: COLORS.textGrey,
  },
  currentMeasurementValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentMeasurementValue: {
    ...FONTS.h1,
    color: COLORS.accent,
  },
  currentMeasurementUnit: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginLeft: SIZES.base / 2,
  },
  currentMeasurementDate: {
    ...FONTS.body4,
    color: COLORS.textGrey,
  },
  addButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.primary,
  },
  addButtonText: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
  chartContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  chartTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.base,
  },
  chart: {
    borderRadius: SIZES.radius,
    ...SHADOWS.medium,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  historyTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    marginBottom: SIZES.padding / 2,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  historyItemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding / 2,
  },
  historyItemInfo: {
    flex: 1,
  },
  historyItemValue: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  historyItemDate: {
    ...FONTS.body4,
    color: COLORS.textGrey,
  },
  emptyHistoryContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  emptyHistoryText: {
    ...FONTS.body3,
    color: COLORS.textGrey,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  addFirstButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.primary,
  },
  addFirstButtonText: {
    ...FONTS.body3,
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
});

export default MeasurementsScreen;