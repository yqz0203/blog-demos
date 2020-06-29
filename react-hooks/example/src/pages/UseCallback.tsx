import React, { useState, useCallback, useEffect } from 'react';

function getName() {
  const names = [
    '杨骐彰',
    '刘烁玉',
    '王聪',
    '郑冀',
    '李欣',
    '彭道松',
    '蔡洪全',
    '杨帆',
    '张晓伟',
    '李童',
    '晋泽泽',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

interface Item {
  id: number;
  name: string;
}

interface ItemProps {
  data: Item;
  onClick(item: Item): void;
}

const ItemComp = React.memo((props: ItemProps) => {
  console.log('Render:', props.data.id);
  return (
    <div onClick={() => props.onClick(props.data)} style={{ padding: 10 }}>
      {props.data.name}
    </div>
  );
});

export default () => {
  const [now, setNow] = useState(new Date());
  const [data] = useState(() => {
    const list = [];

    for (let i = 0; i < 100; i++) {
      list.push({
        id: i,
        name: i + '-' + getName(),
      });
    }

    return list;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleClick = useCallback((item: Item) => {
    alert(item.name);
  }, []);

  return (
    <div>
      <h2>useCallback</h2>
      <p>{now.toString()}</p>
      <div style={{ height: 300, overflow: 'auto' }}>
        {data.map(item => (
          <ItemComp key={item.id} data={item} onClick={handleClick} />
        ))}
      </div>
    </div>
  );
};
