import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/app-theme';

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>KASHMIR PARADISE PORTAL</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.deep },
  content: { paddingHorizontal: 20, paddingVertical: 18 },
  eyebrow: { color: colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.white, fontSize: 28, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#CFE4DF', marginTop: 5, fontSize: 14 },
});
