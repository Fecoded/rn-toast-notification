import { Text, SafeAreaView, StyleSheet, View, Animated, Dimensions, Button, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
// components/Toast.tsx
import React, { useEffect, useRef, useState } from 'react';

const { width } = Dimensions.get('window');


interface ToastProps {
    message: string;
    onHide: () => void;
    duration?: number; // in milliseconds
}

const isAndroid = Platform.OS === "android"

export const RNToastNotification = () => {
    const [showToast, setShowToast] = useState(false);
  
    return (
      <>
        <StatusBar barStyle={showToast ? "light-content" : "dark-content"} />
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Show Toast" onPress={() => setShowToast(true)} />
            {showToast && (
              <Toast
                message="This is a toast notification! what a great way for showing notification, you try it!"
                onHide={() => setShowToast(false)}
              />
            )}
          </View>
          </SafeAreaView>
        </SafeAreaProvider>
        </>
    );
  }

  const styles = StyleSheet.create({
    container: {
     flex: 1,
     justifyContent: 'center',
     backgroundColor: '#ecf0f1',
     // padding: 8,
   },
   toast: {
     position: 'absolute',
     top: isAndroid ? 0 : -70,
     left: 0,
     right: 0,
     backgroundColor: 'green',
     paddingBottom: 10,
     paddingHorizontal: 12,
     zIndex: 999,
     elevation: 10,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.3,
     shadowRadius: 3,
   },
   toastText: {
     color: '#fff',
     fontSize: 14,
   },
 });
 

 export const Toast: React.FC<ToastProps> = ({  message, onHide, duration = 3000 }) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
  
    const insets = useSafeAreaInsets();
  
    useEffect(() => {
      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
  
      // Animate out after delay
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, duration);
  
      return () => clearTimeout(timeout);
    }, []);
  
    return (
      <Animated.View
        style={[
          styles.toast,
          {
            paddingTop: insets.top + 10,
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.toastText}>{message}</Text>
      </Animated.View>
    );
  };
  