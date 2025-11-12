
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { CustomDropdown } from '@/components/CustomDropdown';
import { DatabaseService, VehicleBrand, VehicleModel, VehicleYear, VehicleVersion } from '@/utils/database';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export default function SearchScreen() {
  const { user, decrementSearches } = useAuth();
  const { t } = useLocalization();
  const db = DatabaseService.getInstance();

  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [years, setYears] = useState<VehicleYear[]>([]);
  const [versions, setVersions] = useState<VehicleVersion[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    const brandsData = await db.getBrands();
    setBrands(brandsData);
  };

  const handleBrandChange = async (brandId: number) => {
    setSelectedBrand(brandId);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedVersion(null);
    setModels([]);
    setYears([]);
    setVersions([]);

    const modelsData = await db.getModelsByBrand(brandId);
    setModels(modelsData);
  };

  const handleModelChange = async (modelId: number) => {
    setSelectedModel(modelId);
    setSelectedYear(null);
    setSelectedVersion(null);
    setYears([]);
    setVersions([]);

    const yearsData = await db.getYearsByModel(modelId);
    setYears(yearsData);
  };

  const handleYearChange = async (yearId: number) => {
    setSelectedYear(yearId);
    setSelectedVersion(null);
    setVersions([]);

    const versionsData = await db.getVersionsByYear(yearId);
    setVersions(versionsData);
  };

  const handleSearch = async () => {
    if (!selectedBrand || !selectedModel || !selectedYear) {
      Alert.alert(
        t('common.error'),
        'Please select at least Brand, Model, and Year'
      );
      return;
    }

    if (!user?.isPremium && user?.searchesRemaining === 0) {
      Alert.alert(
        t('common.error'),
        'You have no searches remaining. Please upgrade to Premium.',
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('profile.upgradeToPremium'),
            onPress: () => router.push('/subscription'),
          },
        ]
      );
      return;
    }

    try {
      await decrementSearches();

      router.push({
        pathname: '/results',
        params: {
          brandId: selectedBrand,
          modelId: selectedModel,
          yearId: selectedYear,
          versionId: selectedVersion || '',
        },
      });
    } catch (error) {
      console.log('Search error:', error);
      Alert.alert(t('common.error'), 'Failed to perform search');
    }
  };

  const canSearch = selectedBrand && selectedModel && selectedYear;

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('search.title')}</Text>
          <Text style={styles.subtitle}>{t('search.subtitle')}</Text>
          
          {user && (
            <View style={styles.searchesCard}>
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search"
                size={24}
                color={colors.accent}
              />
              <Text style={styles.searchesText}>
                {user.isPremium
                  ? t('search.unlimitedSearches')
                  : t('search.searchesRemaining').replace('{{count}}', user.searchesRemaining.toString())}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <CustomDropdown
            label={t('search.brand')}
            placeholder={t('search.selectBrand')}
            items={brands.map(b => ({ label: b.name, value: b.id }))}
            value={selectedBrand}
            onValueChange={(value) => handleBrandChange(value as number)}
          />

          <CustomDropdown
            label={t('search.model')}
            placeholder={t('search.selectModel')}
            items={models.map(m => ({ label: m.name, value: m.id }))}
            value={selectedModel}
            onValueChange={(value) => handleModelChange(value as number)}
            disabled={!selectedBrand}
          />

          <CustomDropdown
            label={t('search.year')}
            placeholder={t('search.selectYear')}
            items={years.map(y => ({ label: y.year.toString(), value: y.id }))}
            value={selectedYear}
            onValueChange={(value) => handleYearChange(value as number)}
            disabled={!selectedModel}
          />

          <CustomDropdown
            label={t('search.version')}
            placeholder={t('search.selectVersion')}
            items={versions.map(v => ({ label: v.name, value: v.id }))}
            value={selectedVersion}
            onValueChange={(value) => setSelectedVersion(value as number)}
            disabled={!selectedYear || versions.length === 0}
          />

          <TouchableOpacity
            style={[
              buttonStyles.primary,
              styles.searchButton,
              !canSearch && styles.disabledButton,
            ]}
            onPress={handleSearch}
            disabled={!canSearch}
          >
            <Text style={buttonStyles.text}>{t('search.searchButton')}</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  searchesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchesText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  form: {
    marginBottom: 24,
  },
  searchButton: {
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
