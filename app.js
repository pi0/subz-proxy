const { Server } = require('hapi');

const server = new Server();

server.connection({ port: 3000 })

server.register([
    // H2o2 Proxy
    { register: require('h2o2') },

    // Routes proxy /p/*
    { register: require('./routes/proxy') },

    // OpenSubtitles Provider /opensubtitles/*
    { register: require('./routes/opensubtitles') },

], err => {
    if (err) return console.error(err);
    server.start((err) => {
        console.log('Server started at: ' + server.info.uri);
    });
});