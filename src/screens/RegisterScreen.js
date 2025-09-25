import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Snackbar } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { register, isLoading, clearError } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const showError = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword, full_name } = formData;

    if (!email || !password || !confirmPassword || !full_name) {
      showError('Please fill in all required fields');
      return false;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    clearError();

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success !== false) {
      navigation.replace(ROUTES.MAIN_APP);
    } else {
      let errorMessage = result.message || 'Registration failed';
      if (result.error && result.error.errors) {
        const validationErrors = result.error.errors.map(err => 
          `• ${err.path || err.field}: ${err.msg || err.message}`
        ).join('\n');
        errorMessage = `Please fix the following issues:\n${validationErrors}`;
      }
      showError(errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.gradient}>
        {/* Background decorative elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
          <View style={[styles.decorativeCircle, styles.circle3]} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  <Text style={styles.backText}>Back</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim },
                  ],
                },
              ]}
            >
              <View style={styles.logoWrapper}>
                <Text style={styles.logo}>👟</Text>
                <View style={styles.logoGlow} />
              </View>
              <Text style={styles.appName}>Create Account</Text>
              <Text style={styles.subtitle}>Join us and start shopping</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Card style={styles.registerCard}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name *</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={Colors.textLight}
                      value={formData.full_name}
                      onChangeText={(value) => handleInputChange('full_name', value)}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email Address *</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={Colors.textLight}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>📱</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your phone number"
                      placeholderTextColor={Colors.textLight}
                      value={formData.phone}
                      onChangeText={(value) => handleInputChange('phone', value)}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password *</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor={Colors.textLight}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password *</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor={Colors.textLight}
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <LoadingSpinner size="small" color={Colors.primary} text="Creating account..." />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                    disabled={isLoading}
                  >
                    <Text style={styles.registerButtonText}>Create Account</Text>
                  </TouchableOpacity>
                )}
              </Card>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          style={{ backgroundColor: '#323232' }}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
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
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.white,
    opacity: 0.1,
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    right: 50,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: Spacing.md,
  },
  header: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backIcon: {
    fontSize: 18,
    color: Colors.primary,
    marginRight: Spacing.xs,
  },
  backText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  logo: {
    fontSize: 80,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 50,
    backgroundColor: Colors.white,
    opacity: 0.2,
    zIndex: -1,
  },
  appName: {
    ...Typography.h1,
    color: Colors.white,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.white,
    opacity: 0.9,
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  registerCard: {
    padding: Spacing.xl,
    borderRadius: 25,
    elevation: 12,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    backgroundColor: Colors.white,
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderRadius: 15,
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  eyeIcon: {
    fontSize: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: Spacing.md,
    elevation: 6,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  registerButtonText: {
    ...Typography.button,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  loginText: {
    ...Typography.body,
    color: Colors.white,
    marginRight: Spacing.xs,
    opacity: 0.9,
  },
  loginLink: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

