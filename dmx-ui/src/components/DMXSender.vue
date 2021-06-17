<template>
  <div id="dmx-sender">
    <h5>Direct</h5>
    <b-button
      variant="primary"
      class="mt-2 left"
      v-bind:class="{ btn_active: this.$store.state.dmxActive }"
      @click="directOff()"
    >Off</b-button>
    <b-button
      variant="primary"
      class="mt-2 left"
      v-bind:class="{ btn_active: this.$store.state.dmxActive }"
      @click="directWhite()"
    >White</b-button>
    
  </div>
</template>

<script>
const http = require('http')
const Queue = require('queue-fifo');

const led_count = 108;

const performance_hp1 = [
  {
    start: 0,               // 0:00
    end: 7500,              // 5:00
    from: 'ffffffffff00',   // White
    to: 'ffffffffff00',     // White
    animated: false,
    fade: 500,
  },
  {
    start: 7500,            // 5:00
    end: 42000,             // 28:00
    from: 'ffffffffff00',   // White
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  {
    start: 42000,           // 28:00
    end: 49500,             // 33:00
    from: '00000000ff00',   // Amber
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  {
    start: 49500,           // 33:00
    end: 57000,             // 38:00
    from: '00000000ff00',   // Amber
    to: '00000000ffff',     // Amber+UV
    animated: true,
    fade: 500,
  },
  {
    start: 57000,           // 38:00
    end: 60000,             // 40:00
    from: '00000000ffff',     // Amber+UV
    to: '0000000000ff',     // UV
    animated: false,
    fade: 500,
  },
  {
    start: 60000,           // 40:00
    end: 63000,             // 42:00
    from: '0000000000ff',     // UV
    to: '0000000000ff',     // UV
    animated: false,
    fade: 500,
  },
  {
    start: 63000,           // 42:00
    end: 90025,             // 60:02
    from: '0000000000ff',     // UV
    to: 'ff00000000ff',     // Red+UV
    animated: true,
    fade: 500,
  }
]

const performance_hp2 = [
  {
    start: 0,               // 0:00
    end: 7500,              // 5:00
    from: 'ffffffffff00',   // White
    to: 'ffffffffff00',     // White
    animated: false,
    fade: 500,
  },
  {
    start: 7500,            // 5:00
    end: 46500,             // 31:00
    from: 'ffffffffff00',   // White
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  {
    start: 46500,           // 31:00
    end: 49500,             // 33:00
    from: '00000000ff00',   // Amber
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  {
    start: 49500,           // 33:00
    end: 63000,             // 42:00
    from: '00000000ff00',   // Amber
    to: '00000000ee33',     // UV
    animated: true,
    fade: 500,
  },
  {
    start: 63000,           // 42:00
    end: 67500,             // 45:00
    from: '00000000ee33',   // UV
    to: '0000000000ff',     // UV
    animated: false,
    fade: 500,
  },
  {
    start: 67500,           // 45:00
    end: 72000,             // 48:00
    from: '0000000000ff',   // UV
    to: '0000000000ff',     // UV
    animated: false,
    fade: 500,
  },
  {
    start: 72000,           // 48:00
    end: 87000,             // 58:00
    from: '0000000000ff',   // UV
    to: 'ff00005500ff',     // Red+White+UV
    animated: true,
    fade: 500,
  },
  {
    start: 87000,           // 58:00
    end: 90025,             // 60:01
    from: 'ff00005500ff',   // Red+White+UV
    to: 'ff00005500ff',     // Red+White+UV
    animated: true,
    fade: 500,
  },
];

const performance_gp = [
  {
    start: 0,               // 0:00
    end: 7500,              // 5:00
    from: 'ffffffffff00',   // White
    to: 'ffffffffff00',     // White
    animated: false,
    fade: 500, 
  },
  {
    start: 7500,            // 5:00
    end: 29850,             // 19:52
    from: 'ffffffffff00',   // White
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  {
    start: 29850,           // 19:52
    end: 30000,             // 20:00
    from: '000000000000',   // Black
    to: '000000000000',     // Black
    animated: true,
    fade: 500,
  },
  // Flash / Glitch - Start
  {
    start: 30000,           // 20:00
    end: 30025,             // 20:01
    from: '000000000000',   // Black
    to: 'ffffffffff00',     // White
    animated: false,
    fade: 500,
  },
  {
    start: 30000,           // 20:00
    end: 30050,             // 20:02
    from: '000000000000',   // Black
    to: 'ffffffffff00',     // White
    animated: false,
    fade: 500,
  },
  {
    start: 30000,           // 20:00
    end: 30075,             // 20:03
    from: 'ffffffffff00',   // White
    to: '000000000000',     // Black
    animated: false,
    fade: 500,
  },
  {
    start: 30075,           // 20:03
    end: 46500,             // 31:00
    from: 'ffffffffff00',   // White
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  // Flash / Glitch - End
  {
    start: 46500,           // 31:00
    end: 48000,             // 32:00
    from: '00000000ff00',   // Amber
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  {
    start: 48000,           // 32:00
    end: 54000,             // 36:00
    from: '00000000ff00',   // Amber
    to: '00000000ffff',     // Amber+UV
    animated: true,
    fade: 500,
  },
  // 
  // 
  {
    start: 54000,           // 36:00
    end: 63000,             // 42:00
    from: '00000000ffff',   // Amber+UV
    to: '00000000aaee',     // Amber+UV
    animated: true,
    fade: 500,
  },
  {
    start: 63000,           // 42:00
    end: 67500,             // 45:00
    from: '00000000aaee',   // Amber+UV
    to: '0000000000ff',     // UV
    animated: false,
    fade: 500,
  },
  {
    start: 67500,           // 45:00
    end: 72000,             // 48:00
    from: '0000000000ff',   // UV
    to: '0000000000ff',     // UV
    animated: false,
    fade: 500,
  },
  {
    start: 72000,           // 48:00
    end: 87000,             // 58:00
    from: '0000000000ff',   // UV
    to: 'ff00005500ff',     // Red+White+UV
    animated: true,
    fade: 500,
  },
  {
    start: 87000,           // 58:00
    end: 90025,             // 60:01
    from: 'ff00005500ff',   // Red+White+UV
    to: 'ff00005500ff',     // Red+White+UV
    animated: true,
    fade: 500,
  },
];

const premiere = [
  {
    start: 0,               // 0:00
    end: 7500,              // 5:00
    from: 'ffffffffff00',   // White
    to: 'ffffffffff00',     // White
    animated: false,
    fade: 500, 
  },
  {
    start: 7500,            // 5:00
    end: 29850,             // 19:52
    from: 'ffffffffff00',   // White
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  // Black
  {
    start: 29850,           // 19:52
    end: 30000,             // 20:00
    from: '000000000000',   // Black
    to: '000000000000',     // Black
    animated: true,
    fade: 500,
  },
  // Flash / Glitch - Start
  {
    start: 30000,           // 20:00
    end: 30025,             // 20:01
    from: '000000000000',   // Black
    to: 'ffffffffff00',     // White
    animated: false,
    fade: 500,
  },
  {
    start: 30000,           // 20:00
    end: 30050,             // 20:02
    from: '000000000000',   // Black
    to: 'ffffffffff00',     // White
    animated: false,
    fade: 500,
  },
  {
    start: 30000,           // 20:00
    end: 30075,             // 20:03
    from: 'ffffffffff00',   // White
    to: '000000000000',     // Black
    animated: false,
    fade: 500,
  },
  // Flash / Glitch - End
  {
    start: 30075,           // 20:03
    end: 46500,             // 31:00
    from: 'ffffffffff00',   // White
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  {
    start: 46500,           // 31:00
    end: 48000,             // 32:00
    from: '00000000ff00',   // Amber
    to: '00000000ff00',     // Amber
    animated: true,
    fade: 500,
  },
  {
    start: 48000,           // 32:00
    end: 54000,             // 36:00
    from: '00000000ff00',   // Amber
    to: '00000000ffff',     // Amber+UV
    animated: true,
    fade: 500,
  },
  // 
  // 
  {
    start: 54000,           // 36:00
    end: 63000,             // 42:00
    from: '00000000ffff',   // Amber+UV
    to: '00000000aaee',     // Amber+UV
    animated: true,
    fade: 500,
  },
  {
    start: 63000,           // 42:00
    end: 67500,             // 45:00
    from: '00000000aaee',   // Amber+UV
    to: '0000000000ff',     // UV
    animated: false,
    fade: 500,
  },
  {
    start: 67500,           // 45:00
    end: 72000,             // 48:00
    from: '0000000000ff',   // UV
    to: '0000000000ff',     // UV
    animated: false,
    fade: 500,
  },
  {
    start: 72000,           // 48:00
    end: 79350,             // 52:52
    from: '0000000000ff',   // UV
    to: '550000550055',     // Red+White+UV
    animated: true,
    fade: 500,
  },
  // Black
  {
    start: 79350,           // 52:52
    end: 79500,             // 53:00
    from: '000000000000',   // Black
    to: '000000000000',     // Black
    animated: true,
    fade: 500,
  },
  // Flash / Glitch - Start
  {
    start: 79500,           // 53:00
    end: 79525,             // 53:01
    from: '000000000000',   // Black
    to: 'bbbbbbbbbb00',     // White
    animated: false,
    fade: 500,
  },
  {
    start: 79500,           // 53:00
    end: 79550,             // 53:02
    from: '000000000000',   // Black
    to: 'bbbbbbbbbb00',     // White
    animated: false,
    fade: 500,
  },
  {
    start: 79500,           // 53:00
    end: 79575,             // 53:03
    from: 'bbbbbbbbbb00',   // White
    to: '000000000000',     // Black
    animated: false,
    fade: 500,
  },
  // Flash / Glitch - End
  {
    start: 79575,           // 53:03
    end: 87000,             // 58:00
    from: 'bbbbbbbbbb00',   // white
    to: 'ff00005500ff',     // Red+White+UV
    animated: true,
    fade: 500,
  },
  {
    start: 87000,           // 58:00
    end: 90025,             // 60:01
    from: 'ff00005500ff',   // Red+White+UV
    to: 'ff00005500ff',     // Red+White+UV
    animated: true,
    fade: 500,
  },
];

export default {
  name: "DMXSender",
  components: {},
  data: function () {
    return {
      clock: null,
      delta: 0,
      start: Date.now(),
      frame: 0,
      leds: new Array(led_count),
      lruThreshold: 6,
      lruLEDs: new Queue(),
      lastLED: 0,
      colorStart: 'ffffffffff00',
      animations: [],
      keyframes: premiere,
    };
  },
  methods: {
    map: function(value, x1, y1, x2, y2) {
      return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
    },
    intToHex: function(num) {
      var hex = Math.round(num).toString(16);
      if (hex.length == 1)
        hex = '0' + hex;
      return hex;
    },
    parseRGB: function(color) {
      return color.substring(0, 6);
    },
    parseWAUV: function(color) {
      return color.substring(6, 12);
    },
    blendColors: function(color1, color2, percentage) {
      // check input
      color1 = color1 || '#000000';
      color2 = color2 || '#ffffff';
      percentage = percentage || 0.5;

      // 1: validate input, make sure we have provided a valid hex
      if (color1.length != 4 && color1.length != 7)
        throw new Error('colors must be provided as hexes');

      if (color2.length != 4 && color2.length != 7)
        throw new Error('colors must be provided as hexes');    

      if (percentage > 1 || percentage < 0)
        throw new Error('percentage must be between 0 and 1');

      // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
      //      the three character hex is just a representation of the 6 hex where each character is repeated
      //      ie: #060 => #006600 (green)
      if (color1.length == 4)
          color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
      else
          color1 = color1.substring(1);
      if (color2.length == 4)
          color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
      else
          color2 = color2.substring(1);   

      // 3: we have valid input, convert colors to rgb
      color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
      color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];

      // 4: blend
      var color3 = [ 
          (1 - percentage) * color1[0] + percentage * color2[0], 
          (1 - percentage) * color1[1] + percentage * color2[1], 
          (1 - percentage) * color1[2] + percentage * color2[2]
      ];
      return this.intToHex(color3[0]) + this.intToHex(color3[1]) + this.intToHex(color3[2]);
    },
    toogleDMXActive: function() {
      this.$store.commit("SetDMXActive", !this.$store.state.dmxActive);
    },
    init: function() {
      this.keyframes.forEach(function(element) {
        var globalFrame = element.start;
        var frame = 0;
        while(globalFrame < element.end) {
          var rgb_blend = this.blendColors(
            '#' + this.parseRGB(element.to),
            '#' + this.parseRGB(element.from),
            this.map(frame, 0, element.end - element.start, 1.0, 0.0)
          );
          var wauv_blend = this.blendColors(
            '#' + this.parseWAUV(element.to),
            '#' + this.parseWAUV(element.from),
            this.map(frame, 0, element.end - element.start, 1.0, 0.0)
          );

          this.animations[globalFrame] = {
            color: rgb_blend + wauv_blend,
            running: element.animated,
            fade: element.fade
          };

          // console.log('[', element.start, ',', element.end, '],', globalFrame, rgb_blend + wauv_blend);

          globalFrame += 25;
          frame += 25;
        }
      }, this);
      var path = 'all/' + this.colorStart + '/1';
      this.sendHttpRequest(path);
    },
    animate: function () {
      if (!this.$store.state.isPlaying) {
        return;
      }
      
      var delta = Date.now() - this.start;
      if (delta > this.$store.state.interval) {
        this.$store.commit(
          "SetCurrentFrame",
          this.$store.state.currentFrame + 1
        );

        if (
            this.$store.state.currentFrame >=
            (Object.keys(this.$store.state.currentJSONData["red"].positions).length *
            this.$store.state.fps)
          ) {
            this.$store.commit("SetAnimationStatus", false);
            this.$store.commit("SetCurrentFrame", 0);
            this.clear();
            return;
        }
      }
    },
    update: function(name, frameIdx, maxFrames) {
      var state = this.$store.state;
      if (state.currentJSONData[name]) {
        var positions = state.currentJSONData[name].positions[frameIdx];
        if (positions !== undefined) {
          positions.forEach(pos => {
            // TODO Check if still needed for new animations.
            this.lruLEDs.enqueue(pos);
            if (this.lruLEDs.size() > this.lruThreshold) {
              this.lruLEDs.dequeue();
            }
            // update leds accordingly
            this.leds[pos - 2] = 30;
            this.leds[pos - 1] = 0;
            this.leds[pos] = 0;
            this.leds[pos + 1] = 0;
            this.leds[pos + 2] = 30;
          });
        }
      }
    },
    clear: function() {
      for (let i = 0; i < this.leds.length; i++) {
        this.leds[i] = 100;
      }
    },
    send: function(frameIdx, maxFrames) {
      var state = this.$store.state;
      if (state.currentJSONData["red"]) {
        for (let pos = 1; pos <= this.leds.length; pos++) {
          if (this.animations[frameIdx].running) {
            var value = this.leds[pos - 1];
            if (value < 100) {
              var rgb_blend = this.blendColors(
                '#' + this.parseRGB(this.animations[frameIdx].color),
                '#000000',
                this.map(value, 0, 100, 1.0, 0.0)
              );
              var wauv_blend = this.blendColors(
                '#' + this.parseWAUV(this.animations[frameIdx].color),
                '#000000',
                this.map(value, 0, 100, 1.0, 0.0)
              );
              var fade = this.animations[frameIdx].fade;
              var path = pos + '/' + rgb_blend + wauv_blend + '/500';
              this.sendHttpRequest(path);
            } else {
              var path = pos + '/' + this.animations[frameIdx].color + '/500';
              this.sendHttpRequest(path);
            }
          } else {
            var path = pos + '/' + this.animations[frameIdx].color + '/500';
            this.sendHttpRequest(path);
          }
          // if (this.animations[frameIdx].running && this.leds[pos - 1] == 0) {
          //   var path = pos + '/000000000000/500';
          //   this.sendHttpRequest(path);
          // } else {
          //   var path = pos + '/' + this.animations[frameIdx].color + '/500';
          //   this.sendHttpRequest(path);
          // }
        }
      }
    },
    process: function() {
      if (this.$store.state.dmxActive) {
        var state = this.$store.state;
        var frameIdx = state.currentFrame;
        var mainSeq = 'red';
        var maxFrames = Object.keys(
          state.currentJSONData[mainSeq].positions).length *
          state.fps;
        
        if (state.currentJSONData[mainSeq]) {
          var positions = state.currentJSONData[mainSeq].positions[frameIdx];
          if (positions !== undefined) {
            this.clear();
            this.update('red', frameIdx, maxFrames);
            this.send(frameIdx, maxFrames);
          }
        }
        // this.animationOne(frameIdx, maxFrames, pos);
        // this.animationTwo(frameIdx, maxFrames, pos);
      }      
    },
    sendHttpRequest: function(path) {
      const options = {
        hostname: '192.168.1.200',
        port: 3000,
        path: '/' + path,
        method: 'GET'
      }
      // var url = 'http://' + options.hostname + ':' + options.port + options.path
      // console.log('Sending request', url);

      const req = http.request(options, res => {
        res.on('data', d => {
          process.stdout.write(d)
        })
      });

      req.on('error', error => {
        console.error(error)
      });

      req.end();
    },
    checkServerStatus: function() {
      const options = {
        hostname: '192.168.1.200',
        port: 3000,
        path: '/',
        method: 'GET'
      }

      const req = http.request(options, res => {
          // console.log(`statusCode: ${res.statusCode}`);
          this.$store.commit("SetDMXConnected", true);
      });
 

      req.on('error', error => {
        console.error(error)
        console.log('Server not reachable...')
        this.$store.commit("SetDMXConnected", false);
      });  

      req.end();
    },
    togglePlay: function(event) {
      if (event.code == "Space") {
        if (this.$store.state.isPlaying) {
          this.$store.commit("SetAnimationStatus", false);
        } else {
          this.$store.commit("SetAnimationStatus", true);
        }
      }

    },
    directOff: function() {
      this.sendHttpRequest('all/000000000000/1');
    },
    directWhite: function() {
      this.sendHttpRequest('all/ffffffffff00/1');
    }
  },
  mounted() {
    this.init();
    this.checkServerStatus();

    setInterval(function(){
        this.animate();
    }.bind(this), 1000 / this.$store.state.fps);

    // setInterval(function(){
    //     this.checkServerStatus();
    // }.bind(this), 5000);

    this.$store.watch(
      (state) => state.currentFrame, (oldVal, newVal) => this.process()
    );
  },
  created() {
    window.addEventListener("keypress", this.togglePlay);
  },
  destroyed() {
    window.removeEventListener('keypress', this.togglePlay);
  },
};
</script>

<style>
#dmx-sender {
  /* margin-top: 50px;
  min-height: 32px;
  width:20%; */
  /* display: block;
  height: 500%; */
  height: 80px;
}

#dmx-sender button {
  float: left;
  background-color: #32bea6;
  margin-right: 10px;
}
</style>