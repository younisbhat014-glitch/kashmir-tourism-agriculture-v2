import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CatalogList } from '@/components/catalog-list';
import { ScreenHeader } from '@/components/screen-header';
import { catalogApi } from '@/services/api-client';
import { colors } from '@/constants/app-theme';

export default function AgricultureScreen() {
  const [active, setActive] = useState<'crops' | 'machines'>('crops');
  return (
    <View style={styles.page}>
      <ScreenHeader title="Agriculture" subtitle="Kashmir farms and equipment marketplace" />
      <View style={styles.tabs}>
        {(['crops', 'machines'] as const).map((tab) => (
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
  tabs: { flexDirection: 'row', gap: 8, padding: 12, backgroundColor: colors.cream },
  tab: { flex: 1, paddingVertical: 11, borderRadius: 16, alignItems: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  activeTab: { backgroundColor: colors.teal },
  tabText: { color: colors.muted, textTransform: 'capitalize', fontWeight: '700' },
  activeText: { color: colors.white },
});
