import React from 'react';
import {View, Text, Pressable, Dimensions} from 'react-native';

import styles from './styles';

export default function Boards(props) {

  const screenWidth = Dimensions.get('window').width;

  const {setErr, manageUserInp, allClear, addParenthesis, addToInp} = props;

  return (
    <View style={styles.boards}>
      <View style={styles.symBoard}>
        <View style={styles.symColumn}>
          <Pressable onPress={() => addToInp('-')} style={styles.symButton}>
            <Text style={styles.buttonText}>-</Text>
          </Pressable>
          <Pressable onPress={() => addToInp('÷')} style={styles.symButton}>
            <Text style={styles.buttonText}>÷</Text>
          </Pressable>
        </View>

        <View style={styles.symColumn}>
          <Pressable onPress={() => addToInp('+')} style={styles.symButton}>
            <Text style={styles.buttonText}>+</Text>
          </Pressable>

          <Pressable onPress={() => addToInp('×')} style={styles.symButton}>
            <Text style={styles.buttonText}>×</Text>
          </Pressable>
        </View>
        <View style={styles.symColumn}>
          <Pressable onPress={allClear} style={styles.symButton}>
            <Text style={styles.buttonText}>AC</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              addToInp('^');
            }}
            style={styles.symButton}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 30, color: 'red'}}>&#119909;</Text>
              <Text
                style={{
                  fontSize: 15,
                  color: 'red',
                }}>
                &#119909;
              </Text>
            </View>
          </Pressable>
        </View>
        <Pressable
          style={{
            backgroundColor: 'green',
            height: 120,
            width: (1 / 4) * screenWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'blue',
            borderWidth: 1,
          }}
          onPress={() => {
            setErr(false);
            manageUserInp();
          }}>
          <Text style={{fontSize: 45}}>=</Text>
        </Pressable>
      </View>
      <View style={styles.numBoard}>
        <View style={styles.numRow}>
          <Pressable onPress={() => addToInp('7')} style={styles.numButton}>
            <Text style={styles.buttonText}>7</Text>
          </Pressable>
          <Pressable onPress={() => addToInp('8')} style={styles.numButton}>
            <Text style={styles.buttonText}>8</Text>
          </Pressable>
          <Pressable onPress={() => addToInp('9')} style={styles.numButton}>
            <Text style={styles.buttonText}>9</Text>
          </Pressable>
        </View>
        <View style={styles.numRow}>
          <Pressable onPress={() => addToInp('4')} style={styles.numButton}>
            <Text style={styles.buttonText}>4</Text>
          </Pressable>
          <Pressable onPress={() => addToInp('5')} style={styles.numButton}>
            <Text style={styles.buttonText}>5</Text>
          </Pressable>
          <Pressable onPress={() => addToInp('6')} style={styles.numButton}>
            <Text style={styles.buttonText}>6</Text>
          </Pressable>
        </View>
        <View style={styles.numRow}>
          <Pressable onPress={() => addToInp('1')} style={styles.numButton}>
            <Text style={styles.buttonText}>1</Text>
          </Pressable>
          <Pressable onPress={() => addToInp('2')} style={styles.numButton}>
            <Text style={styles.buttonText}>2</Text>
          </Pressable>
          <Pressable onPress={() => addToInp('3')} style={styles.numButton}>
            <Text style={styles.buttonText}>3</Text>
          </Pressable>
        </View>
        <View style={styles.numRow}>
          <Pressable onPress={() => addToInp('0')} style={styles.numButton}>
            <Text style={styles.buttonText}>0</Text>
          </Pressable>
          <Pressable onPress={() => addToInp('.')} style={styles.numButton}>
            <Text style={styles.buttonText}>.</Text>
          </Pressable>
          <Pressable onPress={addParenthesis} style={styles.numButton}>
            <Text style={styles.buttonText}>( )</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
