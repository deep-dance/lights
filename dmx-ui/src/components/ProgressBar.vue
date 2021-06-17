<template>
  <div id="progressbar-outer" ref="progressbar" @click=SetFrame>
    <div
      class="progressbar-inner"
      v-bind:class="{ active: this.$store.state.isPlaying }"
      :style="{ width: progressWidth + 'px' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  components: {},
  computed: {
    currentClipLength: function () {
      return Object.keys(this.$store.state.currentJSONData['red'].positions).length *
        this.$store.state.fps;
    },
    progressWidth: function () {
      var currentFrame = this.$store.state.currentFrame;
      var maxWidth = this.$refs.progressbar ? this.$refs.progressbar.clientWidth : 500;
      return (maxWidth * currentFrame) / this.currentClipLength;
    },
  },

  methods: {
    SetFrame(event) {
        var x = event.clientX - this.$refs.progressbar.getBoundingClientRect().left;
        var maxWidth = this.$refs.progressbar.clientWidth;
        var frame = Math.round((this.currentClipLength * x) / maxWidth);
        console.log('progress', frame);
        this.$store.commit("SetCurrentFrame", frame);
    },
  },
  mounted() {

  },
};
</script>

<style>
#progressbar-outer {
  vertical-align: middle;
  width: 95%;
  /* width: 700px; */
  height: 25px;
  background-color: #222222;
  display: inline-block;
  margin: 0 0 0 10px;
}
@media only screen and (max-width: 500px) {
  #progressbar-outer {
    width: 80%;
  }
}
.progressbar-inner {
  height: 20px;
  background-color: #32bea6;
}

.active {
  background-color: #f28400;
}
</style>
