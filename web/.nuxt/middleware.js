const middleware = {}

middleware['auth'] = require('..\\middleware\\auth.js')
middleware['auth'] = middleware['auth'].default || middleware['auth']

middleware['fetch-colors'] = require('..\\middleware\\fetch-colors.js')
middleware['fetch-colors'] = middleware['fetch-colors'].default || middleware['fetch-colors']

middleware['is-local-server-running'] = require('..\\middleware\\is-local-server-running.js')
middleware['is-local-server-running'] = middleware['is-local-server-running'].default || middleware['is-local-server-running']

middleware['menu'] = require('..\\middleware\\menu.js')
middleware['menu'] = middleware['menu'].default || middleware['menu']

middleware['validate-keygen-license'] = require('..\\middleware\\validate-keygen-license.js')
middleware['validate-keygen-license'] = middleware['validate-keygen-license'].default || middleware['validate-keygen-license']

export default middleware
