import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CatalogItem } from '@/services/api-client';
import { colors } from '@/constants/app-theme';

function getPrice(item: CatalogItem) {
  const value = item.pricePerDay ?? item.rentPerDay ?? item.price;
  if (value === undefined) return item.type || item.category || 'Available';
  return `Rs ${value}${item.pricePerDay || item.rentPerDay ? '/day' : item.unit ? `/${item.unit}` : ''}`;
}

export function CatalogCard({ item }: { item: CatalogItem }) {
  return (
    <View style={styles.card}>
      <View>
        {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : <View style={styles.placeholder} />}
        <View style={styles.badge}><Text style={styles.badgeText}>{item.location || item.category || item.type || 'Kashmir'}</Text></View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta} numberOfLines={2}>{item.description || item.specialty || item.cuisine || 'Authentic Kashmir experience'}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{getPrice(item)}</Text>
          {item.rating ? <View style={styles.ratingPill}><Ionicons name="star" color={colors.gold} size={13} /><Text style={styles.rating}>{item.rating}</Text></View> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 24, overflow: 'hidden', marginBottom: 17, borderWidth: 1, borderColor: colors.border, shadowColor: colors.deep, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  image: { width: '100%', height: 195, backgroundColor: colors.mist },
  placeholder: { width: '100%', height: 145, backgroundColor: colors.mist },
  badge: { position: 'absolute', bottom: 12, left: 12, borderRadius: 14, backgroundColor: 'rgba(7,74,56,0.88)', paddingHorizontal: 11, paddingVertical: 6 },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  body: { padding: 16 },
  name: { color: colors.deep, fontSize: 22, fontFamily: 'serif', fontWeight: '800' },
  meta: { color: colors.muted, marginTop: 5, lineHeight: 19 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  price: { color: colors.teal, fontSize: 16, fontWeight: '900' },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.cream, borderRadius: 14, paddingHorizontal: 9, paddingVertical: 5 },
  rating: { color: colors.deep, fontWeight: '800' },
});
