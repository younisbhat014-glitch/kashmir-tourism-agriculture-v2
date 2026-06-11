import { Image, StyleSheet, Text, View } from 'react-native';
import { CatalogItem } from '@/services/api-client';
import { colors } from '@/constants/app-theme';

function getPrice(item: CatalogItem) {
  const value = item.pricePerDay ?? item.rentPerDay ?? item.price;
  if (value === undefined) return item.type || item.category || 'Available';
  return `Rs ${value}${item.pricePerDay || item.rentPerDay ? '/day' : ''}`;
}

export function CatalogCard({ item }: { item: CatalogItem }) {
  return (
    <View style={styles.card}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : <View style={styles.placeholder} />}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta} numberOfLines={1}>{item.location || item.type || item.category || 'Kashmir'}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{getPrice(item)}</Text>
          {item.rating ? <Text style={styles.rating}>★ {item.rating}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 18, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  image: { width: '100%', height: 180, backgroundColor: colors.mist },
  placeholder: { width: '100%', height: 120, backgroundColor: colors.mist },
  body: { padding: 15 },
  name: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  meta: { color: colors.muted, marginTop: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  price: { color: colors.teal, fontWeight: '800' },
  rating: { color: '#9A7411', fontWeight: '700' },
});
