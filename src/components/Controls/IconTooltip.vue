<template>
  <v-tooltip v-bind="tooltip">
    <template #activator="{ attrs, on }">
      <v-icon v-bind="{ ...attrs, ...icon }" v-on="on">mdi-alert</v-icon>
    </template>
    <span>{{ tooltip.text }}</span>
  </v-tooltip>
</template>

<script>
  export default {
    name: 'iconTooltip',
    props: {
      iconOpts: {
        type: Object,
        default: () => ({}),
      },
      tooltipOpts: {
        type: Object,
        default: () => ({}),
      },
    },
    computed: {
      icon() {
        const defaults = {
          color: 'primary',
        }
        return { ...defaults, ...this.iconOpts }
      },
      tooltip() {
        let top = true
        const positions = ['top', 'right', 'bottom', 'left ']
        positions.forEach(p => (this.tooltipOpts[p] ? (top = false) : null))
        const defaults = {
          color: 'primary',
          top,
        }
        return { ...defaults, ...this.tooltipOpts }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
