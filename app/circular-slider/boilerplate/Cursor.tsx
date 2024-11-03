import { StyleSheet } from 'react-native'

import { StyleGuide } from '@/components'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  type SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
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

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_event, ctx) => {
      ctx.offset = polar2Canvas(
        {
          theta: theta.value,
          radius,
        },
        center
      )
    },
    onActive: (event, ctx) => {
      const { translationX, translationY } = event
      const x = ctx.offset.x + translationX
      const y1 = ctx.offset.y + translationY

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

      ctx.theta = theta.value
    },
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
    <PanGestureHandler {...{ onGestureEvent }}>
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
    </PanGestureHandler>
  )
}
