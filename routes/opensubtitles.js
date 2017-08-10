const OS = require('opensubtitles-api')
const LRU = require('lru-cache')
const fetch = require('node-fetch')
const iconv = require('iconv-lite');

const os = new OS({
    useragent: 'SolEol 0.0.8',
    // endpoint: 'https://subz.now.sh/p/opensubtitles/xml-rpc',
})

const OS_DL_BASE = 'http://dl.opensubtitles.org'
const DL_PROXY_URL = 'https://subz.now.sh/p/opensubtitles'
const INTERNAL_DL_URL = DL_PROXY_URL

searchCache = LRU()
const dlCache = LRU()

const SearchRoute = {
    method: 'GET',
    path: `/opensubtitles/search`,
    async handler(request, reply) {
        let opts = Object.assign({}, request.query)
        delete opts.path
        let key = JSON.stringify(opts)

        let results = searchCache.get(key)

        if (results) {
            return reply({ results })
        }

        try {
            let resultsC = await os.search(opts) || {}
            results = Object.values(resultsC).map(r => Object.assign(r, {
                // Rewrite Download URL
                url: `http://${request.headers.host}/${r.url.replace(OS_DL_BASE, '/opensubtitles/download/')}`.replace(/\/\//g,'/'),
                url2: r.url.replace(OS_DL_BASE, DL_PROXY_URL),
                url3: r.url
            }))
        } catch (e) {
            console.error(e)
            return reply({ error: e.toString() })
        }

        searchCache.set(key, results)
        reply({ results })
    }
}


const DownloadRoute = {
    method: 'GET',
    path: '/opensubtitles/download/{path*}',
    async handler(request, reply) {
        let path = request.params.path

        let subtitle = dlCache.get(path)
        if (subtitle) {
            return reply(subtitle.data).header('content-disposition', subtitle.name)
        }

        let url = INTERNAL_DL_URL + '/' + path
        let response = await fetch(url)

        response.body.pipe(iconv.decodeStream('win1256')).collect((err, body) => {
            subtitle = {
                data: body,
                name: response.headers.get('content-disposition')
            }
            dlCache.set(path, subtitle)
    
            reply(subtitle.data)
            .header('content-disposition', subtitle.name)
        })
    }
}


module.exports.register = (server, options, next) => {
    server.route([
        SearchRoute,
        DownloadRoute
    ])
    next()
}

module.exports.register.attributes = {
    name: 'routes-oss'
}