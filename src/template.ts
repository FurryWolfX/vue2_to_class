const template = `
@Component({
  components: { {{each components value i}}  {{value}},{{/each}} }
})
export default class {{className}} extends Vue {
  // props
{{each props value key}}  @Prop({ default: {{@ value.default }} }) {{@ value.name }}!: {{@ value.type }};
{{/each}}
  // data
{{@data}}

  // computed
{{each computed value i}}  get {{@value}}
{{/each}}

  // watch
{{each watch value i}}  @Watch()
  {{@value}}
{{/each}}

  // life
{{each life value i}}{{@value}}
{{/each}}

  // methods
{{each methods value i}}  {{@value}}
{{/each}}

}
`;

export default template;
