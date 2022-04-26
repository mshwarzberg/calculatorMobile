import React from 'react'
import { View, Text, Pressable } from 'react-native'
import styles from './styles';

function InputOutput(props) {
  const { userInp, err, renderedOutput, out, newInputFromAnswer, setUserInp } = props
  return (
    <View>
      <View style={styles.input}>
        <Pressable
          style={styles.inOut}
          onPress={() => {
            setUserInp(prevVal => prevVal.slice(0, -1));
          }}>
          <Text style={{fontSize: 15, paddingVertical: 5}}>Backspace</Text>
        </Pressable>
        <View>
          <Text>{userInp}</Text>
        </View>
      </View>
      <View>
        {err ? (
          <View>
            <Text>{out}</Text>
          </View>
        ) : (
          <View style={styles.output}>
            <Text>{renderedOutput(out)}</Text>
            <Pressable
              style={styles.inOut}
              onPress={() => {
                newInputFromAnswer();
              }}>
              <Text style={styles.buttonText}>ANS</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  )
}

export default InputOutput