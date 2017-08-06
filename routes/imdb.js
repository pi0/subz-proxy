const axios = require('axios')

const IMDB_URL = 'http://www.imdb.com'

const SearchRoute = {
    method: 'GET',
    path: `/imdb/search`,
    async handler(request, reply) {
        let query = request.query.query

        let results
        try {
            results = (await axios.get(`${IMDB_URL}/xml/find?json=1&nr=1&tt=on&q=${query}`)).data
        } catch (e) {
            console.error(e)
            return reply({ error: e.toString() })
        }

        reply({ results })
    }
}

module.exports.register = (server, options, next) => {
    server.route([
        SearchRoute
    ])
    next()
}

module.exports.register.attributes = {
    name: 'routes-imdb'
}