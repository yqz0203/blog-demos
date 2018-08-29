const RNP = require('./RNP');

function calRNP(rnpArr) {
  const operandStack = [];
  let l = rnpArr.length;

  let index = 0;
  while (index < l) {
    const item = rnpArr[index];

    switch (item) {
      case 'f': {
        const op = operandStack.pop();
        operandStack.push(-op);
        break;
      }
      case '+': {
        const op1 = operandStack.pop();
        const op2 = operandStack.pop();
        operandStack.push(op1 + op2);
        break;
      }
      case '-': {
        const op1 = operandStack.pop();
        const op2 = operandStack.pop();
        operandStack.push(op1 - op2);
        break;
      }
      case '*': {
        const op1 = operandStack.pop();
        const op2 = operandStack.pop();
        operandStack.push(op1 * op2);
        break;
      }
      case '/': {
        const op1 = operandStack.pop();
        const op2 = operandStack.pop();
        operandStack.push(op1 / op2);
        break;
      }
      default:
        operandStack.push(item);
    }

    index++;
  }

  if (isNaN(operandStack[0]) || operandStack.length > 1) {
    throw new Error('不合法的算术表达式');
  }

  return operandStack[0];

}

const rnpArr = RNP('3*(32*(2+10)+10)');
console.log(rnpArr);
console.log(calRNP(rnpArr));