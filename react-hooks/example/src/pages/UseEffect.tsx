import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

export default () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [data, setData] = useState('');

  useEffect(() => {
    console.log('Loading...');
    fetch('/data.json')
      .then(res => res.text())
      .then(res => {
        setData(res + Math.random());
      });
  }, [count]);

  useLayoutEffect(() => {
    console.log('Layout');
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(countRef.current, new Date());
    }, 1000);

    return () => {
      console.log('Clear...');
      clearInterval(timer);
    };
  }, []); // 由于Ref在组件声明周期是不变的，所以不需要写入依赖

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  return (
    <div>
      <h2>UseEffect</h2>
      <p>{data}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        触发render
      </button>
    </div>
  );
};
