// 斐波纳契数列
function fib(n) {
  if (n === 0 || n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}

let s1 = Date.now();
fib(40);
console.log("1 Fib cost: ", Date.now() - s1, "ms");
let s2 = Date.now();
fib(40);
console.log("2 Fib cost: ", Date.now() - s2, "ms");
console.log("All Fib cost: ", Date.now() - s1, "ms");

// 缓存单个计算结果
function memorizeOne(fn) {
  let cache = null;
  let cacheArgs = [];
  return (...args) => {
    if (
      cache &&
      cacheArgs.length === args.length &&
      cacheArgs.every((item, index) => item === cacheArgs[index])
    ) {
      return cache;
    }
    cache = fn(...args);
    cacheArgs = args;
    return cache;
  };
}

const memoFib = memorizeOne(fib);

s1 = Date.now();
memoFib(40);
console.log("1 MemoFib cost: ", Date.now() - s1, "ms");
s2 = Date.now();
memoFib(40);
console.log("2 MemoFib cost: ", Date.now() - s2, "ms");
console.log("All MemoFib cost: ", Date.now() - s1, "ms");
