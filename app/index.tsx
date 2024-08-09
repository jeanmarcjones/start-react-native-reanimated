import * as React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Link } from 'expo-router'
import { RectButton } from 'react-native-gesture-handler'

import { StyleGuide } from '@/components'

export const examples = [
  {
    href: '/heart-of-the-matter',
    title: '💚 The Heart of the Matter',
  },
  {
    href: '/worklets',
    title: '👩‍🏭 Worklets',
  },
] as const

const styles = StyleSheet.create({
  container: {
    backgroundColor: StyleGuide.palette.background,
  },
  content: {
    paddingBottom: 32,
  },
  thumbnail: {
    backgroundColor: 'white',
    padding: StyleGuide.spacing * 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: StyleGuide.palette.background,
  },
  title: {
    ...StyleGuide.typography.headline,
  },
})

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {examples.map((thumbnail) => (
        <Link
          key={thumbnail.href.slice(1, thumbnail.title.length)}
          href={thumbnail.href}
          asChild
        >
          <RectButton>
            <View style={styles.thumbnail}>
              <Text style={styles.title}>{thumbnail.title}</Text>
            </View>
          </RectButton>
        </Link>
      ))}
    </ScrollView>
  )
}

export default HomeScreen
