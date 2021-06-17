<template>
  <div id="json-upload" class="upload">
    <div class="frames">
        {{ this.$store.state.filename[this.dataKey].toString() ? 
          this.$store.state.filename[this.dataKey] : 
          "No file selected..." 
        }}  
    </div>
    <label
      :for="'json-file-upload'+this.dataKey"
      :class="'btn btn-primary custom-file-upload left '+this.dataKey"
    >
      <i class="fa fa-cloud-upload"></i>&#11149;
    </label>
    <input
      type="file"
      :id="'json-file-upload'+this.dataKey"
      value="Import"
      @change="onFileChange"
    />
    <br />
    
  </div>
</template>

<script>
export default {
  name: "Upload",
  props: ['dataKey'],
  components: {},
  methods: {
    onFileChange: function onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      var reader = new FileReader();
      reader.onload = this.onReaderLoad;
      reader.readAsText(files[0]);
      this.$store.commit("SetCurrentFilename", {data:files[0].name, key:this.dataKey});
    },
    onReaderLoad: function (event) {
      var obj = JSON.parse(event.target.result);
      this.$store.commit("SetJSONData", {data:obj,key:this.dataKey});
    },
  },
};
</script>

<style>
.upload {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: auto;
  margin-bottom: 20px;
}
input[type="file"] {
  display: none;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}
.filename {
  margin: 10px 10px;
}

.red {
  background-color: #32bea6 !important;
}
.frames {
  /* margin: 0px 10px 0 10px; */
  color: #32bea6;
  width: 83%;
  height: 40px;
  /* width: 100%; */
  /* text-align: center; */
  float: left;
  border: 1px solid #32bea6;
  padding: 7px 10px 0 0;
  text-align: right;
}
.btn-primary {
  width: 15%;
  /* margin-left: 10px; */
}

.upload .btn-primary {
  float: right;
}

/* @media only screen and (max-width: 500px) {
  .upload {
    width: 100%;
  }
  .btn-primary {
    width: 25%;
  }
} */
</style>
