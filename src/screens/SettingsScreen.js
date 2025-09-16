import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');

export default function SettingsScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    locationServices: true,
    autoUpdate: true,
    biometricLogin: false,
    soundEffects: true,
    hapticFeedback: true,
  });
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
      }),
    ]).start();
  }, []);

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Settings saved successfully!');
    }, 1000);
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: true,
              darkMode: false,
              locationServices: true,
              autoUpdate: true,
              biometricLogin: false,
              soundEffects: true,
              hapticFeedback: true,
            });
          }
        }
      ]
    );
  };

  const settingsSections = [
    {
      title: 'General',
      items: [
        { key: 'notifications', label: 'Push Notifications', description: 'Receive app notifications', icon: '🔔' },
        { key: 'darkMode', label: 'Dark Mode', description: 'Use dark theme', icon: '🌙' },
        { key: 'locationServices', label: 'Location Services', description: 'Allow location access', icon: '📍' },
        { key: 'autoUpdate', label: 'Auto Update', description: 'Automatically update app', icon: '🔄' },
      ]
    },
    {
      title: 'Security',
      items: [
        { key: 'biometricLogin', label: 'Biometric Login', description: 'Use fingerprint or face ID', icon: '🔐' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { key: 'soundEffects', label: 'Sound Effects', description: 'Play sound effects', icon: '🔊' },
        { key: 'hapticFeedback', label: 'Haptic Feedback', description: 'Vibrate on touch', icon: '📳' },
      ]
    }
  ];

  const renderSettingItem = (item) => (
    <Animated.View
      key={item.key}
      style={[
        styles.settingItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.settingItemLeft}>
        <Text style={styles.settingIcon}>{item.icon}</Text>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>{item.label}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>
      </View>
      <Switch
        value={settings[item.key]}
        onValueChange={() => toggleSetting(item.key)}
        trackColor={{ false: Colors.borderLight, true: Colors.primary }}
        thumbColor={settings[item.key] ? Colors.white : Colors.textLight}
      />
    </Animated.View>
  );

  const renderSettingsSection = (section) => (
    <Animated.View
      key={section.title}
      style={[
        styles.settingsSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {section.items.map(renderSettingItem)}
      </Card>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.gradient}>
        {/* Background decorative elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.backButtonContainer}>
                <Text style={styles.backIcon}>←</Text>
                <Text style={styles.backText}>Settings</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Settings Sections */}
          <View style={styles.settingsContainer}>
            {settingsSections.map(renderSettingsSection)}
          </View>

          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.actionsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSettings}
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="small" color={Colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save Settings</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetSettings}
            >
              <Text style={styles.resetButtonText}>Reset to Default</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* App Info */}
          <Animated.View
            style={[
              styles.appInfoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.appInfoCard}>
              <View style={styles.appInfoContent}>
                <Text style={styles.appInfoIcon}>👟</Text>
                <View style={styles.appInfoText}>
                  <Text style={styles.appInfoTitle}>ShoeStore App</Text>
                  <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
                  <Text style={styles.appInfoDescription}>
                    Your ultimate destination for premium footwear
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: Colors.primary,
    opacity: 0.05,
  },
  circle1: {
    width: 150,
    height: 150,
    top: 50,
    right: -30,
  },
  circle2: {
    width: 100,
    height: 100,
    bottom: 200,
    left: -20,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backIcon: {
    fontSize: 18,
    color: Colors.primary,
    marginRight: Spacing.xs,
  },
  backText: {
    ...Typography.h4,
    color: Colors.primary,
    fontWeight: '600',
  },
  settingsContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  settingsSection: {
    marginBottom: Spacing.md,
  },
  sectionCard: {
    padding: Spacing.lg,
    borderRadius: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: Spacing.md,
    elevation: 6,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  saveButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  resetButtonText: {
    ...Typography.button,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  appInfoContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  appInfoCard: {
    padding: Spacing.lg,
    borderRadius: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: Colors.surfaceLight,
  },
  appInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appInfoIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  appInfoText: {
    flex: 1,
  },
  appInfoTitle: {
    ...Typography.h5,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  appInfoVersion: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  appInfoDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
