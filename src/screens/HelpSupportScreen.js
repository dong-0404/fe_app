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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');

export default function HelpSupportScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  
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

  const faqData = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products, select your desired items, choose size and color, then proceed to checkout. You can pay using various payment methods including credit cards and digital wallets.',
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard), digital wallets (MoMo, VNPay), and bank transfers. All payments are secure and encrypted.',
    },
    {
      id: 3,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days within Ho Chi Minh City and 5-7 business days for other cities. Express shipping is available for 1-2 business days.',
    },
    {
      id: 4,
      question: 'Can I return or exchange items?',
      answer: 'Yes, we offer a 30-day return policy for unused items in original packaging. Exchanges are available for different sizes or colors within 14 days of purchase.',
    },
    {
      id: 5,
      question: 'How do I track my order?',
      answer: 'You can track your order by going to "My Orders" in your profile. We will also send you SMS and email updates about your order status.',
    },
    {
      id: 6,
      question: 'Do you offer size guides?',
      answer: 'Yes, we provide detailed size guides for all shoe brands. You can find them on each product page or in our size guide section.',
    },
  ];

  const contactMethods = [
    {
      id: 1,
      title: 'Customer Service',
      description: 'Get help with orders and general inquiries',
      icon: '📞',
      action: () => Linking.openURL('tel:+84901234567'),
      color: Colors.primary,
    },
    {
      id: 2,
      title: 'Email Support',
      description: 'Send us an email for detailed assistance',
      icon: '📧',
      action: () => Linking.openURL('mailto:support@shoestore.com'),
      color: Colors.info,
    },
    {
      id: 3,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: '💬',
      action: () => Alert.alert('Live Chat', 'Live chat feature will be available soon'),
      color: Colors.success,
    },
    {
      id: 4,
      title: 'WhatsApp',
      description: 'Message us on WhatsApp for quick support',
      icon: '📱',
      action: () => Linking.openURL('https://wa.me/84901234567'),
      color: Colors.accent,
    },
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactMethod = (method) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      method.action();
    }, 500);
  };

  const renderFAQItem = (faq) => (
    <Animated.View
      key={faq.id}
      style={[
        styles.faqItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => toggleFAQ(faq.id)}
      >
        <Text style={styles.faqQuestionText}>{faq.question}</Text>
        <Text style={styles.faqIcon}>
          {expandedFAQ === faq.id ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      {expandedFAQ === faq.id && (
        <Animated.View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{faq.answer}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );

  const renderContactMethod = (method) => (
    <Animated.View
      key={method.id}
      style={[
        styles.contactMethod,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.contactMethodCard, { borderLeftColor: method.color }]}
        onPress={() => handleContactMethod(method)}
        disabled={loading}
      >
        <View style={styles.contactMethodContent}>
          <Text style={styles.contactMethodIcon}>{method.icon}</Text>
          <View style={styles.contactMethodText}>
            <Text style={styles.contactMethodTitle}>{method.title}</Text>
            <Text style={styles.contactMethodDescription}>{method.description}</Text>
          </View>
          <Text style={styles.contactMethodArrow}>›</Text>
        </View>
      </TouchableOpacity>
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
                <Text style={styles.backText}>Help & Support</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Welcome Card */}
          <Animated.View
            style={[
              styles.welcomeContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.welcomeCard}>
              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeIcon}>🤝</Text>
                <Text style={styles.welcomeTitle}>How can we help you?</Text>
                <Text style={styles.welcomeSubtitle}>
                  We're here to assist you with any questions or concerns you may have.
                </Text>
              </View>
            </Card>
          </Animated.View>

          {/* Contact Methods */}
          <Animated.View
            style={[
              styles.contactContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Contact Us</Text>
            {contactMethods.map(renderContactMethod)}
          </Animated.View>

          {/* FAQ Section */}
          <Animated.View
            style={[
              styles.faqContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <Card style={styles.faqCard}>
              {faqData.map(renderFAQItem)}
            </Card>
          </Animated.View>

          {/* Business Hours */}
          <Animated.View
            style={[
              styles.businessHoursContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.businessHoursCard}>
              <View style={styles.businessHoursContent}>
                <Text style={styles.businessHoursIcon}>🕒</Text>
                <View style={styles.businessHoursText}>
                  <Text style={styles.businessHoursTitle}>Business Hours</Text>
                  <Text style={styles.businessHoursTime}>
                    Monday - Friday: 8:00 AM - 10:00 PM{'\n'}
                    Saturday - Sunday: 9:00 AM - 9:00 PM
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Loading Overlay */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <LoadingSpinner size="medium" color={Colors.primary} text="Connecting..." />
            </View>
          )}
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
  welcomeContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  welcomeCard: {
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
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  welcomeTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  contactContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  contactMethod: {
    marginBottom: Spacing.sm,
  },
  contactMethodCard: {
    padding: Spacing.lg,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderLeftWidth: 4,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactMethodIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  contactMethodText: {
    flex: 1,
  },
  contactMethodTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  contactMethodDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  contactMethodArrow: {
    ...Typography.h4,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  faqContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  faqCard: {
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
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  faqQuestionText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.md,
  },
  faqIcon: {
    ...Typography.h4,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  faqAnswer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  faqAnswerText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  businessHoursContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  businessHoursCard: {
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
  businessHoursContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  businessHoursIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  businessHoursText: {
    flex: 1,
  },
  businessHoursTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  businessHoursTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
