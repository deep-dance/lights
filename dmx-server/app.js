const http = require('http');
const https = require('https');
const DMX = require('dmx')
const Config = require('./config.js');

const hostname = '192.168.1.200';
const port = 3000;

const DMX_UNIVERSE_A = 'deep-dance-1';
const DMX_UNIVERSE_B = 'deep-dance-2';
// const DMX_DRIVER = 'null'
const DMX_DRIVER = 'dmx4all';
const DMX_DEVICE_PATH_A = '/dev/ttyACM0';
const DMX_DEVICE_PATH_B = '/dev/ttyACM1';

const dmx = new DMX();
const universe_a = dmx.addUniverse(DMX_UNIVERSE_A, DMX_DRIVER, DMX_DEVICE_PATH_A);
const universe_b = dmx.addUniverse(DMX_UNIVERSE_B, DMX_DRIVER, DMX_DEVICE_PATH_B);

var config = null;

const mapLeds = function(led, color) {
  var leds = {};
  var channelPerLed = 6;

  const mapValue = function(value, in_min, in_max, out_min, out_max) {
    return (value - 0) * (config.dimMax() - 0) / (15 - 0) + 0;
  }

  var r = mapValue(parseInt(color.substring(0,1), 16));
  var g = mapValue(parseInt(color.substring(2,3), 16));
  var b = mapValue(parseInt(color.substring(4,5), 16));

  var w = mapValue(parseInt(color.substring(6,7), 16));
  var a = mapValue(parseInt(color.substring(8,9), 16));
  var uv = mapValue(parseInt(color.substring(10,11), 16));

  var base = (led * channelPerLed) + 1;
  leds[base] = r;
  leds[base + 1] = g;
  leds[base + 2] = b;

  leds[base + 3] = w;
  leds[base + 4] = a;
  leds[base + 5] = uv;

  return leds;
}

const sendUpdate = function(led, color, delay) {
  var universe = null;
  if ((led + 1) / config.ledsPerDevice() * config.channelsPerDevice() < 510) {
    universe = universe_a;
  } else {
    universe = universe_b;
    led = 1 + Math.ceil(led - (512 / config.channelsPerDevice() * config.ledsPerDevice()))
  }
  const animation = new DMX.Animation().add(mapLeds(led, color), delay).run(universe);
}

const setHeader = function(response) {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain');
  // response.setHeader('Access-Control-Allow-Origin', '*');
  // response.setHeader('Access-Control-Allow-Origin', 'https://deepdance.ddns.net/');
  // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // response.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.200:8080');
  response.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.200');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
}

const validate = function(led, color, delay) {
  var isHex = function(color) {
    var re = /[0-9A-Fa-f]{12}/g;
    return re.test(color);
  }

  var ledValid = led == 'all' || (led >= 1 && led <= config.leds());
  var colorValid = isHex(color);
  var delayValid = Number.isInteger(delay);
  if (ledValid && colorValid && delayValid)
    return true;
  return false;
}

const animateAll = function(led, color, delay) {
  if (led == 'all') {
    for (let i = 0; i <= config.leds(); i++) {
      sendUpdate(i, color, delay);
    }
  }
}

const animateSingle = function(led, color, delay) {
  // const DMX_MIN_VAL = 0;
  // const DMX_MAX_VAL = 80;
  // var leds = {};
  // leds[led * 6 + 1] = state == 'on' ? DMX_MAX_VAL : DMX_MIN_VAL;
  // const animation = new DMX.Animation().add(leds, 1000).run(universe);
  sendUpdate(led - 1, color, delay);
}

const server = http.createServer((request, response) => {
  var url = request.url.split('/');
  var channel = url[1] == 'all' ? 'all' : parseInt(url[1]);
  var color = url[2];
  var delay = url[3] === "" ? 200 : parseInt(url[3]);

  console.log("Requested update", channel, "with color", color, "and delay", delay);
  
  setHeader(response);
  if (validate(channel, color, delay)) {
    response.end('')
    if (channel == 'all')
      animateAll(channel, color, delay);
    else
      animateSingle(channel, color, delay);
  } else {
    response.end('Unknown channel or state. Ignoring request.')
  }
});

server.listen(port, hostname, () => {
  config = new Config('config.yml');
  if (config.isValid()) {
    console.log("settings:");
    console.log("    leds:", config.leds());
    console.log("    dimMax:", config.dimMax());

    console.log(`Server running at http://${hostname}:${port}/`);
  } else {
    throw new Error('Could not read configuration. Please make sure a config.yml file exists and follows this scheme:\n\n' +
      'settings:\n' +
      '  - leds: 12:\n');
  }
});
