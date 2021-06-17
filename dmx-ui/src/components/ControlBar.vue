<template>
  <div id="playhead">
    <div
      v-if="this.$store.state.currentJSONData['red'] != null"
      id="controlBar"
    >
      <PlayIcon
        v-if="!this.$store.state.isPlaying"
        @click="StartAnimation()"
        class="icon"
      />
      <PauseIcon
        v-if="this.$store.state.isPlaying"
        @click="PauseAnimation()"
        class="icon"
      />
      <ProgressBar />

      <div class="minutes-control">
        <div class="minutes">
          {{ this.convertFrameToTime(this.$store.state.currentFrame) }}
          /
          {{ this.convertFrameToTime(
            Object.keys(this.$store.state.currentJSONData["red"].positions).length * 25) 
          }}
        </div>
        <input
          @change="SetTime"
          value=""
          type="text"
          ref="timeInput"
          placeholder="mm:ss"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PlayIcon from "../icons/Play_4.svg";
import PauseIcon from "../icons/Pause_4.svg";
import ProgressBar from "./ProgressBar";

export default {
  name: "App",
  components: {
    PlayIcon,
    PauseIcon,
    ProgressBar,
  },
  data: function () {
    return {
      frameIdx: 0,
    };
  },

  methods: {
    alertInvalid() {
      alert("Please use a valid timestamp, e.g 13:12.");
      this.$refs.timeInput.value = ""
    },
    alertOutOfRange() {
      alert("Timestamp is after end of sequence.");
      this.$refs.timeInput.value = ""
    },
    SetTime() {
      var time = this.$refs.timeInput.value;
      var re = new RegExp('[0-9][0-9]*:([0-9][0-9]){1}');
      if (!re.test(time)) {
        this.alertInvalid();
      } else {
        var components = time.split(":");
        var minutes = parseInt(components[0]);
        var seconds = parseInt(components[1]);
        if (minutes < 0 || (seconds < 0 || seconds > 59)) {
          this.alertInvalid();
        }
        else {
          var timestamp = (minutes * 60) + seconds;
          var frame = timestamp * this.$store.state.fps;
          var maxFrames = 
            Object.keys(this.$store.state.currentJSONData["red"].positions).length * 
              this.$store.state.fps;
          if (frame > maxFrames)
            this.alertOutOfRange();
          else
            this.$store.commit("SetCurrentFrame", frame);
        }
        
      }
    },
    StartAnimation() {
      this.$store.commit("SetAnimationStatus", true);
    },
    PauseAnimation() {
      this.$store.commit("SetAnimationStatus", false);
    },
    mapSeconds(value, inMin, inMax, outMin, outMax) {
      return (value - inMin) * (outMax - outMin) / 
        (inMax - inMin) + outMin;
    },
    convertFrameToTime(frame) {
      var value = Math.round(
        (frame / this.$store.state.fps / 60) *
          100
      ) / 100;
      var minutes = Math.floor(value);
      var seconds = Math.ceil(this.mapSeconds(value % 1, 0.0, 0.99999, 0, 59));
      return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
    },
    convertTimeToFrame(minutes, seconds) {
      return 0;
    }
  },
  mounted() {},
};
</script>

<style scoped>
#playhead {
  /* height: 155vh; */
}
#controlBar {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
}
.icon {
  width: 3%;
  /* min-height: 30px; */
  margin-right: 3px;
  display: inline-block;
  vertical-align: middle;
  background-size: cover;
}

.frames {
  height: 30px;
  margin-right: 3px;
  margin-top: -15px;
}
.filename {
  margin: 10px 10px;

} 
.minutes-control {
  display: inline-block;
  vertical-align: middle;
  font-size: 16pt;
  margin-top: 20px;
  width: 100%;
}
.minutes {
  display: block;
  width: 82%;
  margin: 0;
  float: left;
  padding: 7px 0px 0 0;
  text-align: right;
}
input {
  width: 15%;
  background-color: #2c3e50;
  border: 1px solid #32bea6;
  color: #32bea6;
  height: 40px;
  text-align: center;
  font-size: 1rem;
  float: right;
  margin-left: 10px;
}
</style>
