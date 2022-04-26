import React, {useState} from 'react';
import {Pressable, View, ScrollView, Text, StyleSheet, Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function App() {

  const styles = StyleSheet.create({
    header: {
      backgroundColor: '#33333355',
      height: (1 / 11) * screenHeight,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 30,
    },
    input: {
      height: (1 / 11) * screenHeight,
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'purple',
    },
    output: {
      height: 70,
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'blue',
    },
    inOut: {
      alignSelf: 'center',
      position: 'absolute',
      right: 15,
      backgroundColor: 'green',
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    symBoard: {
      display: 'flex',
      flexDirection: 'row',
      width: screenWidth,
      backgroundColor: 'yellow',
    },
    symColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    symButton: {
      width: (1 / 4) * screenWidth,
      height: 60,
      backgroundColor: 'yellow',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'black',
      borderWidth: 1,
    },
    numBoard: {
      display: 'flex',
      flexDirection: 'column',
    },
    numButton: {
      width: (1 / 3) * screenWidth,
      height: 110,
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'blue',
      borderWidth: 1,
    },
    buttonText: {
      fontSize: 25,
      color: 'red',
    },
    numRow: {
      display: 'flex',
      flexDirection: 'row',
    },
  });

  // these should be self explanatory
  const [userInp, setUserInp] = useState('');
  const [out, setOut] = useState('');
  const [err, setErr] = useState(false);
  // handle user input
  function addToInp(val) {
    const lastItem = userInp[userInp.length - 1];
    // if there is a period in the current 'number set' (meaning it's already a float) don't allow another period
    if (val === '.') {
      for (let ind = userInp.length - 1; ind >= 0; ind--) {
        if (userInp[ind] === '.') {
          return;
        }
        // if the character next up in the string is a special char it means the number 'checked' is not already a float
        if (isNaN(userInp[ind])) {
          break;
        }
      }
    }
    // prevent user from adding multiple arithemitc symbols in a row. If the previous char in the input is already a symbol the current character will replace the previous one.
    if (
      isNaN(lastItem) &&
      isNaN(val) &&
      lastItem !== '.' &&
      lastItem !== '(' &&
      lastItem !== ')' &&
      val !== '('
    ) {
      setUserInp(prevVal => prevVal.slice(0, -1));
    }
    // if a user adds a number after closing parentheses, or if a user adds opening parentheses and the previous character is a number, automatically add a multiplication symbol beforehand
    if (
      (lastItem === ')' && (Number(val) || val === '(')) ||
      (val === '(' && Number(lastItem))
    ) {
      setUserInp(prevVal => prevVal + '×');
    }

    setUserInp(prevVal => prevVal + val);
  }

  // handle adding parentheses
  function addParenthesis() {
    // count the amount of times the opening and closing parentheses appear in userInp
    var openParent = (userInp.match(/\(/g) || []).length;
    var closeParent = (userInp.match(/\)/g) || []).length;
    const prevItem = userInp[userInp.length - 1];

    // if the amount of times '(' and ')' show up are equivalent or if the last item is an arithmetic symbol open new parentheses
    if (openParent === closeParent || (isNaN(prevItem) && prevItem !== ')')) {
      return addToInp('(');
    }
    // if there are more '(' than ')' and the previous statements are false close the previous parentheses
    if (openParent > closeParent) {
      return addToInp(')');
    }
  }
  // handle the math. This function will run multiple times if there are parentheses involved.
  function doTheMath(str) {
    // this matches all the floats, negatives and integers in the string
    let mathArr = str.match(/([-]\d+[.]\d+)?([-]\d+)?(\d+[.]\d+)?(\d+)?/g);
    // this matches all the arithmetic symbols
    const symbolsInStr = str.match(/[+^÷×]/g);

    // this will be the index in the array of symbols
    let symbolsInStrInd = 0;
    // insert the symbols from the array of symbols into the array of numbers at the index where regex didn't match anything (it returns an empty string)
    for (let arrInd = 0; arrInd < mathArr.length; arrInd++) {
      // if the index is empty (meaning it didn't match in regex), pull the value from the symbols array
      if (mathArr[arrInd] === '' && symbolsInStr) {
        mathArr[arrInd] = symbolsInStr[symbolsInStrInd];
        symbolsInStrInd++;
      }
    }
    // add a '+' before every negative number. Pretty specific example: 6÷(0-1) would return a 'divided by zero error' because the 0 won't go away, and the program would read it as 6÷0-1
    for (let arrInd = 0; arrInd + 1 < mathArr.length; arrInd++) {
      // check if the first character in each string is a '-', and that it's not the first item in the array, and that the previous item in array isn't an arithmetic symbol.
      if (
        mathArr[arrInd][0] === '-' &&
        arrInd !== 0 &&
        mathArr[arrInd - 1].match(/[^+÷×]/g)
      ) {
        // insert '+' into the previous slot in the array
        mathArr.splice(arrInd, 0, '+');
        arrInd++;
      }
    }
    // remove the final undefined from the array to clean it up
    mathArr = mathArr.slice(0, -1);
    // first complete all the divsion and multiplication

    var symbols = {symOne: '×', symTwo: '÷'};

    // if the symbols do not exist in the array, change the values to addition and subtraction
    if (
      !mathArr.includes(symbols.symOne) &&
      !mathArr.includes(symbols.symTwo)
    ) {
      symbols = {symOne: '+', symTwo: '-'};
    }

    // the length of the array will change so keeping a constant will prevent the for loop from breaking
    const mathArrLength = mathArr.length;

    // calculate exponents before other arithmetics.
    while (mathArr.includes('^')) {
      const exponentInd = mathArr.indexOf('^');
      var exponent =
        (mathArr[exponentInd - 1] * 1) ** (mathArr[exponentInd + 1] * 1);
      mathArr.splice(exponentInd - 1, 3, exponent);
    }

    // as long as mathArray contains mathematical symbols calculate stuff
    while (
      mathArr.includes(symbols.symOne) ||
      mathArr.includes(symbols.symTwo)
    ) {
      for (let mathArrInd = 0; mathArrInd < mathArrLength; mathArrInd++) {
        let mathArrVal = mathArr[mathArrInd];
        // this will check if the symbol matches the one that should be calculating first. Without this, as its looping it'll ignore the symbols and do calculations in the wrong order.
        if (mathArrVal === symbols.symOne || mathArrVal === symbols.symTwo) {
          // do multiplication
          if (mathArrVal === '×') {
            var multiplication =
              // the x*1 is to make sure that the numbers are treated as such, rather than strings
              mathArr[mathArrInd - 1] * 1 * (mathArr[mathArrInd + 1] * 1);
            // remove the three items in the array that the calculation was completed on and replace it with the result
            mathArr.splice(mathArrInd - 1, 3, multiplication);
            mathArrInd = 0;
          }
          // do division
          if (mathArrVal === '÷') {
            // ↑↑↑
            var division =
              (mathArr[mathArrInd - 1] * 1) / (mathArr[mathArrInd + 1] * 1);
            mathArr.splice(mathArrInd - 1, 3, division);
            mathArrInd = 0;
          }
          // do addition
          if (mathArrVal === '+') {
            // ↑↑↑
            var addition =
              mathArr[mathArrInd - 1] * 1 + mathArr[mathArrInd + 1] * 1;
            mathArr.splice(mathArrInd - 1, 3, addition);
            mathArrInd = 0;
          }
          // do subtraction
          if (mathArrVal === '-') {
            // ↑↑↑
            var subtraction =
              mathArr[mathArrInd - 1] * 1 - mathArr[mathArrInd + 1] * 1;
            mathArr.splice(mathArrInd - 1, 3, subtraction);
            mathArrInd = 0;
          }
        }
      }
      // once multiplication and division are completed, do addition and subtraction
      symbols = {symOne: '+', symTwo: '-'};
    }
    if (mathArr[0] === 0) {
      return '0';
    }
    // if a user tries to divide by zero, or give a calculation that returns a value that is too high.
    if (mathArr[0] === Infinity || isNaN(mathArr[0])) {
      setErr(true);
      return setOut("Can't divide by zero");
    }
    return mathArr;
  }

  // reset all settings to their default states
  function allClear() {
    setUserInp('');
    setErr(false);
    setOut('');
  }

  function manageUserInp() {
    setOut(() => {
      // if the input string's first character is '+', '^', '÷', '×' return error
      if (userInp.match(/^[+÷×^]/)) {
        setErr(true);
        return 'Strange first character you have there';
      }
      // if there is nothing to retur
      if (userInp.length === 0) {
        setErr(true);
        return 'There is nothing to see here. Move along';
      }
      // check if parentheses amount don't match
      const totalOpen = (userInp.match(/\(/g) || []).length;
      const totalClosed = (userInp.match(/\)/g) || []).length;

      if (totalClosed !== totalOpen) {
        setErr(true);
        return 'Close your parentheses';
      }

      var compute = userInp;
      var parentheses;

      while (!Number(compute)) {
        // only assign compute to parentheses if current is undefined because if the value is reset it will loop forever since it will constantly be reassigned to its original value.
        if (parentheses === undefined) {
          parentheses = compute;
        }

        // these will count up the amount of '(' and ')' in parentheses
        let amountOfOpen = 0;
        let amountOfClosed = 0;

        // Loop through parentheses to see if there are other sets of parentheses inside.
        for (let strInd = 0; strInd < parentheses.length; strInd++) {
          // if it doesn't include other sets calculate the value of the arithmetic set and return it
          if (!parentheses.includes('(') && !parentheses.includes(')')) {
            return doTheMath(parentheses);
          }
          if (parentheses[strInd] === '(') {
            amountOfOpen++;
          }
          if (parentheses[strInd] === ')') {
            amountOfClosed++;
          }
          // if '(' and ')' equal the same amount and ')' does not equal zero it means that there is a valid set of parentheses inside, so that will be considered the new parentheses.
          if (amountOfClosed === amountOfOpen && amountOfClosed !== 0) {
            const a = parentheses.indexOf('(');
            const b = strInd;
            parentheses = parentheses.slice(a + 1, b);
            // if the new sliced and diced string does not include subsets of parentheses
            if (!parentheses.includes('(') && !parentheses.includes(')')) {
              const insertVal = '(' + parentheses + ')';
              // swap out the parentheses value for a new shiny parentheses-less value and assign it to compute so it can be checked again.
              compute = compute.replace(
                // the old parentheses value
                insertVal,
                // the new shiny parentheses-less value
                doTheMath(parentheses),
              );
              // set it to undefined so it can be reassigned to compute on the re-loop
              parentheses = undefined;
              break;
            }
          }
        }
      }
      // if compute does not contain any parentheses calculate it and return the value
      return doTheMath(compute);
    });
  }

  function renderedOutput(output) {
    if (output[0]) {
      output = output.toString();
      if (output.includes('.')) {
        return output;
      }
      output = output.replace('/(?<=\\d)(?=(?:\\d\\d\\d)+(?!\\d))/g', ',');
      return output;
    }
  }

  function newInputFromAnswer() {
    if (!err && out !== '') {
      setUserInp(out.toString());
      setOut('');
      return;
    }
  }

  return (
    <View style={{backgroundColor: '#23419f'}}>
      <Text style={styles.header}>Calculator</Text>
      <View style={styles.input}>
        <Pressable
          style={styles.inOut}
          onPress={() => {
            setUserInp(prevVal => prevVal.slice(0, -1));
          }}>
          <Text style={{fontSize: 15, paddingVertical: 5}}>Backspace</Text>
        </Pressable>
        <ScrollView>
        <Text>{userInp}</Text>
        </ScrollView>
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
              width: 1/4*screenWidth,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: 'blue',
              borderWidth: 1
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
    </View>
  );
}
