const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  base: "/vue-demo/",
  transpileDependencies: true,
  build: {
    outDir: "docs",
  },
  lintOnSave: false,
  devServer: {
    port: 81,
    https: false,
    open: false,
  },
});
