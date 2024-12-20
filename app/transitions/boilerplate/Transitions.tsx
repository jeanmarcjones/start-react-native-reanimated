import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDerivedValue, withSpring } from 'react-native-reanimated'

import { Button, StyleGuide, cards } from '@/components'

import { AnimatedCard } from './AnimatedCard'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
    justifyContent: 'flex-end',
  },
})

export const Transitions = () => {
  const [toggled, setToggle] = useState(false)

  const transition = useDerivedValue(() =>
    withSpring(toggled ? 1 : 0, { duration: 800 })
  )

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
