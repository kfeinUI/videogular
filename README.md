bower-videogular (forked by Kevin Feinberg)
================

## Original fork location
https://github.com/kfeinUI/videogular/tree/Playback_plugin_support_improvements

## Customizations
1. Made npm friendly.
2. Fork offers a proposed enhanced playback plugin architecture. Also adds tracking of the actively used playback source via API.activeSource, support for an isLive property on the playback source object, safe apply fixes using $applyAsync(), improved vgMedia source change check.
3. Fix for the startTime only being applied once. There's a private variable <em>hasStartTimePlayed</em> which never gets reset. Added an applyLater parameter to API.onUpdateStartTime() so that the flag gets reset and so the new value won't be applied immediately. This way we can set the new value and then change the video source. Note that the existing implementation for some reason seems to be designed to be a one-off execution.
4. Cleaned up console noise in the play() and pause() functions.
5. Native playback support test augmented to factor in Edge's inability to handle mixed content playback.
6. Seek event payloads have been made more meaningful.
7. API.isBlacklistedNativeSupport(source) will run the source through a list of tests in order to determine if native support for a particular source is blacklisted. An example of when this may be used is when native support is available but has issues, so alternative playback through a plugin is preferred.

Videogular repository for distribution on `bower`.

## Install

Install [Videogular](http://www.videogular.com/) with Bower:

`bower install videogular`

### Install themes

Install [Videogular](http://www.videogular.com/) themes with Bower:

`bower install videogular-themes-default`

### Install plugins

Install [Videogular](http://www.videogular.com/) plugins with Bower:

`bower install videogular-controls`

`bower install videogular-buffering`

`bower install videogular-overlay-play`

`bower install videogular-poster`

## Documentation

It's available on [Videogular's project Wiki](https://github.com/2fdevs/videogular/wiki).

## License

The MIT License (MIT)

Copyright (c) 2013 2fdevs

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
