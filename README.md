# subz-proxy

## OpenSubtitles
Internally uses [opensubtitles-api](https://www.npmjs.com/package/opensubtitles-api)

### Search

- https://subz.now.sh/search/opensubtitles?query=Inception

#### Query parameters

Parameter     | Example            | Description
--------------|--------------------|---------------------------------------------------------
sublanguageid | `fa`               | Can be an array.join, `all`, or be omitted. 
hash          | `8e245d9679d31e12` | Size + 64bit checksum of the first and last 64k 
filesize      | `129994823`        | Total size, in bytes. 
filename      | `bar.mp4`          | The video file name. Better if extension is included. 
season        | `2`                |
episode       | `3`                |
extensions    | `[`srt`, `vtt`]`   | Accepted extensions, defaults to `srt`. 
limit         | `3`                | Can be `best`, `all` or an arbitrary nb. Defaults to `best` 
imdbid        | `528809`           | `tt528809` is fine too. 
fps:          | `23.96`,           | Number of frames per sec in the video. 
query         | `Charlie Chaplin`  | Text-based query
gzip          | `true`             | returns url to gzipped subtitles, defaults to false

## API Proxy

- https://subz.now.sh/p/opensubtitles
- https://subz.now.sh/p/subdb
- https://subz.now.sh/p/subscene

# License 

MIT