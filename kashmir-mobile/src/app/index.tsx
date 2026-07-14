import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Linking, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { colors } from '@/constants/app-theme';

const WEBSITE_URL = 'https://kashmir-portal-production-bf57.up.railway.app/';
const WEBSITE_HOST = 'kashmir-portal-production-bf57.up.railway.app';
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
const FIX_WEBVIEW_IMAGES = `
  (function () {
    var fallback = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85';

    function fitImage(image) {
      image.style.setProperty('width', '100%', 'important');
      image.style.setProperty('height', 'auto', 'important');
      image.style.setProperty('aspect-ratio', '4 / 3', 'important');
      image.style.setProperty('object-fit', 'cover', 'important');
      image.style.setProperty('object-position', 'center', 'important');
      image.style.setProperty('border-radius', '24px', 'important');
      image.style.setProperty('display', 'block', 'important');
    }

    function protectAboutImage(root) {
      var image = root.querySelector && root.querySelector('.about-mission-image');
      if (!image || image.dataset.webviewFallbackReady === 'true') return;

      image.dataset.webviewFallbackReady = 'true';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', function () {
        if (image.src !== fallback) {
          image.src = fallback;
          fitImage(image);
        }
      });

      if (image.complete && image.naturalWidth === 0) {
        image.src = fallback;
        fitImage(image);
      }
    }

    protectAboutImage(document);
    new MutationObserver(function () {
      protectAboutImage(document);
    }).observe(document.documentElement, { childList: true, subtree: true });
    true;
  })();
`;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function WebsiteApp() {
  const webView = useRef<WebView>(null);
  const webViewReady = useRef(false);
  const pendingNotificationPath = useRef<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');

  const openWebsitePath = useCallback((path: unknown) => {
    const safePath = typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')
      ? path
      : '/';
    if (!webViewReady.current) {
      pendingNotificationPath.current = safePath;
      return;
    }
    webView.current?.injectJavaScript(`
      window.location.href = ${JSON.stringify(`${WEBSITE_URL.replace(/\/$/, '')}${safePath}`)};
      true;
    `);
  }, []);

  const sendPushTokenToWebsite = useCallback(() => {
    if (!expoPushToken) return;
    const payload = JSON.stringify({
      token: expoPushToken,
      platform: Platform.OS,
      deviceId: '',
    });
    webView.current?.injectJavaScript(`
      window.dispatchEvent(new CustomEvent('kashmir-native-push-token', {
        detail: ${payload}
      }));
      true;
    `);
  }, [expoPushToken]);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (!Device.isDevice) return;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('portal-updates', {
          name: 'Portal updates',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#C9A84C',
          sound: 'default',
        });
      }

      const currentPermissions = await Notifications.getPermissionsAsync();
      let finalStatus = currentPermissions.status;
      if (finalStatus !== 'granted') {
        const requestedPermissions = await Notifications.requestPermissionsAsync();
        finalStatus = requestedPermissions.status;
      }
      if (finalStatus !== 'granted') return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId
        ?? Constants.easConfig?.projectId;
      if (!projectId) return;

      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      setExpoPushToken(token.data);
    };

    registerForPushNotifications().catch((error) => {
      console.warn('Push notification registration failed:', error);
    });
  }, []);

  useEffect(() => {
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      openWebsitePath(response.notification.request.content.data?.link);
    });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        openWebsitePath(response.notification.request.content.data?.link);
        Notifications.clearLastNotificationResponseAsync();
      }
    });

    return () => responseSubscription.remove();
  }, [openWebsitePath]);

  useEffect(() => {
    sendPushTokenToWebsite();
  }, [sendPushTokenToWebsite]);

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

  const onWebMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'notification-bridge-ready') sendPushTokenToWebsite();
    } catch {
      // Ignore messages not intended for the native notification bridge.
    }
  }, [sendPushTokenToWebsite]);

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
        injectedJavaScript={`${FORCE_MOBILE_VIEWPORT}\n${FIX_WEBVIEW_IMAGES}`}
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
        onMessage={onWebMessage}
        onShouldStartLoadWithRequest={allowRequest}
        onLoadStart={() => {
          webViewReady.current = false;
          setLoading(true);
          setFailed(false);
        }}
        onLoadEnd={() => {
          webViewReady.current = true;
          setLoading(false);
          setRefreshing(false);
          sendPushTokenToWebsite();
          if (pendingNotificationPath.current) {
            const path = pendingNotificationPath.current;
            pendingNotificationPath.current = null;
            openWebsitePath(path);
          }
        }}
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
