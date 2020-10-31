const demo = `
export default {
  name: "DemoComponent",
  props: {
    visibilityHeight: {
      type: Number,
      default: 400,
    },
    backPosition: {
      type: Number,
      default: 0,
    },
    customStyle: {
      type: Object,
      default: {
        right: "50px",
        bottom: "50px",
        width: "40px",
        height: "40px",
        "border-radius": "4px",
        "line-height": "45px",
        background: "#e7eaf1",
      },
    },
    transitionName: {
      type: String,
      default: "fade",
    },
  },
  components: {
    HelloWorld,
    HelloWorld2,
  },
  data() {
    return {
      name: "name1",
      a: 1,
      b: {},
      c: [{ d: 1 }],
    };
  },
  computed: {
    m1(x, y) {
      return {};
    },
    m2() {
      return this.a;
    },
  },
  created() {
    console.log(1);
  },
  mounted() {
    setInterval(() => {
      console.log(1);
    }, 1000);
  },
  methods: {
    f1() {
      return {};
    },
    f2() {
      return {};
    },
  },
};

`;

export default demo;
