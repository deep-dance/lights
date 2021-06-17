<template>
  <div id="server-status">
    <div id="server-status-icon"
      v-bind:class="{ 
        connected: this.$store.state.dmxConnected,
        disconnected: !this.$store.state.dmxConnected
      }">
    </div>
    <!-- <p>Status</p> -->
  </div>
</template>

<script>
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {},
});

export default {
  name: "ServerStatus",
  components: {},
  methods: {
    
  },
  mounted() {
    // this.initLEDs();
    // this.drawLEDs();

    // this.$store.watch(
    //   (state) => this.update(state.currentFrame)
    // );
  },
};
</script>

<style>
#server-status {
  float: right;
  width: 15%;
  padding: 15px 0 15px 0;
}

#server-status-icon {
  width: 30px;
  height: 30px;
  float: right;
  border: 1px solid #32bea6;
}

#server-status p {
  font-size: 20px;
  float: right;
  padding: 2px 20px 0 0;
}

.disconnected {
  background-color: red;
}

.connected {
  background-color: green;
}

</style>