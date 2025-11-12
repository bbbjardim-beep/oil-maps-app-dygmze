
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { t } = useLocalization();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), 'Please fill in all required fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert(t('common.error'), 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, phone);
        Alert.alert(
          t('common.success'),
          'Account created! You have 3 free searches.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)/(home)/') }]
        );
      } else {
        await signIn(email, password);
        router.replace('/(tabs)/(home)/');
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <IconSymbol
            ios_icon_name="drop.fill"
            android_material_icon_name="water_drop"
            size={64}
            color={colors.primary}
          />
          <Text style={styles.title}>OilMaps</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? t('auth.signUp') : t('auth.signIn')}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={commonStyles.input}
            placeholder={t('auth.email')}
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {isSignUp && (
            <TextInput
              style={commonStyles.input}
              placeholder={t('auth.phone')}
              placeholderTextColor={colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          )}

          <TextInput
            style={commonStyles.input}
            placeholder={t('auth.password')}
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {isSignUp && (
            <TextInput
              style={commonStyles.input}
              placeholder={t('auth.confirmPassword')}
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          )}

          <TouchableOpacity
            style={[buttonStyles.primary, styles.authButton]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={buttonStyles.text}>
              {loading
                ? t('common.loading')
                : isSignUp
                ? t('auth.signUp')
                : t('auth.signIn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchText}>
              {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}
            </Text>
            <Text style={styles.switchTextBold}>
              {isSignUp ? t('auth.signIn') : t('auth.signUp')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  authButton: {
    marginTop: 8,
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  switchTextBold: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
