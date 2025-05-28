import { 
  Text, 
  StyleSheet, 
  Animated, 
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useRef } from 'react';

interface ToastProps {
    message: string;
    onHide: () => void;
    duration?: number; // in milliseconds
}

const isAndroid = Platform.OS === "android"
 

 export const RNToast: React.FC<ToastProps> = ({  message, onHide, duration = 3000 }) => {
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
  

  const styles = StyleSheet.create({
    container: {
     flex: 1,
     justifyContent: 'center',
     backgroundColor: '#ecf0f1',
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