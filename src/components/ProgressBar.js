import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/colors';

export default function ProgressBar({ 
  progress = 0, 
  height = 6, 
  backgroundColor = Colors.lightGray,
  progressColor = Colors.primary,
  showPercentage = false,
  animated = true,
  duration = 1000
}) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Progress animation
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress / 100,
        duration: duration,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progress / 100);
    }
  }, [progress, animated, duration]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.progressBar, { height, backgroundColor }]}>
        <Animated.View
          style={[
            styles.progress,
            {
              height,
              backgroundColor: progressColor,
              width: progressWidth,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentageText}>
          {Math.round(progress)}%
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    borderRadius: 3,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  progress: {
    borderRadius: 3,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  percentageText: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontWeight: '600',
  },
});
