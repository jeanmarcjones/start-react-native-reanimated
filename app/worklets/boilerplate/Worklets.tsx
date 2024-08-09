import { View, StyleSheet } from 'react-native'

import { Button } from '@/components'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
})

export const sayHello = () => {
  console.log('Hello from the JS thread!')
}

const Worklets = () => {
  return (
    <View style={styles.container}>
      <Button label="Say Hello" primary onPress={() => sayHello()} />
    </View>
  )
}
