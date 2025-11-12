
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLocalization();

  const handleSignOut = () => {
    Alert.alert(
      t('auth.signOut'),
      'Are you sure you want to sign out?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.signOut'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      t('profile.language'),
      'Select Language / Selecione o Idioma',
      [
        {
          text: 'English',
          onPress: () => setLanguage('en'),
        },
        {
          text: 'Português',
          onPress: () => setLanguage('pt'),
        },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  if (!user) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="person.circle"
          android_material_icon_name="account_circle"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.text, styles.notSignedInText]}>
          Please sign in to view your profile
        </Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push('/auth')}
        >
          <Text style={styles.signInButtonText}>{t('auth.signIn')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol
            ios_icon_name="person.circle.fill"
            android_material_icon_name="account_circle"
            size={80}
            color={colors.primary}
          />
          <Text style={styles.email}>{user.email}</Text>
          {user.phone && <Text style={styles.phone}>{user.phone}</Text>}
        </View>

        <View style={commonStyles.card}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>{t('profile.subscription')}</Text>
            <View style={[
              styles.statusBadge,
              user.isPremium && styles.premiumBadge,
            ]}>
              <Text style={[
                styles.statusText,
                user.isPremium && styles.premiumText,
              ]}>
                {user.isPremium ? t('profile.premium') : t('profile.free')}
              </Text>
            </View>
          </View>

          {!user.isPremium && (
            <View style={styles.searchesInfo}>
              <Text style={styles.searchesLabel}>
                {t('search.searchesRemaining').replace('{{count}}', user.searchesRemaining.toString())}
              </Text>
            </View>
          )}

          {!user.isPremium && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/subscription')}
            >
              <IconSymbol
                ios_icon_name="crown.fill"
                android_material_icon_name="workspace_premium"
                size={20}
                color={colors.text}
              />
              <Text style={styles.upgradeButtonText}>
                {t('profile.upgradeToPremium')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLanguageChange}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="globe"
                android_material_icon_name="language"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>{t('profile.language')}</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>
                {language === 'en' ? 'English' : 'Português'}
              </Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={20}
                color={colors.textSecondary}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Support', 'Contact: support@oilmaps.com')}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="questionmark.circle"
                android_material_icon_name="help"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>{t('profile.support')}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content here')}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="lock.shield"
                android_material_icon_name="privacy_tip"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>{t('profile.privacy')}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <IconSymbol
            ios_icon_name="rectangle.portrait.and.arrow.right"
            android_material_icon_name="logout"
            size={20}
            color={colors.error}
          />
          <Text style={styles.signOutButtonText}>{t('auth.signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  email: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  phone: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  premiumBadge: {
    backgroundColor: colors.accent,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  premiumText: {
    color: colors.background,
  },
  searchesInfo: {
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchesLabel: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  notSignedInText: {
    marginTop: 16,
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
