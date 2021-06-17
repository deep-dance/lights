<template>
  <div id="app">
    <div class="content">
      <div class="v-spacer-large"></div>
      <h1>led-controller <ServerStatus /></h1>
    </div>
    <div class="content">
      <DMXSender />
    </div>
    <div class="content">
      <h5>Sequence</h5>
      <ControlBar />
      <Upload dataKey='red'/>
      <!-- <LEDSim /> -->
      <!-- <b-button
      variant="primary"
      class="mt-2 left"
      v-bind:class="{ btn_active: this.$store.state.slowMo }"
      @click="toogleSlowMo()"
      >Activate SlowMo</b-button> -->
    </div>
    
  </div>
</template>

<script>
import ControlBar from "./components/ControlBar";
import Upload from "./components/Upload";
import DMXSender from "./components/DMXSender";
import ServerStatus from "./components/ServerStatus";
// import LEDSim from "./components/LEDSim";

export default {
  name: "App",
  components: {
    ServerStatus,
    ControlBar,
    // LEDSim,
    Upload,
    DMXSender
  },
  methods: {
    toogleSlowMo: function() {
      this.$store.commit("SetSlowMo", !this.$store.state.slowMo);
    },
    pressedEnter: function() {
			alert("You pressed the Enter key!");
		},
  },
  mounted() {

  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #32bea6;
  margin-bottom: 300px;
  background-color: #2c3e50;
}
html {
  background-color: #2c3e50;
}
.left {
  float: left;
}
.content {
  width: 90%;
  margin: 0 auto;
  background-color: #2c3e50;
  /* box-shadow: 0px 0px 15px black; */
  padding: 20px 0 40px 0;
  border-bottom: 1px dashed #32bea6;
}

.content h1,
.content h5,
.content h6 {
  text-align: left;
}


@media only screen and (max-width: 500px) {
  .content {
    width: 95%;
  }
}
</style>
