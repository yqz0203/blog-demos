const esprima = require('esprima');

const code = `
// TODO:
const val = 10;

for(let i = 0;i<10;i++){
  console.log('current: ', i);
}

function Foo (){
  this.bar = 10;
}
`;

const tokens = esprima.tokenize(code, { comment: true });

console.log('%o', tokens);

const tree = esprima.parseScript(code, { comment: true });

console.log('%o', tree);
