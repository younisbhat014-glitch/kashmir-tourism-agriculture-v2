import { useState } from 'react';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';

export default function SignupScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name || !email || password.length < 6) return setError('Enter your name, email, and a 6+ character password.');
    try {
      setSubmitting(true);
      setError('');
      await register(name, email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={[colors.deep, colors.teal]} style={styles.page}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Your Kashmir journey starts here</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.input} />
          <TextInput value={email} onChangeText={setEmail} placeholder="Email address" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable onPress={submit} disabled={submitting} style={styles.button}>
            <Text style={styles.buttonText}>{submitting ? 'Creating account...' : 'Create Account'}</Text>
          </Pressable>
          <Text style={styles.switchText}>Already registered? <Link href="/login" style={styles.link}>Sign in</Link></Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', padding: 22 },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 22 },
  title: { fontSize: 27, color: colors.ink, fontWeight: '800' },
  subtitle: { color: colors.muted, marginTop: 5, marginBottom: 18 },
  input: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.mist, borderRadius: 14, padding: 15, marginBottom: 12, fontSize: 16 },
  error: { color: colors.danger, marginBottom: 12 },
  button: { backgroundColor: colors.gold, borderRadius: 14, padding: 16, alignItems: 'center' },
  buttonText: { color: colors.deep, fontSize: 16, fontWeight: '800' },
  switchText: { textAlign: 'center', marginTop: 18, color: colors.muted },
  link: { color: colors.teal, fontWeight: '800' },
});
