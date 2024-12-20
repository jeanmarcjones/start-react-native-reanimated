import { StyleSheet } from 'react-native'
import Animated, { type SharedValue, useAnimatedProps } from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

import { StyleGuide } from '@/components'

const { PI } = Math

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface CircularProgressProps {
  theta: SharedValue<number>
  r: number
  strokeWidth: number
}

export const CircularProgress = ({ theta, r, strokeWidth }: CircularProgressProps) => {
  const radius = r - strokeWidth / 2
  const circumference = radius * 2 * PI

  const props = useAnimatedProps(() => {
    return {
      strokeDashoffset: theta.value * radius
    }
  })

  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Circle
        cx={r}
        cy={r}
        fill="transparent"
        stroke="white"
        r={radius}
        {...{ strokeWidth }}
      />
      <AnimatedCircle
        animatedProps={props}
        cx={r}
        cy={r}
        fill="transparent"
        r={radius}
        stroke={StyleGuide.palette.primary}
        strokeDasharray={`${circumference}, ${circumference}`}
        {...{ strokeWidth }}
      />
    </Svg>
  )
}
