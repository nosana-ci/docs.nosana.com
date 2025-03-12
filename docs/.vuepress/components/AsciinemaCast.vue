<template>
  <div ref="player"></div>
</template>

<script>
import * as AsciinemaPlayer from 'asciinema-player'

function Base64() {
  // private property
  const _keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // public method for encoding
  this.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output =
        output +
        _keyStr.charAt(enc1) +
        _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) +
        _keyStr.charAt(enc4);
    }
    return output;
  };

  // public method for decoding
  this.decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9+/=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  };

  // private method for UTF-8 encoding
  let _utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  };

  // private method for UTF-8 decoding
  let _utf8_decode = function (utftext) {
    let string = "";
    let i = 0;
    let c = 0;
    //let c1 = 0;
    let c2 = 0;
    let c3 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        i += 3;
      }
    }
    return string;
  };
}

const Base64Instance = new Base64();
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
    idleTimeLimit: {
      type: Number,
      default: 1
    },
    preload: Boolean,
    autoplay: Boolean,
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
          "data:text/plain;base64," + Base64Instance.encode(this.src).toString();
      }

      this.player = AsciinemaPlayer.create({
        url: data,
        fetchOpts: { method: 'POST' },
      },
        this.$refs.player,
        {
          cols: this.cols,
          rows: this.rows,
          loop: true,
          "font-size": this.fontSize,
          title: this.title,
          author: this.author,
          "author-img-url": this.authorImgUrl,
          "author-url": this.authorUrl,
          theme: this.theme,
          "idle-time-limit": this.idleTimeLimit,
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
