<script lang="jsx">
export default {
  name: 'SvgIcon',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      SvgComponent: null,
    }
  },
  created() {
    this.getSvgComponent()
  },
  methods: {
    async getSvgComponent() {
      if (!this.name) {
        return
      }

      const module = await import(`../svg/${this.name}.svg?component`)
      this.SvgComponent = module.default.render()
      // console.log('this.SvgComponent', this.SvgComponent)
    },
  },
  render() {
    console.log('this', this)
    if (this.SvgComponent) {
      const props = this.SvgComponent.props
      return {
        ...this.SvgComponent,
        props: {
          ...props,
          ...this.$attrs,
          class: ['svg-icon', props.class || '', this.$attrs.class || ''].join(
            ' ',
          ),
        },
      }
    }

    if (!this.name && this.$slots.default) {
      const SlotComponent = this.$slots.default()[0]
      const props = SlotComponent.props || {}
      return {
        ...SlotComponent,
        props: {
          ...props,
          ...this.$attrs,
          class: ['svg-icon', props.class || '', this.$attrs.class || ''].join(
            ' ',
          ),
        },
      }
    }

    return ''
  },
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
