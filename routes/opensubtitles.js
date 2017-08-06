const OS = require('opensubtitles-api')
const LRU = require('lru-cache')

const os = new OS({
    useragent: 'SolEol 0.0.8',
    // endpoint: 'https://subz.now.sh/p/opensubtitles/xml-rpc',
})

searchCache = LRU()

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
           results = await os.search(opts)
       } catch (e) {
           console.error(e)
           return reply({error: e.toString()})
       }

       searchCache.set(key, results)
       reply({ results })
   } 
}


const DownloadRoute = {
    method: 'GET', 
    path: `/opensubtitles/download`,
    async handler(request, reply) {
       reply({ error: 'not implemented' })
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