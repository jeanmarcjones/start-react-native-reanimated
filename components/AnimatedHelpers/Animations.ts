import { type Animation, defineAnimation } from 'react-native-reanimated'
import type { AnimatableValue } from 'react-native-reanimated/src/commonTypes'

interface DecayAnimation extends Animation<DecayAnimation> {
  velocity: number
  current: AnimatableValue
  lastTimeStamp: number
}

export const VELOCITY_EPS = 1
const deceleration = 0.998

export function withDecay(initialVelocity: number): Animation<DecayAnimation> {
  'worklet'

  return defineAnimation<DecayAnimation>(0, () => {
    'worklet'

    const onFrame = (state: DecayAnimation, now: number): boolean => {
      const { velocity, lastTimeStamp, current } = state

      if (typeof current !== 'number') {
        return false
      }

      const deltaTime = now - lastTimeStamp // The amount of time that has passed since the last frame update
      const initialVelocity = velocity / 1000 // v0 - Dividing by 1000 to convert to pixels per millisecond
      const velocityChange = Math.pow(deceleration, deltaTime) // kv

      const v = initialVelocity * velocityChange * 1000
      const x = current + (initialVelocity * deceleration * (1 - velocityChange)) / (1 - deceleration)

      state.velocity = v
      state.current = x // This is the position
      state.lastTimeStamp = now

      return Math.abs(v) < VELOCITY_EPS
    }

    const onStart = (
      state: DecayAnimation,
      current: AnimatableValue,
      now: number
    ) => {
      state.current = current
      state.velocity = initialVelocity
      state.lastTimeStamp = now
    }

    return {
      onFrame,
      onStart,
      velocity: 0,
      current: 0,
      lastTimeStamp: 0,
    }
  })
}
