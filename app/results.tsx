
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useLocalization } from '@/contexts/LocalizationContext';
import { DatabaseService, OilSpecification } from '@/utils/database';
import { useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export default function ResultsScreen() {
  const { t } = useLocalization();
  const params = useLocalSearchParams();
  const db = DatabaseService.getInstance();

  const [specifications, setSpecifications] = useState<OilSpecification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const brandId = Number(params.brandId);
      const modelId = Number(params.modelId);
      const yearId = Number(params.yearId);
      const versionId = params.versionId ? Number(params.versionId) : undefined;

      const specs = await db.searchOilSpecs(brandId, modelId, yearId, versionId);
      setSpecifications(specs);
    } catch (error) {
      console.log('Error loading results:', error);
      Alert.alert(t('common.error'), 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const message = specifications
        .map(spec => {
          const lines = [
            `${t(`results.${spec.component}`)}:`,
            spec.api && `API: ${spec.api}`,
            spec.acea && `ACEA: ${spec.acea}`,
            spec.dexos && `Dexos: ${spec.dexos}`,
            spec.viscosity && `Viscosity: ${spec.viscosity}`,
            spec.oem && `OEM: ${spec.oem}`,
            spec.notes && `Notes: ${spec.notes}`,
          ].filter(Boolean).join('\n');
          return lines;
        })
        .join('\n\n');

      await Share.share({
        message: `${t('results.title')}\n\n${message}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const groupedSpecs = specifications.reduce((acc, spec) => {
    if (!acc[spec.component]) {
      acc[spec.component] = [];
    }
    acc[spec.component].push(spec);
    return acc;
  }, {} as Record<string, OilSpecification[]>);

  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (specifications.length === 0) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="exclamationmark.triangle"
          android_material_icon_name="warning"
          size={64}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.text, styles.noResultsText]}>
          {t('results.noResults')}
        </Text>
        <TouchableOpacity
          style={[buttonStyles.primary, styles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={buttonStyles.text}>Back to Search</Text>
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
          <Text style={styles.title}>{t('results.title')}</Text>
        </View>

        {Object.entries(groupedSpecs).map(([component, specs]) => (
          <View key={component} style={commonStyles.card}>
            <View style={styles.componentHeader}>
              <IconSymbol
                ios_icon_name={
                  component === 'engine' ? 'engine.combustion' :
                  component === 'gearbox' ? 'gearshape' :
                  'gear'
                }
                android_material_icon_name={
                  component === 'engine' ? 'settings' :
                  component === 'gearbox' ? 'settings' :
                  'settings'
                }
                size={24}
                color={colors.accent}
              />
              <Text style={styles.componentTitle}>
                {t(`results.${component}`)}
              </Text>
            </View>

            {specs.map((spec, index) => (
              <View key={index} style={styles.specSection}>
                {spec.api && (
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>API:</Text>
                    <Text style={styles.specValue}>{spec.api}</Text>
                  </View>
                )}
                {spec.acea && (
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>ACEA:</Text>
                    <Text style={styles.specValue}>{spec.acea}</Text>
                  </View>
                )}
                {spec.dexos && (
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Dexos:</Text>
                    <Text style={styles.specValue}>{spec.dexos}</Text>
                  </View>
                )}
                {spec.viscosity && (
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>Viscosity:</Text>
                    <Text style={styles.specValue}>{spec.viscosity}</Text>
                  </View>
                )}
                {spec.oem && (
                  <View style={styles.specRow}>
                    <Text style={styles.specLabel}>OEM:</Text>
                    <Text style={styles.specValue}>{spec.oem}</Text>
                  </View>
                )}
                {spec.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{spec.notes}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity
          style={[buttonStyles.primary, styles.shareButton]}
          onPress={handleShare}
        >
          <IconSymbol
            ios_icon_name="square.and.arrow.up"
            android_material_icon_name="share"
            size={20}
            color={colors.text}
          />
          <Text style={[buttonStyles.text, styles.shareButtonText]}>
            {t('results.share')}
          </Text>
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
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  componentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  componentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  specSection: {
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  shareButtonText: {
    marginLeft: 8,
  },
  noResultsText: {
    marginTop: 16,
    marginBottom: 24,
  },
});
