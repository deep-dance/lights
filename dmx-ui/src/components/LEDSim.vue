<template>
  <div id="led-sim">
    <b-button
      v-b-toggle.collapse-1
      variant="primary"
      class="mt-2 left"
      >Show LED Simulation</b-button
    >
    <b-collapse id="collapse-1" class="mt-2 left">
      <canvas id="leds" width="1500" height="50"></canvas>
    </b-collapse>
  </div>
</template>

<script>
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    leds: [],
    ledCount: 120,
  },
});

export default {
  name: "LEDSim",
  components: {},
  methods: {
    drawLEDs: function (event) {
      var canvas = document.getElementById("leds");
      if (canvas.getContext) {
        var x_pos = 30;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (var i = 0; i < store.state.leds.length; i++) {
          var X = x_pos;
          var Y = 25;
          var R = 4;
          ctx.beginPath();
          ctx.arc(X, Y, R, 0, 2 * Math.PI);
          if (store.state.leds[i].velocity > 0) {
            ctx.fillStyle = "white";
            ctx.fill();
          } else {
            ctx.strokeStyle = "white";
            ctx.stroke();
          }

          x_pos += 12;
        }
      }
    },
    initLEDs: function (event) {
      for (var i = 0; i < store.state.ledCount; i++) {
        store.state.leds[i] = {color: 1, velocity: 127};
      }
    },
    updateLEDs: function (event) {
      var state = this.$store.state;
      var frameIdx = state.currentFrame;

      if (state.currentJSONData['red']) {
        var positions = state.currentJSONData['red'].positions[frameIdx];

        if (positions !== undefined) {
          positions.forEach(pos => {
            store.state.leds[pos] = {color: 1, velocity: 0}
          });
        }
      }  
    },
    update: function (currentFrame) {
      if (currentFrame == 0)
        this.initLEDs();
      else
        this.updateLEDs();
      this.drawLEDs();
    },
    dec2hex: function (number) {
      return '#00' + (number + 0x10000).toString(16).substr(-4).toUpperCase();
    }
  },
  mounted() {
    this.initLEDs();
    this.drawLEDs();

    this.$store.watch(
      (state) => this.update(state.currentFrame)
    );
  },
};
</script>

<style>
#led-sim {
  margin-top: 30px;
  min-height: 120px;
  width:20%;
}
#leds {
  margin: 15px 0 0 0;
  background-color: #101010;
}
</style>