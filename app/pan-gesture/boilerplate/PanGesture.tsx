import { View, StyleSheet } from 'react-native'

import { Card, CARD_HEIGHT, CARD_WIDTH, Cards } from '@/components'
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

interface GestureProps {
  width: number
  height: number
}

export const PanGesture = ({width, height}: GestureProps) => {
  const boundX = width - CARD_WIDTH
  const boundY = height - CARD_HEIGHT

  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value
      ctx.offsetY = translateY.value
    },
    onActive: (event, ctx) => {
      translateX.value = clamp(ctx.offsetX + event.translationX, 0, boundX)
      translateY.value = clamp(ctx.offsetY + event.translationY, 0, boundY)
    },
    onEnd: (event) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [0, boundX]
      })
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [0, boundY]
      })
    }
  })

  const style = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value}
    ]
  }))

  return (
    <View style={styles.container}>
      <PanGestureHandler {...{onGestureEvent}}>
        <Animated.View {...{style}}>
          <Card card={Cards.Card1} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}
