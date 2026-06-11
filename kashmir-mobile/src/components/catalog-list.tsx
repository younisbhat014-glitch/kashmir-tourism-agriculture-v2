import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { CatalogCard } from '@/components/catalog-card';
import { LoadingScreen } from '@/components/loading-screen';
import { colors } from '@/constants/app-theme';
import { CatalogItem } from '@/services/api-client';

export function CatalogList({ loader }: { loader: () => Promise<CatalogItem[]> }) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      setItems(await loader());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loader]);

  useEffect(() => { load(); }, [load]);
  if (loading) return <LoadingScreen label="Loading live data..." />;

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <CatalogCard item={item} />}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>{error || 'No items available yet'}</Text><Text style={styles.emptyText}>Pull down to refresh.</Text></View>}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32, backgroundColor: colors.mist, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyTitle: { color: colors.ink, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  emptyText: { color: colors.muted, marginTop: 8 },
});
