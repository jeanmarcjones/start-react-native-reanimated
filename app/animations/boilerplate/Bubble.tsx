import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated'

import { StyleGuide } from '@/components'

const size = 32
const styles = StyleSheet.create({
  bubble: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: StyleGuide.palette.primary,
  },
})

interface BubbleProps {
  progress: SharedValue<number>
  start: number
  end: number
}

export const Bubble = ({ progress, start, end }: BubbleProps) => {
  const style = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [start, end],
      [0.5, 1],
      Extrapolation.CLAMP
    )
    const scale = interpolate(
      progress.value,
      [start, end],
      [1, 1.5],
      Extrapolation.CLAMP
    )
    return { opacity, transform: [{ scale }] }
  })
  return <Animated.View style={[styles.bubble, style]} />
}
