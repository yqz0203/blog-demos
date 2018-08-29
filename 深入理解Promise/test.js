const MyPromise = require('./Promise:A+');

function genPromise() {
  return new MyPromise(function (resolve, reject) {
    setTimeout(resolve, 1000, MyPromise.resolve('ssss'));
  })
}

async function run(){
  const result = await genPromise();
  console.log(result);
}

run();