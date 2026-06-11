import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components/screen-header';
import { colors } from '@/constants/app-theme';
import { Booking, bookingApi } from '@/services/api-client';

export default function BookingsScreen() {
  const [items, setItems] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      setItems(await bookingApi.mine());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load bookings');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cancel = async (id: string) => {
    await bookingApi.cancel(id);
    setItems((current) => current.filter((item) => item._id !== id));
  };

  return (
    <View style={styles.page}>
      <ScreenHeader title="My Bookings" subtitle="Your saved Kashmir experiences" />
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.itemName || item.type || 'Booking'}</Text>
            <Text style={styles.meta}>Status: {item.status || 'confirmed'}</Text>
            <Pressable onPress={() => cancel(item._id)}><Text style={styles.cancel}>Cancel booking</Text></Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>{error || 'No bookings yet. Pull down to refresh.'}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.mist },
  content: { padding: 16, flexGrow: 1 },
  card: { backgroundColor: colors.white, borderRadius: 18, padding: 17, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  name: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  meta: { color: colors.muted, marginTop: 6 },
  cancel: { color: colors.danger, fontWeight: '700', marginTop: 14 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 50 },
});
