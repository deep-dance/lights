import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


export const store = new Vuex.Store({
    state: {
        currentJSONData: {
            red: null,
        },
        currentFrame: 0,
        isPlaying: false,
        filename: {
            red: "",
        },
        dmxActive: true,
        addMinVal: true,
        slowMo: true,
        fps: 25,
        interval: 1 / 25,
        leds_lru: [],
        dmxConnected: true
    },
    mutations: {
        SetJSONData(state, data) {
            state.currentJSONData[data.key] = data.data;
        },
        SetAnimationStatus(state, data) {
            state.isPlaying = data;
        },
        SetCurrentFrame(state, data) {
            state.currentFrame = data;
            //console.log("current frame in store ",data)
        },
        SetCurrentFilename(state, data) {
            state.filename[data.key] = data.data;
        },
        SetDMXActive(state, data) {
            state.dmxActive = data;
        },
        SetSlowMo(state, data) {
            state.slowMo = data;
        },
        SetLedsLRU(state, data) {
            state.leds_lru = data;
        },
        SetDMXConnected(state, data) {
            state.dmxConnected = data;
        },
    }
});