import {
  type Animation,
  defineAnimation,
  type AnimatableValue,
  clamp,
  type SharedValue,
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

    const bounce = (state: PhysicsAnimation, now: number) => {
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
      onFrame: bounce,
      onStart,
      current: nextAnimation.current,
      velocity: 0,
    }
  })
} as unknown as withBouncingType

interface DecayAnimation extends Animation<DecayAnimation> {
  velocity: number
  current: AnimatableValue
  lastTimestamp: number
}

export const VELOCITY_EPS = 1
const deceleration = 0.998

export function withDecay(initialVelocity: number): Animation<DecayAnimation> {
  'worklet'

  return defineAnimation<DecayAnimation>(0, () => {
    'worklet'

    const decay = (state: DecayAnimation, now: number): boolean => {
      const { velocity, lastTimestamp, current: position } = state

      if (typeof position !== 'number') {
        return false
      }

      const deltaTime = now - lastTimestamp // The amount of time that has passed since the last frame update
      const initialVelocity = velocity / 1000 // v0 - Dividing by 1000 to convert to pixels per millisecond
      const velocityChange = Math.pow(deceleration, deltaTime) // kv

      const v = initialVelocity * velocityChange * 1000
      const x =
        position +
        (initialVelocity * deceleration * (1 - velocityChange)) /
          (1 - deceleration)

      state.velocity = v
      state.current = x // This is the position
      state.lastTimestamp = now

      return Math.abs(v) < VELOCITY_EPS
    }

    const onStart = (
      state: DecayAnimation,
      current: AnimatableValue,
      now: number
    ) => {
      state.current = current
      state.velocity = initialVelocity
      state.lastTimestamp = now
    }

    return {
      onFrame: decay,
      onStart,
      velocity: 0,
      current: 0,
      lastTimestamp: 0,
    }
  })
}

interface PausableAnimation extends Animation<PausableAnimation> {
  lastTimestamp: number
  elapsed: number
}

type withPauseType = (
  _nextAnimation: any,
  paused: SharedValue<boolean>
) => number

export const withPause = function(
  _nextAnimation: any,
  paused: SharedValue<boolean>
): Animation<PausableAnimation> {
  'worklet'

  return defineAnimation(_nextAnimation, () => {
    'worklet'

    const nextAnimation: PausableAnimation =
      typeof _nextAnimation === 'function' ? _nextAnimation() : _nextAnimation

    const pause = (state: PausableAnimation, now: number) => {
      const { lastTimestamp, elapsed } = state

      if (paused.value) {
        state.elapsed = now - lastTimestamp

        return false
      }

      const deltaTime = now - elapsed
      const finished = nextAnimation.onFrame(nextAnimation, deltaTime)

      state.current = nextAnimation.current
      state.lastTimestamp = deltaTime

      return finished
    }

    const onStart = (
      state: PausableAnimation,
      value: AnimatableValue,
      now: number,
      previousAnimation: PhysicsAnimation | Animation<any> | null
    ) => {
      state.lastTimestamp = now
      state.elapsed = 0
      state.current = 0

      nextAnimation.onStart(nextAnimation, value, now, previousAnimation)
    }

    return {
      onFrame: pause,
      onStart,
    }
  })
} as unknown as withPauseType
