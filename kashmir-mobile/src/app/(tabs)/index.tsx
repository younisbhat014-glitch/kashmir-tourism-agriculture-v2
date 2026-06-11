import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';

const features = [
  ['Tourism', 'Hotels, restaurants and vehicles', '/(tabs)/tourism'],
  ['Agriculture', 'Fresh crops and farm machines', '/(tabs)/agriculture'],
  ['Bookings', 'Manage your Kashmir journey', '/(tabs)/bookings'],
] as const;

export default function HomeScreen() {
  const { user } = useAuth();
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <LinearGradient colors={[colors.deep, colors.teal]} style={styles.hero}>
        <SafeAreaView edges={['top']}>
          <Text style={styles.kicker}>AADAB, {user?.name?.toUpperCase()}</Text>
          <Text style={styles.title}>Discover Kashmir{'\n'}in one beautiful app.</Text>
          <Text style={styles.subtitle}>Tourism, agriculture, bookings and trusted local services.</Text>
        </SafeAreaView>
      </LinearGradient>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore the portal</Text>
        {features.map(([title, description, href]) => (
          <Pressable key={title} onPress={() => router.push(href)} style={styles.feature}>
            <View><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureText}>{description}</Text></View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
        {user?.role === 'admin' ? <View style={styles.adminNote}><Text style={styles.adminTitle}>Admin account connected</Text><Text style={styles.adminText}>Full mobile admin management is the next implementation phase.</Text></View> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.mist },
  content: { paddingBottom: 30 },
  hero: { paddingHorizontal: 22, paddingBottom: 42, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  kicker: { color: colors.gold, fontWeight: '800', letterSpacing: 1.2, marginTop: 18 },
  title: { color: colors.white, fontSize: 38, lineHeight: 45, fontWeight: '800', marginTop: 16 },
  subtitle: { color: '#D3E9E4', fontSize: 16, lineHeight: 24, marginTop: 14 },
  section: { padding: 18 },
  sectionTitle: { color: colors.ink, fontSize: 22, fontWeight: '800', marginVertical: 8 },
  feature: { backgroundColor: colors.white, padding: 18, borderRadius: 18, marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border },
  featureTitle: { color: colors.deep, fontSize: 18, fontWeight: '800' },
  featureText: { color: colors.muted, marginTop: 5 },
  arrow: { color: colors.gold, fontSize: 38 },
  adminNote: { backgroundColor: '#FFF4CF', padding: 17, borderRadius: 18, marginTop: 18 },
  adminTitle: { color: colors.deep, fontWeight: '800' },
  adminText: { color: colors.muted, marginTop: 5, lineHeight: 20 },
});
