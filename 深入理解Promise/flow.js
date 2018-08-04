function flow() {
  const taskQueue = Array.from(arguments);
  const l = taskQueue.length;
  let currentIndex = -1;

  function next(...args) {
      const index = ++currentIndex;

      if (index === l) {
          return args;
      }
      const task = taskQueue[index];
      task(next, ...args);
  }

  return next;
}