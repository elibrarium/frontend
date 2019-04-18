<template>
  <b-container :fluid="fluid" :tag="tag">
    <b-row v-if="title">
      <b-col>
        <h1 class="page-title">
          {{ title }}
          <slot name="actions">
          </slot>
        </h1>
        <hr>
      </b-col>
    </b-row>
    <slot>
      <b-row>
        <b-col>
          <h1>Nothing to show</h1>
        </b-col>
      </b-row>
    </slot>
  </b-container>
</template>

<script>
export default {
  name: 'ContentArea',
  props: {
    fluid: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: 'div',
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
  h1.page-title {
    margin-top: 36px;
    text-align: left;
  }
  hr {
    margin-bottom: 32px;
  }
</style>
