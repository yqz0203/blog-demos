const {
  SyncHook,
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook,
} = require('tapable');

class Man {
  constructor() {
    this.hooks = {
      study: new AsyncSeriesHook(['lesson']),
      meat: new AsyncSeriesWaterfallHook(['meat']),
    };
  }

  study(lesson) {
    this.hooks.study.callAsync(lesson, err => {
      if (err) {
        console.log(lesson, '发生错误：', err.message);
      } else {
        console.log(lesson, '学习完成');
      }
    });
  }

  meat(time) {
    this.hooks.meat.callAsync(time, (err, result) => {
      if (err) {
        console.log(time, '发生错误：', err.message);
      } else {
        console.log(time + '吃了：' + result);
      }
    });
  }
}

const man = new Man();

man.hooks.study.tapAsync('WatchLesson', (lesson, cb) => {
  console.log('开始学习:', lesson);

  setTimeout(() => {
    if (lesson === '英语') {
      cb();
    } else {
      cb(new Error('学不动'));
    }
  }, 3000);
});

man.hooks.meat.tapAsync('餐前饮料', (time, cb) => {
  setTimeout(() => {
    cb(null, '餐前饮料-可乐');
  }, 200);
});

man.hooks.meat.tapAsync('正餐', (prev, cb) => {
  setTimeout(() => {
    cb(null, prev + ' 正餐-红烧肉');
  }, 200);
});

man.hooks.meat.tapAsync('甜点', (prev, cb) => {
  setTimeout(() => {
    cb(null, prev + ' 甜点-蛋糕');
  }, 200);
});

// man.study('语文');
// man.study('英语');
man.meat('早饭');
