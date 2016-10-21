import httpProxy from 'http-proxy'
const proxy = httpProxy.createProxyServer({})

const httpProxyMiddleware = () => (req, res) => {
  proxy.web(req, res, { target: process.env.PROXY_SERVER_ROOT })
}

export default httpProxyMiddleware

