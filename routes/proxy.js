module.exports.register = (server, options, next) => {

    const proxy = (alias, uri) => {
        server.route({
            method: '*',
            path: `/p/${alias}/{route*}`,
            handler: {
                proxy: {
                    passThrough: true,
                    uri: `${uri}/{route}`
                }
            }
        })
    }

    // OpenSubtitles
    proxy('opensubtitles', 'http://api.opensubtitles.org:80')

    // OpenSubtitles download
    proxy('opensubtitles', 'http://dl.opensubtitles.org:80')

    // SubDB
    proxy('subdb', 'http://api.thesubdb.com')

    // SubScene
    proxy('subscene', 'https://subscene.com')

    // IMDBSG
    proxy('imdbsg', 'http://sg.media-imdb.com')

    // IMDB
    proxy('imdb', 'http://www.imdb.com')

    next()
}

module.exports.register.attributes = {
    name: 'routes-proxy'
}
