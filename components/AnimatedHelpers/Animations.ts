import {
  type Animation,
  defineAnimation,
  type AnimatableValue,
  clamp,
} from 'react-native-reanimated'

export interface PhysicsAnimation extends Animation<PhysicsAnimation> {
  velocity: number
  current: AnimatableValue
}

type withBouncingType = (
  _nextAnimation: any,
  lowerBound: number,
  upperBound: number
) => number

export const withBouncing = function (
  _nextAnimation: any,
  lowerBound: number,
  upperBound: number
): Animation<PhysicsAnimation> {
  'worklet'

  return defineAnimation<PhysicsAnimation>(_nextAnimation, () => {
    'worklet'

    const nextAnimation: PhysicsAnimation =
      typeof _nextAnimation === 'function' ? _nextAnimation() : _nextAnimation

    const onFrame = (state: PhysicsAnimation, now: number) => {
      const finished = nextAnimation.onFrame(nextAnimation, now)
      const { velocity, current: position } = nextAnimation

      if (typeof position !== 'number') {
        return false
      }

      if (
        (velocity < 0 && position < lowerBound) ||
        (velocity > 0 && position > upperBound)
      ) {
        nextAnimation.velocity *= -0.5 // change the animations direction
        state.current = clamp(position, lowerBound, upperBound)
      }

      state.current = position

      return finished
    }

    const onStart = (
      _state: PhysicsAnimation,
      value: AnimatableValue,
      now: number,
      previousAnimation: PhysicsAnimation | Animation<any> | null
    ) => {
      nextAnimation.onStart(nextAnimation, value, now, previousAnimation)
    }

    return {
      onFrame,
      onStart,
      current: nextAnimation.current,
      callback: nextAnimation.callback,
      velocity: 0,
    }
  })
} as unknown as withBouncingType

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
      const { velocity, lastTimeStamp, current: position } = state

      if (typeof position !== 'number') {
        return false
      }

      const deltaTime = now - lastTimeStamp // The amount of time that has passed since the last frame update
      const initialVelocity = velocity / 1000 // v0 - Dividing by 1000 to convert to pixels per millisecond
      const velocityChange = Math.pow(deceleration, deltaTime) // kv

      const v = initialVelocity * velocityChange * 1000
      const x =
        position +
        (initialVelocity * deceleration * (1 - velocityChange)) /
          (1 - deceleration)

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
