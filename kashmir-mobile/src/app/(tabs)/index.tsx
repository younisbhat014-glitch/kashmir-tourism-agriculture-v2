import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from '@/components/brand-mark';
import { CatalogCard } from '@/components/catalog-card';
import { colors, destinations, heroSlides, homeStats } from '@/constants/app-theme';
import { catalogApi, CatalogItem } from '@/services/api-client';

export default function HomeScreen() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [featured, setFeatured] = useState<CatalogItem[]>([]);
  const slide = heroSlides[slideIndex];

  useEffect(() => {
    const timer = setInterval(() => setSlideIndex((current) => (current + 1) % heroSlides.length), 5500);
    catalogApi.hotels().then((items) => setFeatured(items.slice(0, 3))).catch(() => undefined);
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ImageBackground source={{ uri: slide.image }} style={styles.hero} imageStyle={styles.heroImage}>
        <LinearGradient colors={['rgba(4,48,40,0.45)', 'rgba(5,42,35,0.72)', 'rgba(5,42,35,0.34)']} style={styles.overlay}>
          <SafeAreaView edges={['top']} style={styles.heroSafe}>
            <BrandMark />
            <View style={styles.floating}>
              <Image source={{ uri: slide.thumbnail }} style={styles.floatingImage} />
              <Text style={styles.floatingLocation}>{slide.location}</Text>
            </View>
            <View style={styles.heroCopy}>
              <View style={styles.badge}><Text style={styles.badgeText}>{slide.eyebrow}</Text></View>
              <Text style={styles.heroTitle}>{slide.title}</Text>
              <Text style={styles.heroAccent}>{slide.accent}</Text>
              <Text style={styles.heroDescription}>Discover breathtaking Kashmir, from snow-capped peaks to fragrant saffron fields.</Text>
              <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/tourism')}>
                <Ionicons name="map" size={19} color={colors.deep} /><Text style={styles.primaryText}>Explore Tourism</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => router.push('/(tabs)/agriculture')}>
                <Ionicons name="leaf" size={19} color={colors.white} /><Text style={styles.secondaryText}>Agriculture Hub</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.stats}>
        {homeStats.map(([value, label]) => <View style={styles.stat} key={label}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>)}
      </View>

      <View style={styles.section}>
        <Text style={styles.eyebrow}>EXPLORE THE VALLEY</Text>
        <Text style={styles.sectionTitle}>Must Visit Kashmir</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
          {destinations.map(([name, location, image]) => (
            <ImageBackground key={name} source={{ uri: image }} style={styles.destination} imageStyle={styles.destinationImage}>
              <LinearGradient colors={['transparent', 'rgba(3,40,33,0.86)']} style={styles.destinationShade}>
                <Text style={styles.destinationName}>{name}</Text><Text style={styles.destinationLocation}>{location}</Text>
              </LinearGradient>
            </ImageBackground>
          ))}
        </ScrollView>
      </View>

      {featured.length ? <View style={styles.section}><Text style={styles.eyebrow}>TRUSTED STAYS</Text><Text style={styles.sectionTitle}>Featured Hotels</Text>{featured.map((item) => <CatalogCard item={item} key={item._id} />)}</View> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: 28 },
  hero: { minHeight: 670, backgroundColor: colors.deep },
  heroImage: { resizeMode: 'cover' },
  overlay: { flex: 1 },
  heroSafe: { flex: 1, paddingHorizontal: 20, paddingBottom: 28 },
  floating: { position: 'absolute', top: 92, right: 19, width: 112, padding: 7, borderRadius: 24, backgroundColor: 'rgba(225,235,231,0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  floatingImage: { width: 96, height: 105, borderRadius: 18, borderWidth: 2, borderColor: colors.gold },
  floatingLocation: { color: colors.deep, fontFamily: 'serif', fontWeight: '800', textAlign: 'center', fontSize: 11, marginTop: 6 },
  heroCopy: { marginTop: 'auto' },
  badge: { alignSelf: 'flex-start', borderRadius: 18, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: 'rgba(30,80,66,0.62)', borderWidth: 1, borderColor: colors.gold, maxWidth: '72%' },
  badgeText: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1.25 },
  heroTitle: { color: colors.white, fontSize: 43, lineHeight: 48, fontFamily: 'serif', fontWeight: '700', marginTop: 18, maxWidth: '95%' },
  heroAccent: { color: colors.gold, fontSize: 34, lineHeight: 39, fontFamily: 'serif', fontStyle: 'italic', fontWeight: '700', maxWidth: '95%' },
  heroDescription: { color: colors.white, fontSize: 15, lineHeight: 23, marginTop: 12, maxWidth: '95%' },
  primaryButton: { marginTop: 19, height: 55, borderRadius: 29, backgroundColor: colors.gold, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: colors.deep, fontSize: 17, fontWeight: '900' },
  secondaryButton: { marginTop: 11, height: 55, borderRadius: 29, borderWidth: 2, borderColor: colors.white, backgroundColor: 'rgba(255,255,255,0.12)', flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: colors.white, fontSize: 17, fontWeight: '800' },
  stats: { flexDirection: 'row', paddingVertical: 18, paddingHorizontal: 5, backgroundColor: '#FBFAF4' },
  stat: { flex: 1, alignItems: 'center', paddingHorizontal: 3 },
  statValue: { color: colors.teal, fontFamily: 'serif', fontWeight: '800', fontSize: 20 },
  statLabel: { color: colors.deep, fontWeight: '800', fontSize: 8, letterSpacing: 0.7, textTransform: 'uppercase', textAlign: 'center', marginTop: 3 },
  section: { paddingHorizontal: 17, paddingTop: 27 },
  eyebrow: { color: colors.gold, fontSize: 10, letterSpacing: 1.7, fontWeight: '900' },
  sectionTitle: { color: colors.deep, fontFamily: 'serif', fontWeight: '800', fontSize: 30, marginTop: 3, marginBottom: 15 },
  horizontal: { gap: 12, paddingRight: 17 },
  destination: { width: 220, height: 270, overflow: 'hidden' },
  destinationImage: { borderRadius: 24 },
  destinationShade: { flex: 1, borderRadius: 24, padding: 17, justifyContent: 'flex-end' },
  destinationName: { color: colors.white, fontFamily: 'serif', fontWeight: '800', fontSize: 26 },
  destinationLocation: { color: colors.gold, fontWeight: '800', marginTop: 2 },
});
