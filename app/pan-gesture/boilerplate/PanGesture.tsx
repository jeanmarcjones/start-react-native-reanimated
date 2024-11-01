import { View, StyleSheet } from 'react-native'

import { Card, CARD_HEIGHT, CARD_WIDTH, Cards } from '@/components'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import {
  withDecay,
  withBouncing,
} from '@/components/AnimatedHelpers/Animations'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

interface GestureProps {
  width: number
  height: number
}

export const PanGesture = ({ width, height }: GestureProps) => {
  const boundX = width - CARD_WIDTH
  const boundY = height - CARD_HEIGHT

  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const offsetX = useSharedValue(0)
  const offsetY = useSharedValue(0)

  const pan = Gesture.Pan()
    .onStart(() => {
      offsetX.value = translateX.value
      offsetY.value = translateY.value
    })
    .onUpdate((event) => {
      translateX.value = clamp(offsetX.value + event.translationX, 0, boundX)
      translateY.value = clamp(offsetY.value + event.translationY, 0, boundY)
    })
    .onEnd((event) => {
      translateX.value = withBouncing(withDecay(event.velocityX), 0, boundX)
      translateY.value = withBouncing(withDecay(event.velocityY), 0, boundY)
    })

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }))

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <Animated.View {...{ style }}>
          <Card card={Cards.Card1} />
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
