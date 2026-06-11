import { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from '@/components/brand-mark';
import { colors } from '@/constants/app-theme';

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <LinearGradient colors={[colors.deep, colors.teal, '#2B8795']} style={styles.page}>
      <View style={styles.goldOrb} /><View style={styles.lightOrb} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <BrandMark />
            <View style={styles.card}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export const authStyles = StyleSheet.create({
  label: { color: colors.deep, fontSize: 11, fontWeight: '900', letterSpacing: 1.15, marginBottom: 7, marginTop: 4 },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#FAFCFB', borderRadius: 15, paddingHorizontal: 15, height: 52, marginBottom: 13, fontSize: 15, color: colors.ink },
  error: { color: colors.danger, marginBottom: 12, fontWeight: '700' },
  button: { borderRadius: 16, overflow: 'hidden', marginTop: 3 },
  buttonGradient: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '900' },
  switchText: { textAlign: 'center', marginTop: 19, color: colors.muted },
  link: { color: colors.teal, fontWeight: '900' },
});

const styles = StyleSheet.create({
  page: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 21, gap: 27 },
  goldOrb: { position: 'absolute', width: 230, height: 230, borderRadius: 115, backgroundColor: 'rgba(201,168,76,0.20)', top: -75, right: -80 },
  lightOrb: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255,255,255,0.08)', bottom: -100, left: -115 },
  card: { backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 27, padding: 22, shadowColor: '#002F27', shadowOpacity: 0.22, shadowRadius: 24, elevation: 8 },
  title: { color: colors.deep, fontFamily: 'serif', fontWeight: '800', fontSize: 32 },
  subtitle: { color: colors.muted, marginTop: 5, marginBottom: 21, lineHeight: 20 },
});
