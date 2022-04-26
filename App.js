import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styles from './Components/styles';
import Boards from './Components/Boards';
import InputOutput from './Components/InputOutput';

export default function App() {
  // these should be self explanatory
  const [userInp, setUserInp] = useState('');
  const [out, setOut] = useState('');
  const [err, setErr] = useState(false);

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
  return (
    <View style={{backgroundColor: '#23419f'}}>
      <Text style={styles.header}>Calculator</Text>
      <InputOutput 
        renderedOutput={renderedOutput}
        out={out}
        err={err}
        userInp={userInp}
        newInputFromAnswer={newInputFromAnswer}
        setUserInp={setUserInp}
      />
      <Boards
        setErr={setErr}
        addParenthesis={addParenthesis}
        allClear={allClear}
        manageUserInp={manageUserInp}
        addToInp={addToInp}
      />
    </View>
  );
}
