
const operatorLevel = {
  '#': -1,
  '+': 0,
  '-': 0,
  '*': 1,
  '/': 1,
  'f': 2, // 取负值
  '(': 10,
  ')': 10,
}

const isNumber = (char) => {
  return /[0-9.]/.test(char);
}

const isOperator = (char) => {
  return /[+\-/*()]/.test(char);
}

const isValid = (char) => {
  return isNumber(char) || isOperator(char);
}

module.exports = function (expression) {
  // 临时运算符栈
  const operatorStack = ['#'];
  // 逆波兰式栈
  const rnpStack = [];

  const l = expression.length;
  let index = 0;
  // 临时操作数
  let tempNumber = '';

  while (index < l) {
    const char = expression[index];

    if (char === '') {
      index++;
      continue;
    }

    if (!isValid(char)) {
      throw new Error(`位置${index}存在不合法的字符:${char}`);
    }

    // 操作数
    if (isNumber(char)) {
      tempNumber += char;
    } else if (isOperator(char)) {
      if (tempNumber !== '') {
        // 操作数入栈
        rnpStack.push(tempNumber * 1);
        tempNumber = '';
      }

      // 处理不是括号的情况
      if (char !== '(' && char !== ')') {
        /**
         * 检查运算符优先级
         * 大于栈顶优先级，直接入栈
         * 将栈顶元素依次出栈，
         * 放入rnpStack，直到优先级低于当前操作数
         */
        let l2 = operatorStack.length;
        while (l2) {
          l2--;
          const topOperator = operatorStack[l2];

          // 判断取负值
          if (char === '-') {
            const preChar = expression[index - 1];
            // 如果是对当前值取负
            if (index === 0 || (preChar !== ')' && isOperator(preChar))) {
              operatorStack.push('f');
              break;
            }
          }

          // 括号运算符直接插入
          if (topOperator === '(' || topOperator === ')') {
            operatorStack.push(char);
            break;
          }

          if (operatorLevel[char] < operatorLevel[topOperator]) {
            operatorStack.pop();
            rnpStack.push(topOperator);
          } else {
            operatorStack.push(char);
            break;
          }
        }
      } else if (char === '(') {
        operatorStack.push(char);
      } else { // ')'
        const temp = [];
        let matched = false;

        while (operatorStack.length) {
          const operator = operatorStack.pop();
          if (operator === '(') {
            rnpStack.push(...temp);
            matched = true;
            break;
          }
          temp.push(operator);
        }

        // 这里对括号的匹配情况做检查
        if (!matched) {
          throw new Error(`位置${index}存在多余的')'`);
        }
      }

    } else {
      throw new Error(`位置${index}为不合法的字符${char}`)
    }

    index++;

    // 最后一个数字
    if (index === l && tempNumber) {
      rnpStack.push(tempNumber);
    }
  }

  // 将剩余的操作符入栈
  let op;
  while (op = operatorStack.pop()) {
    if (op === '(') {
      throw new Error(`存在未关闭的(`)
    }

    if (op !== '#') {
      rnpStack.push(op);
    }
  }

  return rnpStack;
}