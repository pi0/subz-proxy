const axios = require('axios')

const IMDB_URL = 'http://www.imdb.com'
const IMDB_SUGGEST_URL = 'https://sg.media-imdb.com'

const SearchRoute = {
    method: 'GET',
    path: `/imdb/search`,
    async handler(request, reply) {
        let query = (request.query.query || '').toLowerCase()

        let results
        try {
            // Result is in Jsonp format
            let resultJson = (await axios.get(`${IMDB_SUGGEST_URL}/suggests/${query[0]}/${encodeURIComponent(query)}.json`)).data
            let i = resultJson.indexOf('(') 
            resultStr = resultJson.substr(i + 1, resultJson.length - i - 2)
            results = JSON.parse(resultStr).d || []

            // Normalize results
            const cover = r => r.i && ({
                url: r.i[0],
                width: r.i[1],
                height: r.i[2]
            })
            results = results.map(r => ({
                id: r.id,
                title: r.l,
                title_description: r.s,
                year: r.y,
                type: r.q,
                cover: cover(r)
            }))
        } catch (e) {
            console.error(e)
            return reply({ error: e.toString() })
        }

        reply({ results })
    }
}


const SearchRoute2 = {
    method: 'GET',
    path: `/imdb/search2`,
    async handler(request, reply) {
        let query = request.query.query

        let results = []
        try {
            let cResults = (await axios.get(`${IMDB_URL}/xml/find?json=1&nr=1&tt=on&q=${query}`)).data || {}
            // Flatten results
            Object.keys(cResults).forEach(type => {
                cResults[type].forEach(r => {
                    results.push(Object.assign(r, { type }))
                })
            })
        } catch (e) {
            console.error(e)
            return reply({ error: e.toString() })
        }

        reply({ results })
    }
}

module.exports.register = (server, options, next) => {
    server.route([
        SearchRoute,
        SearchRoute2
    ])
    next()
}

module.exports.register.attributes = {
    name: 'routes-imdb'
}