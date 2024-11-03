import { StyleSheet } from 'react-native'

import { StyleGuide } from '@/components'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { canvas2Polar, polar2Canvas } from 'react-native-redash'

const { PI } = Math
const THRESHOLD = 0.001

interface CursorProps {
  theta: SharedValue<number>
  radius: number
  strokeWidth: number
}

export const Cursor = ({ theta, radius, strokeWidth }: CursorProps) => {
  const center = { x: radius, y: radius }

  const offset = useSharedValue({ x: 0, y: 0 })

  const pan = Gesture.Pan()
    .onStart(() => {
      offset.value = polar2Canvas(
        {
          theta: theta.value,
          radius,
        },
        center
      )
    })
    .onUpdate((event) => {
      const { translationX, translationY } = event
      const x = offset.value.x + translationX
      const y1 = offset.value.y + translationY

      let y: number
      if (x < radius) {
        y = y1
      } else if (theta.value < Math.PI) {
        y = clamp(y1, 0, radius - THRESHOLD)
      } else {
        y = clamp(y1, radius, 2 * radius)
      }

      const value = canvas2Polar({ x, y }, center).theta
      theta.value = value > 0 ? value : 2 * PI + value
    })

  const animatedStyle = useAnimatedStyle(() => {
    const { x: translateX, y: translateY } = polar2Canvas(
      {
        theta: theta.value,
        radius,
      },
      center
    )

    return {
      transform: [{ translateX }, { translateY }],
    }
  })

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            width: strokeWidth,
            height: strokeWidth,
            borderRadius: strokeWidth / 2,
            borderColor: 'white',
            borderWidth: 5,
            backgroundColor: StyleGuide.palette.primary,
          },
          animatedStyle,
        ]}
      />
    </GestureDetector>
  )
}
