import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Linking, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { colors } from '@/constants/app-theme';

const WEBSITE_URL = 'https://aware-kashmir-portal-c64d.up.railway.app/';
const WEBSITE_HOST = 'aware-kashmir-portal-c64d.up.railway.app';
const MOBILE_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36 KashmirPortalApp/1.0';
const FORCE_MOBILE_VIEWPORT = `
  (function () {
    var viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    document.documentElement.style.width = '100%';
    document.documentElement.style.maxWidth = '100vw';
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100vw';
    window.dispatchEvent(new Event('resize'));
    true;
  })();
`;

export default function WebsiteApp() {
  const webView = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      webView.current?.goBack();
      return true;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  const retry = useCallback(() => {
    setFailed(false);
    setLoading(true);
    webView.current?.reload();
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    webView.current?.reload();
  }, []);

  const allowRequest = useCallback((request: { url: string }) => {
    try {
      const url = new URL(request.url);
      if (url.host === WEBSITE_HOST || request.url === 'about:blank') return true;
      Linking.openURL(request.url);
      return false;
    } catch {
      return true;
    }
  }, []);

  const onNavigationChange = useCallback((navigation: WebViewNavigation) => {
    setCanGoBack(navigation.canGoBack);
  }, []);

  if (failed) {
    return (
      <SafeAreaView style={styles.errorPage}>
        <View style={styles.errorIcon}><Ionicons name="cloud-offline-outline" size={42} color={colors.teal} /></View>
        <Text style={styles.errorTitle}>Kashmir Portal is unavailable</Text>
        <Text style={styles.errorText}>Check your internet connection and try again. Your account and website data are safe.</Text>
        <Pressable style={styles.retryButton} onPress={retry}><Ionicons name="refresh" color={colors.white} size={19} /><Text style={styles.retryText}>Try Again</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.page}>
      <WebView
        ref={webView}
        source={{ uri: WEBSITE_URL }}
        style={styles.webView}
        userAgent={MOBILE_USER_AGENT}
        injectedJavaScriptBeforeContentLoaded={FORCE_MOBILE_VIEWPORT}
        injectedJavaScript={FORCE_MOBILE_VIEWPORT}
        textZoom={100}
        setSupportMultipleWindows={false}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        cacheEnabled={false}
        cacheMode="LOAD_NO_CACHE"
        javaScriptEnabled
        domStorageEnabled
        mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
        allowsBackForwardNavigationGestures
        startInLoadingState
        pullToRefreshEnabled
        onNavigationStateChange={onNavigationChange}
        onShouldStartLoadWithRequest={allowRequest}
        onLoadStart={() => { setLoading(true); setFailed(false); }}
        onLoadEnd={() => { setLoading(false); setRefreshing(false); }}
        onError={() => { setLoading(false); setRefreshing(false); setFailed(true); }}
        onHttpError={(event) => {
          if (event.nativeEvent.statusCode >= 500) setFailed(true);
        }}
        renderLoading={() => <LoadingView />}
      />
      {Platform.OS === 'ios' ? (
        <ScrollView style={styles.iosRefresh} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />} />
      ) : null}
      {loading ? <View pointerEvents="none" style={styles.loadingLine} /> : null}
    </SafeAreaView>
  );
}

function LoadingView() {
  return (
    <View style={styles.loadingPage}>
      <View style={styles.logo}><Ionicons name="images-outline" size={32} color={colors.deep} /></View>
      <Text style={styles.brand}>Kashmir</Text>
      <Text style={styles.tagline}>PARADISE PORTAL</Text>
      <Text style={styles.loadingText}>Opening the valley...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.deep },
  webView: { flex: 1, backgroundColor: colors.cream },
  loadingLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: colors.gold },
  iosRefresh: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  loadingPage: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.deep, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gold },
  brand: { color: colors.white, fontFamily: 'serif', fontWeight: '800', fontSize: 39, marginTop: 15 },
  tagline: { color: colors.gold, letterSpacing: 3, fontSize: 10, fontWeight: '900' },
  loadingText: { color: 'rgba(255,255,255,0.62)', marginTop: 25, fontSize: 13 },
  errorPage: { flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', padding: 28 },
  errorIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  errorTitle: { color: colors.deep, fontFamily: 'serif', fontWeight: '800', fontSize: 29, textAlign: 'center', marginTop: 20 },
  errorText: { color: colors.muted, textAlign: 'center', lineHeight: 22, marginTop: 9 },
  retryButton: { height: 52, borderRadius: 26, backgroundColor: colors.teal, paddingHorizontal: 27, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24 },
  retryText: { color: colors.white, fontWeight: '900' },
});
