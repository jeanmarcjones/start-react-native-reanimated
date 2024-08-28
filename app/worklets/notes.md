# Worklets & Shared Values

Not all animations are run with the same mechanism:

1. Animations that affect the layout (e.g. width and height) are run through the UI
   manager (Yoga).
2. All other animations can directly update the css property (e.g. transform x and y).

The value stored in the `useDerivedValue` hook is available to UI and JS thread. It
derives its name from this fact.

`useDerivedValue` takes a shared value as an input and returns a read only value.

Below you can find the reanimated equivalents to reacts built-in hooks:

| Reanimated            | React       |
|-----------------------|-------------|
| useSharedValue()      | useState()  |
| useDerivedValue()     | useMemo()   |
| useAnimatedStyle()    | render      |
| useAnimatedReaction() | useEffect() |
| useAnimatedRef()      | useRef()    |

Here are the use cases for the reanimated core hooks:

| Use Case              | Hook                                      |
|-----------------------|-------------------------------------------|
| Create Values         | useSharedValue()<br/>useDerivedValue()    |
| Animate Properties    | useAnimatedStyle()<br/>useAnimatedProps() |
| Apply to side-effects | useAnimatedReaction()                     |
| Reference a View      | useAnimatedRef()                          |
