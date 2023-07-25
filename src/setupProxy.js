const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.50.201:8080',
      secure:false,// 这是签名认证，http和https区分的参数设置
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    })
  );
};