
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export default function SubscriptionScreen() {
  const { updatePremiumStatus } = useAuth();
  const { t } = useLocalization();

  const handleSubscribe = async () => {
    Alert.alert(
      'Payment',
      'In a production app, this would integrate with a payment provider. For now, we will activate Premium.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: async () => {
            try {
              // Calculate expiry date (1 month from now)
              const expiryDate = new Date();
              expiryDate.setMonth(expiryDate.getMonth() + 1);
              
              await updatePremiumStatus(true, expiryDate.toISOString());
              
              Alert.alert(
                t('common.success'),
                'Premium activated successfully!',
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } catch (error) {
              console.log('Subscription error:', error);
              Alert.alert(t('common.error'), 'Failed to activate Premium');
            }
          },
        },
      ]
    );
  };

  const features = [
    t('sub.feature1'),
    t('sub.feature2'),
    t('sub.feature3'),
    t('sub.feature4'),
  ];

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <IconSymbol
            ios_icon_name="crown.fill"
            android_material_icon_name="workspace_premium"
            size={80}
            color={colors.accent}
          />
          <Text style={styles.title}>{t('sub.title')}</Text>
          <Text style={styles.subtitle}>{t('sub.unlimited')}</Text>
        </View>

        <View style={commonStyles.card}>
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>{t('sub.price')}</Text>
            <Text style={styles.promoLabel}>{t('sub.promo')}</Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>{t('sub.features')}</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.accent}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[buttonStyles.primary, styles.subscribeButton]}
          onPress={handleSubscribe}
        >
          <Text style={buttonStyles.text}>{t('sub.subscribe')}</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Subscription will auto-renew monthly. Cancel anytime.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  priceSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  promoLabel: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  subscribeButton: {
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
