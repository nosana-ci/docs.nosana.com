<template>
  <div ref="player"></div>
</template>

<script>
import * as AsciinemaPlayer from 'asciinema-player'

// Base64 UTF8 String Encoder
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}

export default {
  name: "asciinema-player-vue",
  props: {
    src: String,
    cols: Number,
    rows: Number,
    title: String,
    author: String,
    authorUrl: String,
    authorImgUrl: String,
    title: String,
    idleTimeLimit: {
      type: Number,
      default: 1
    },
    preload: Boolean,
    loop: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: Number,
      default: 8
    },
    rows: {
      type: Number,
      default: 20,
      validator(value) {
        return value > 0;
      }
    },
    cols: {
      type: Number,
      default: 80,
      validator(value) {
        return value > 0;
      }
    },
    speed: {
      type: Number,
      default: 1,
      validator(value) {
        return value > 0;
      }
    },
    poster: {
      type: String,
      default: "data:text/plain, \u001b]0;nosana@nos-os: ~\u0007\u001b[01;32mnosana@nos-os\u001b[00m:\u001b[01;34m~\u001b[00m$ ",
    },
    startAt: String,
    theme: {
      type: String,
      default: "asciinema",
      validator(value) {
        return (
          [
            "asciinema",
            "tango",
            "solarized-dark",
            "solarized-light",
            "monokai"
          ].indexOf(value) != -1
        );
      }
    }
  },
  data() {
    return {
      player: null
    };
  },
  watch: {
    src(newValue, oldValue) {
      if (newValue && oldValue !== newValue) {
        this.destoryInstance();
      }
      this.createPlayer();
    }
  },
  methods: {
    pause() {
      if (this.player) {
        this.player.pause();
      }
    },
    play() {
      if (this.player) {
        this.player.play();
      }
    },
    createPlayer() {
      let data = this.src;
      if (
        this.src &&
        !this.src.endsWith(".json") &&
        !this.src.endsWith(".cast")
      ) {
        data =
          "data:text/plain;base64," + b64EncodeUnicode(this.src).toString();
      }

      this.player = AsciinemaPlayer.create({
        url: data,
        fetchOpts: { method: 'POST' },
      },
        this.$refs.player,
        {
          cols: this.cols,
          rows: this.rows,
          loop: this.loop,
          fontSize: this.fontSize,
          title: this.title,
          author: this.author,
          authorImgUrl: this.authorImgUrl,
          authorUrl: this.authorUrl,
          theme: this.theme,
          idleTimeLimit: this.idleTimeLimit,
          startAt: this.startAt,
          poster: this.poster,
          speed: this.speed,
          autoPlay: this.autoplay,
          preload: this.preload
        }
      );
    },
    destoryInstance() {
      AsciinemaPlayer.UnmountPlayer(this.$refs.player);
      this.player = null;
    }
  },
  beforeDestroy() {
    this.destoryInstance();
  },
  mounted() {
    try {
      this.createPlayer();
    } catch (error) {
      console.error(error)
    }
  }
};
</script>

<style lang="scss">
@import url('https://cdn.jsdelivr.net/npm/asciinema-player@3.9.0/dist/bundle/asciinema-player.css');
</style>
