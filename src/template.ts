const template = `
@Component({
  components: { {{each components value i}}  {{value}},{{/each}} }
})
export default class {{className}} extends Vue {
  // props
{{each props value key}}  @Prop({ default: {{@ value.default }} }) {{@ value.name }}!: {{@ value.type }};
{{/each}}
  // data
{{each data value key}}  {{@key}} = {{@value}};
{{/each}}

  // computed
{{each computed value i}}  get {{@value}}
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
