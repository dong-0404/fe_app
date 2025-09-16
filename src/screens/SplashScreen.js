import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import ProgressBar from '../components/ProgressBar';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    // Loading text sequence
    const textSequence = [
      { text: 'Initializing...', delay: 0 },
      { text: 'Loading products...', delay: 800 },
      { text: 'Setting up store...', delay: 1600 },
      { text: 'Almost ready...', delay: 2400 },
    ];

    // Update loading text
    textSequence.forEach(({ text, delay }) => {
      setTimeout(() => setLoadingText(text), delay);
    });

    // Animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Pulse animation for logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Navigate to main app after 3.5 seconds
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.MAIN_APP);
    }, 3500);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, []);


  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.gradient}>
        {/* Background decorative elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
          <View style={[styles.decorativeCircle, styles.circle3]} />
        </View>

        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <Text style={styles.logo}>👟</Text>
            <View style={styles.logoGlow} />
          </View>
          <Text style={styles.appName}>ShoeStore</Text>
          <Text style={styles.tagline}>Your Perfect Shoes Await</Text>
        </Animated.View>
        
        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <View style={styles.loadingBarContainer}>
            <ProgressBar 
              progress={100}
              height={8}
              backgroundColor="rgba(255, 255, 255, 0.2)"
              progressColor={Colors.white}
              animated={true}
              duration={3000}
            />
            <View style={styles.loadingDots}>
              <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
              <Animated.View style={[styles.dot, { opacity: fadeAnim }]} />
            </View>
          </View>
          <Text style={styles.loadingText}>{loadingText}</Text>
        </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    zIndex: 10,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  logo: {
    fontSize: 100,
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
    borderRadius: 60,
    backgroundColor: Colors.white,
    opacity: 0.2,
    zIndex: -1,
  },
  appName: {
    ...Typography.h1,
    color: Colors.white,
    fontSize: 42,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  tagline: {
    ...Typography.body,
    color: Colors.white,
    fontSize: 18,
    opacity: 0.9,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: Spacing.xxl,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  loadingBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginHorizontal: 4,
    opacity: 0.6,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.white,
    opacity: 0.9,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
