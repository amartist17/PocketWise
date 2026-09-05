import { Image, StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useAppTheme } from '@/contexts/theme-context';

const pocketWiseLogo = require('../../assets/images/icon.png');

export function BrandLogo() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.frame, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image source={pocketWiseLogo} style={styles.image} resizeMode="contain" accessibilityLabel="PocketWise logo" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 76,
    height: 76,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 68,
    height: 68,
  },
});
