import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
} from 'react-native-reanimated'

import { Button, StyleGuide, cards } from '@/components'

import { AnimatedCard } from './AnimatedCard'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
    justifyContent: 'flex-end',
  },
})

const useSpring = (state: boolean, config?: WithSpringConfig) => {
  const sv = useSharedValue(0)

  useEffect(() => {
    sv.value = state ? 1 : 0
  }, [state, sv])

  return useDerivedValue(() => withSpring(sv.value, config))
}

export const Transitions = () => {
  const [toggled, setToggle] = useState(false)

  const transition = useSpring(toggled, { duration: 800 })

  return (
    <View style={styles.container}>
      {cards.slice(0, 3).map((card, index) => (
        <AnimatedCard key={card} {...{ index, card, transition }} />
      ))}
      <Button
        label={toggled ? 'Reset' : 'Start'}
        primary
        onPress={() => setToggle((prev) => !prev)}
      />
    </View>
  )
}
