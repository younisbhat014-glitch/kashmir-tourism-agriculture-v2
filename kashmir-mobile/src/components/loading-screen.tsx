import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/app-theme';

export function LoadingScreen({ label = 'Loading...' }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.gold} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.deep, gap: 14 },
  label: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
