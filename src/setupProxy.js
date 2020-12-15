const { createProxyMiddleware } = require("http-proxy-middleware");

let myappSessionValidationCookie = '';
module.exports = function (app) {
    app.use(
        "/h5p",
        createProxyMiddleware({
            target: "http://localhost:8023",
            secure: false,
            changeOrigin: true,
            proxy: {
                '/h5p': {
                    onProxyReq: function (proxyReq) {
                        if (myappSessionValidationCookie) {
                            proxyReq.setHeader('cookie', myappSessionValidationCookie);
                        }
                    },
                    onProxyRes: function (proxyRes) {
                        const proxyCookie = proxyRes.headers['set-cookie'];
                        if (proxyCookie) {
                            myappSessionValidationCookie = proxyCookie;
                        }
                    },
                },
            },
        })
    );
};
