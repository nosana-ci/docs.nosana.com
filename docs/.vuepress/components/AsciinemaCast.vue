<template>
  <div ref="container"></div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    async: {
      type: String,
      required: false,
    },
    speed: {
      type: String,
      required: false,
    },
    idleTimeLimit: {
      type: String,
      required: false,
    },
    preload: {
      type: String,
      required: false
    }
  },
  mounted() {
    // Dynamically create the <script> so Vue doesn't complain

    const script = document.createElement('script')
    script.src = this.src
    script.id = this.id
    script.async = true
    script.speed = 2
    script.idleTimeLimit = 1
    script.preload = false
    this.$refs.container.appendChild(script)

  },
}
</script>
