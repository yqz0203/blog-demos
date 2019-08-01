import MVVM from './MVVM';

const initialData = () => ({
  name: 'John',
  age: 10,
  gender: 1,
  submiting: false,
  currentTime: new Date(),
  extra: {
    like: 'game',
  },
  showInfo: true,
  list: [{ name: 'yqz' }, { name: 'shenjingwei' }],
});

new MVVM({
  el: document.getElementById('app')!,
  data: initialData(),
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
    currentTimeStr() {
      return this.currentTime.toLocaleString();
    },
  },
  methods: {
    changeGender() {
      this.gender = this.gender == 1 ? 0 : 1;
    },

    toggleShowInfo() {
      this.showInfo = !this.showInfo;
    },

    reset() {
      const newData = initialData();
      this.setData(newData);
    },

    submit() {
      this.submiting = true;

      setTimeout(() => {
        alert('提交成功');
        this.submiting = false;
      }, 1000);
    },
  },
});

export default null;
