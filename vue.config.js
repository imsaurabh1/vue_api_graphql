
module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target:  "https://app-store-api.service.sicon.eco",
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: { "^/api": "/" }
      }
    }
  }
};