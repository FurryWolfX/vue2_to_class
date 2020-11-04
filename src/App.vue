<template>
  <div>
    <div>注：转换前请格式化，缩进为2个空格，否则不会被正常解析</div>
    <a-row>
      <a-col :span="12">
        <a-textarea v-model="input" placeholder="请输入传统Vue2组件" :auto-size="{ minRows: 30, maxRows: 30 }" />
      </a-col>
      <a-col :span="12">
        <a-textarea :value="output" placeholder="输出的Vue Class" :auto-size="{ minRows: 30, maxRows: 30 }" readonly />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import templateStr from "./template";
import demo from "./demo";

@Component
export default class App extends Vue {
  private input: string = demo;

  get output(): string {
    const className = this.getClassName();
    console.log("className", className);
    const components = this.getComponents();
    console.log("components", components);
    const data = this.getData();
    console.log("data", data);
    const computed = this.getComputed();
    console.log("computed", computed);
    const methods = this.getMethods();
    console.log("methods", methods);
    const props = this.getProps();
    console.log("props", props);
    const life = this.getLife();
    console.log("life", life);
    return window.template.render(templateStr, { className, components, data, computed, methods, props, life });
  }

  getClassName() {
    const reg = /name:\s*["'](\w+)["'],/;
    const className = this.input.match(reg);
    if (className && className[1]) {
      return className[1];
    } else {
      return "*";
    }
  }
  getComponents() {
    const reg = /components:\s*{\s*([\w\s,]*)\s*}/;
    const components = this.input.match(reg);
    if (components && components[1]) {
      return components[1]
        .split(",")
        .map((c) => c.trim())
        .filter((c) => !!c);
    } else {
      return [];
    }
  }
  getData() {
    const reg1 = /[ ]{2}data[\s(){}]*return\s*{([\s\S]*?)\n[ ]{2}}/;
    const reg2 = /^[ ]{6}[\w_]+:/gm;
    const reg3 = /(^[ ]{6}[\S]+[ ]*=[ ]*[\S]+,$)|(^[ ]{6}},)/gm;
    const data = this.input.match(reg1);
    if (data && data[1]) {
      const data2 = data[1].replace(reg2, (v) => {
        return v.replace(":", " =")
      })
      return data2.replace(reg3, (v) => {
        return v.substr(0, v.length - 1) + ";"
      });
    } else {
      return "";
    }
  }
  getComputed() {
    const reg1 = /[ ]{2}computed:\s*{\s*((.|\s)*?\n)[ ]{2}}/;
    const computed = this.input.match(reg1);
    if (computed && computed[1]) {
      const temp = eval(`const temp={${computed[1]}};temp;`);
      return Object.keys(temp).map((k) => {
        return temp[k].toString();
      });
    } else {
      return [];
    }
  }
  getMethods() {
    const reg1 = /[ ]{2}methods:\s*{\s*((.|\s)*?\n)[ ]{2}}/;
    const methods = this.input.match(reg1);
    if (methods && methods[1]) {
      const temp = eval(`const temp={${methods[1]}};temp;`);
      return Object.keys(temp).map((k) => {
        return temp[k].toString();
      });
    } else {
      return [];
    }
  }
  getProps() {
    const reg1 = /[ ]{2}props:\s*{\s*((.|\s)*?\n)[ ]{2}}/;
    const props = this.input.match(reg1);
    if (props && props[1]) {
      const temp = eval(`const temp={${props[1]}};temp;`);
      return Object.keys(temp).map((key) => {
        return {
          name: key,
          default: JSON.stringify(temp[key].default),
          type: this.getType(temp[key].type),
        };
      });
    } else {
      return [];
    }
  }
  getType(type: any) {
    switch (type) {
      case Number:
        return "number";
      case String:
        return "string";
      case Boolean:
        return "boolean";
      case Array:
        return "any[]";
      case Object:
        return "any";
    }
  }
  getLife() {
    const reg1 = /[ ]{2}(beforeCreate|created|beforeMount|mounted|beforeUpdate|updated|beforeDestroy|destroyed|activated|deactivated)(.|\s)*?\n[ ]{2}}/g;
    const life = this.input.match(reg1);
    return life || [];
  }
}
</script>

<style lang="scss" scoped>
.logo {
  text-align: center;
  img {
    height: 200px;
  }
}
.title {
  text-align: center;
}
</style>
