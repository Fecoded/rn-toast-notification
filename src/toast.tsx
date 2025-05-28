import { 
  Text, 
  StyleSheet, 
  Animated, 
  Platform, 
  TextStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useRef } from 'react';

interface ToastProps {
    showToast: boolean; // This prop is not used in the component but can be used to control visibility externally
    message: string;
    onHide: () => void;
    duration?: number; // in milliseconds default is 3000ms
    textStyle?: TextStyle; // Optional style for the text
    bgColor?: string; // Optional background color for the toast
    position?: 'top' | 'bottom'; // Optional position for the toast, default is 'top'
}

const isAndroid = Platform.OS === "android"

export const RNToast: React.FC<ToastProps> = ({
    showToast,  
    message, 
    onHide, 
    duration = 3000, 
    textStyle, 
    bgColor = "green",
    position = "top"
}) => {
    const isTop = position === "top";
    const animatedValue = isTop ? -100 : 100;

    const slideAnim = useRef(new Animated.Value(animatedValue)).current;
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
            toValue: animatedValue,
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
    }, [showToast]);

    const styles = StyleSheet.create({
      toast: {
        position: 'absolute',
        ...(isTop ? { top: isAndroid ? 0 : -10 } : { bottom: isAndroid ? 0 : 10}),
        left: 0,
        right: 0,
        backgroundColor: bgColor,
        paddingBottom: isTop ? 10 : (isAndroid ? 15 : 20),
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

    if(!showToast) return null;
  
    return (
      <Animated.View
        style={[
          styles.toast,
          {
            paddingTop: isTop ? insets.top + 10 : insets.bottom + (isAndroid ? 1 : -10),
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={[styles.toastText, textStyle]}>{message}</Text>
      </Animated.View>
    );
  };
  

 