import MVVM from './MVVM';

const initialData = {
  name: 'John',
  age: 10,
  gender: 1,
  currentTime: new Date(),
  extra: {
    like: 'game',
  },
  list: [{ name: 'yqz' }, { name: 'shenjingwei' }],
};

new MVVM({
  el: document.getElementById('app')!,
  data: initialData,
  created(this: any) {
    this.interval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  destroy(this: any) {
    clearInterval(this.interval);
  },
  computed: {
    genderText() {
      return this.gender == 1 ? '男' : '女';
    },
    currentTimeDateStr() {
      return this.currentTime.toLocaleTimeString();
    },
  },
  methods: {
    changeGender() {
      this.gender = this.gender == 1 ? 0 : 1;
    },

    reset() {
      this.name = 'john';
      Object.keys(initialData).forEach(k => {
        // @ts-ignore
        this[k] = initialData[k];
      });
    },

    delete(e: any) {
      console.log(e.target.dataset.id);
    },
  },
});

export default null;
