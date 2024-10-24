import React, { useState } from 'react'
import type { LayoutRectangle } from 'react-native'
import { StyleSheet, View } from 'react-native'

import { PanGesture as Gesture } from './boilerplate/PanGesture'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const PanGesture = () => {
  const [container, setContainer] = useState<null | LayoutRectangle>(null)
  return (
    <View
      style={styles.container}
      onLayout={({ nativeEvent: { layout } }) => setContainer(layout)}
    >
      {container && <Gesture {...container} />}
    </View>
  )
}

export default PanGesture
