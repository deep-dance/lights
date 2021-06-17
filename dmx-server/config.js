const yaml = require('js-yaml');
const fs   = require('fs');

const CONFIG_YAML_ROOT = 'settings'

module.exports = class Config {
    file = '';
    constructor(filename) {
        console.log("Opening config: " + filename);
        try {
          this.file = yaml.load(fs.readFileSync(filename, 'utf8'));
        } catch (e) {
          console.log(e);
          return [];
        }
    }

    isValid() {
      return this.file[CONFIG_YAML_ROOT] ? true : false;
    }

    leds() {
      var leds = 0;
      this.file[CONFIG_YAML_ROOT].forEach(element => {
        if (element.leds)
          leds = parseInt(element.leds);
      });
      return leds;
    }

    ledsPerDevice() {
      var leds_per_device = 0;
      this.file[CONFIG_YAML_ROOT].forEach(element => {
        if (element.leds_per_device)
          leds_per_device = parseInt(element.leds_per_device);
      });
      return leds_per_device;
    }

    channelsPerDevice() {
      var channels_per_device = 0;
      this.file[CONFIG_YAML_ROOT].forEach(element => {
        if (element.channels_per_device)
          channels_per_device = parseInt(element.channels_per_device);
      });
      return channels_per_device;
    }

    dimMax() {
      var dimMax = 0;
      this.file[CONFIG_YAML_ROOT].forEach(element => {
        if (element.dimMax)
          dimMax = parseInt(element.dimMax);
      });
      return dimMax;
    }
}