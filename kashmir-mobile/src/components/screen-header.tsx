import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from '@/components/brand-mark';
import { colors } from '@/constants/app-theme';

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <LinearGradient colors={[colors.deep, colors.teal]} style={styles.content}>
        <BrandMark />
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>EXPLORE KASHMIR</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.deep },
  content: { paddingHorizontal: 20, paddingTop: 13, paddingBottom: 22 },
  copy: { marginTop: 19 },
  eyebrow: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1.6 },
  title: { color: colors.white, fontSize: 33, fontFamily: 'serif', fontWeight: '800', marginTop: 3 },
  subtitle: { color: '#CFE4DF', marginTop: 5, fontSize: 14 },
});
