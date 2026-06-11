import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CatalogList } from '@/components/catalog-list';
import { ScreenHeader } from '@/components/screen-header';
import { catalogApi } from '@/services/api-client';
import { colors } from '@/constants/app-theme';

const tabs = ['hotels', 'restaurants', 'vehicles'] as const;

export default function TourismScreen() {
  const [active, setActive] = useState<(typeof tabs)[number]>('hotels');
  return (
    <View style={styles.page}>
      <ScreenHeader title="Tourism" subtitle="Stay, eat and travel across Kashmir" />
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <Pressable key={tab} onPress={() => setActive(tab)} style={[styles.tab, active === tab && styles.activeTab]}>
            <Text style={[styles.tabText, active === tab && styles.activeText]}>{tab}</Text>
          </Pressable>
        ))}
      </View>
      <CatalogList loader={catalogApi[active]} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  tabs: { flexDirection: 'row', gap: 7, padding: 12, backgroundColor: colors.cream },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 16, alignItems: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  activeTab: { backgroundColor: colors.teal },
  tabText: { color: colors.muted, textTransform: 'capitalize', fontSize: 12, fontWeight: '700' },
  activeText: { color: colors.white },
});
