import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/app-theme';

export function BrandMark({ light = true }: { light?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Ionicons name="images-outline" size={25} color={colors.deep} />
      </View>
      <View>
        <Text style={[styles.name, !light && styles.darkName]}>Kashmir</Text>
        <Text style={styles.tagline}>PARADISE PORTAL</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  name: { color: colors.white, fontSize: 25, lineHeight: 27, fontFamily: 'serif', fontWeight: '700' },
  darkName: { color: colors.deep },
  tagline: { color: colors.gold, fontSize: 9, fontWeight: '800', letterSpacing: 2.1 },
});
