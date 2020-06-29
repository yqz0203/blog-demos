import React, { useState } from 'react';

function Child() {
  console.log('Child render');
  return null;
}

export default () => {
  const [count, setCount] = useState(0);

  console.log('Render');

  return (
    <div>
      <h2>UseState</h2>
      <p>点击了{count}次</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        按钮+1
      </button>
      <button
        onClick={() => {
          setCount(count);
        }}
      >
        按钮不变
      </button>
      <Child />
    </div>
  );
};
