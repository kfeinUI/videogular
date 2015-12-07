/**
 * @ngdoc directive
 * @name com.vbrick.videogular.plugins.flash.directive:vgFlashPlayer
 * @restrict A
 * @description
 * Adds Strobe Media Playback integration to vgMedia.
 * This plugin requires swfobject, the custom VBrick build of Strobe Media Playback, and the HLS plugin (Strobe used for HLS as a fallback when MSE is not supported).
 * 
 * Works by embedding a Strobe Flash <object> in place of the Videogular <video> element. Videogular is pointed to the <div> wrapping the <object>, which is wired
 * up to mimic the expected <video> API.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-media vg-src="sources" vg-hls vg-flash-player vg-flash-player-swf-dir="/swf" vg-flash-player-swfobject-dir="/lib/swfobject"></vg-media>
 * </videogular>
 * </pre>
 *
 *
 * TODOS: 
 * - Configuration of swf locations (attribute).
 * - Wire up Strobe => API event handlers (based on those in vg-controller).
 * - Split off subtitles into another directive?
 * 
 */
"use strict";
angular.module("com.vbrick.videogular.plugins.flash", ["com.2fdevs.videogular", "com.vbrick.videogular.plugins.hls"])

    .constant("VG_FLASH_IS_SUPPORTED", swfobject.getFlashPlayerVersion().major > 0)

    .directive(
    "vgFlashPlayer",
    [        "$window", "$interval", "$log", "$timeout", "$rootScope", "VG_FLASH_IS_SUPPORTED", "VG_HLS_SUPPORT", 
    function ($window,   $interval,   $log,   $timeout,   $rootScope,   VG_FLASH_IS_SUPPORTED,   VG_HLS_SUPPORT) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attr, API) {
                var player;
                var originalVideoElement;
                var playerId = scope.$id;
                var isHlsFallback = !VG_HLS_SUPPORT.isNative && VG_HLS_SUPPORT.isMSE; //no native hls support and can't use vg-hls
                var swfVersion = '10.1.0';
                var isReconnecting = false;
                var isCompleted = false;
                var restorePlaybackPosition;
                var pauseAfterRestore;
                var isPlayOnReady;
                var timeBetweenReconnectAttemptsMs = 5000;
                var maxReconnectAttempts = 18;
                var reconnectInterval;
                var eventHandlerName = 'swfEventHandler' + playerId;
                var playerElementId = 'videoPlayer_' + playerId;

                //Proceed augmenting behavior only if the browser is capable of playing HLS (supports MediaSource Extensions)
                if (VG_FLASH_IS_SUPPORTED) {

                    //Returns true if the source has the standard HLS type defined OR an .mpd extension.
                    scope.isFlashSource = function(src, type) {
                        var supportedProtocols = ['rtmp', 'rtmfp'];
                        var supportedTypes = ['video/flv', 'video/x-flv', 'video/mp4', 'video/m4v'];
                        var supportedExtensions = ['mp4', 'm4v', 'flv', 'f4v'];

                        //test the src protocol
                        for (var protocolIndex = 0, numProtocols = supportedProtocols.length; protocolIndex < numProtocols; ++protocolIndex) {
                            if (src.lastIndexOf(supportedProtocols[protocolIndex] + '://', 0) === 0) {
                                return true;
                            }
                        }

                        //test the type
                        if (supportedTypes.indexOf(type) != -1) {
                            return true;
                        }

                        //test the extension
                        for (var extensionIndex = 0, numExtensions = supportedExtensions.length; extensionIndex < numExtensions; ++extensionIndex) {
                            if (src.indexOf('.' + supportedExtensions[extensionIndex]) > 0) {
                                return true;
                            }
                        }

                        //test for HLS fallback
                        if (isHlsFallback) {
                            var hlsTypeRegEx = /^application\/vnd.apple.mpegurl/i;
                            var hasHlsType = hlsTypeRegEx.test(type);
                            var hasHlsExtension = src.indexOf && (src.indexOf(".m3u8") > 0);

                            if (hasHlsType || hasHlsExtension) {
                                return true;
                            }
                        }

                        return false;
                    };

                    scope.loadFlashPlayer = function(src, type){
                         if (src && scope.isFlashSource(src, type)) {
                            var flashVars = {
                                src: encodeURIComponent(src),
                                playButtonOverlay: false,
                                conrolBarMode: 'none',
                                autoPlay: API.autoPlay,
                                bufferTime: 8,
                                javascriptCallbackFunction: eventHandlerName
                            };
                            var params = {
                                quality: 'high',
                                bgcolor: '#000000',
                                allowscriptaccess: 'always',
                                allowfullscreen: 'true',
                                wmode: 'opaque'
                            };
                            var attrs = { name: API.mediaElement[0].id };

                            //establish the window-level event handler used by the player
                            $window[eventHandlerName] = function (playerId, event, args){
                                var dummyEventObj = {target: API.mediaElement[0]};

                                if(player == null){
                                    player = API.mediaElement[0].childNodes[0];
                                }

                                if (!player.execute) {
                                    player.execute = executePlayerFunc;
                                }

                                switch(event){
                                case 'onJavaScriptBridgeCreated':
                                    onJavaScriptBridgeCreatedEvent();
                                    break;
                                case 'durationchange':
                                    updateVg();
                                    break;
                                case 'timeupdate':
                                    onCurrentTimeChangeEvent(args.currentTime);
                                    updateVg();
                                    break;
                                case 'complete':
                                    onCompleteEvent(args.ended);
                                    break;
                                case 'fullscreenchange':
                                    onFullScreenChangeEvent(args.isFullScreen);
                                    break;
                                case 'volumechange':
                                    onVolumeChangeEvent(args.volume, args.muted);
                                    break;
                                case 'emptied':
                                    $timeout(onEmptiedEvent, 100);
                                    break;
                                case 'seeking':
                                    API.onSeeking(dummyEventObj);
                                    break;
                                case 'seeked':
                                    API.onSeeked(dummyEventObj);
                                    break;
                                }
                            };

                            //DOM manipulation to swap out the <video> for a <div> target container that will hold the flash object
                            originalVideoElement = elem.children()[0];
                            elem = API.mediaElement.parent();
                            API.mediaElement = angular.element('<div><div id="videoPlayer_'+playerId+'"></div></div>');
                            API.mediaElement[0].load = function(){}; //deliberately empty
                            elem.empty();
                            elem.append(API.mediaElement);

                            //TODO: apply plugin flashVars

                            //create the flash object
                            $window.swfobject.embedSWF(attr.vgFlashPlayerSwfDir + '/StrobeMediaPlayback.swf', playerElementId, "100%", "100%", swfVersion, attr.vgFlashPlayerSwfObjectDir + '/expressInstall.swf', flashVars, params, attrs);
                            player = API.mediaElement[0].childNodes[0]; //freshly created flash <object>

                            //apply styling to the flash object so that it fills our vg region
                            $window.swfobject.createCSS('#' + player.id, "position: absolute;");

                            //expose Citrix Receiver workaround helper function on the player object
                            player.execute = executePlayerFunc;

                            return scope.unloadFlashPlayer;
                        }

                        return false;
                    };

                    scope.unloadFlashPlayer = function() {
                        //TODO: restore <video> element and clean up everything
                        if (player) {
                            $interval.cancel(reconnectInterval);

                            if(API.currentState === 'play' || API.currentState === 'pause' && player && player.stop2){
                                try {
                                    API.stop();
                                    player.execute('stop2');
                                } catch(ex){} //gobble the error if the object is already unloaded
                            }

                            //clean up DOM (remove flash object and restore video element)
                            API.mediaElement.parent().empty().append(originalVideoElement);
                            API.mediaElement = angular.element(originalVideoElement);
                            originalVideoElement = null;

                            //clean up event handlers
                            if(eventHandlerName){
                                delete $window[eventHandlerName];
                            }

                            delete $window.onStrobeLoadStateChange;
                            delete $window.onStrobeMediaError;
                            delete $window.connectionStatusChange;
                            delete $window.onSubtitleMarkerStart;
                            delete $window.onSubtitleMarkerEnd;

                            player = null;
                        }
                    };

                    API.registerPlaybackPlugin(scope.loadFlashPlayer);
                }

                function onJavaScriptBridgeCreatedEvent(){ //Flash side is ready for interaction
                    setProperties();

                    $window.onStrobeLoadStateChange = function(loadState) {
                        //video metadata has been loaded so the player is ready to play AND isPlayOnReady flag is set
                        if (loadState === 'ready' && isPlayOnReady) {
                            if (isReconnecting) {
                                //TODO:switchPlayerSubtitle(scope.selectedSubtitle);
                            }

                            if (reconnectInterval) {
                                $interval.cancel(reconnectInterval);
                                reconnectInterval = null;
                            }

                            isPlayOnReady = false;
                            isReconnecting = false;
                            player.execute('play2');
                        }
                    };
                    player.execute('addEventListener', 'loadStateChange', 'onStrobeLoadStateChange');

                    //mediaError handler here to help with debugging playback issues
                    $window.onStrobeMediaError = function(errorId, message, details) {
                        $log.info('onStrobeMediaError = ' + errorId + ' - ' + message + ' - ' + details);
                        
                    };
                    player.execute('addEventListener', 'mediaError', 'onStrobeMediaError');

                    //handle for connectionStatusChange events (VBrick customization to Strobe)
                    $window.connectionStatusChange = function(info) { //called directly by Flash (no listener needed)
                        $log.info('connectionStatusChange = ' + info.code);

                        var currentPlaybackOption = getCurrentPlaybackOption();

                        //if the connection is closed, we're playing, reconnect functionality is supported for the current playback option, and not already reconnecting
                        //then initialize reconnection behavior
                        if (!isReconnecting && isReconnectSupported(currentPlaybackOption.url) && API.currentState === 'play' && info.code === 'NetConnection.Connect.Closed') {
                            var playbackPosition = player.execute('getCurrentTime');

                            isReconnecting = true;
                            isPlayOnReady = true;
                            reconnectInterval = $interval(function() {
                                attemptToReconnect(playbackPosition);
                            }, timeBetweenReconnectAttemptsMs, maxReconnectAttempts);

                            reconnectInterval.then(function(){ //no luck reconnecting (made it through set # of iterations)
                                $log.info('Unable to reconnect.');
                                isReconnecting = false;
                                API.stop();
                            });
                        }
                    };

                    //workaround for Firefox in Windows which renders the video over the Flash subtitles in most wmodes
                    $window.onSubtitleMarkerStart = function(subtitleText) {
                        if (isHtmlSubtitlesDisplay) { //TODO
                            //scope.htmlSubtitles.text = subtitleText;
                            //scope.htmlSubtitles.isVisible = true;
                        }
                    };
                    $window.onSubtitleMarkerEnd = function() {//TODO
                        if (isHtmlSubtitlesDisplay) {
                            //scope.htmlSubtitles.isVisible = false;
                        }
                    };

                    //Reset the vg volume
                    API.volume = 1;

                    //Apply autoplay
                    if(API.autoPlay){
                        API.play()
                    }
                }

                function setProperties() { //mimic the video element API
                    var playerWrapper = API.mediaElement[0];

                    Object.defineProperties(playerWrapper, {
                        currentTime: {
                            configurable: false,
                            get: function() {
                                return player.execute('getCurrentTime');
                            },
                            set: function(value) {
                                if(player && player.execute('getCanSeek')){
                                   player.execute('seek', value);
                                }
                            }
                        },

                        duration: {
                            get: function() {
                                return player ? player.execute('getDuration') : 0;
                            }
                        },

                        buffered: {
                            value: {
                                length: 1,
                                end: function(){
                                    return player ? player.execute('getBufferLength') : 0;
                                }
                            }
                        },

                        paused: {
                            get: function() {
                                return player ? player.execute('getPaused') : true;
                            }
                        },

                        videoWidth: {
                            get: function() {
                                return player ? player.execute('getMediaWidth') : 0;
                            }
                        },

                        videoHeight: {
                            get: function() {
                                return player ? player.execute('getMediaHeight') : 0;
                            }
                        },

                        volume: {
                            get: function() {
                                return player ? player.execute('getVolume') : 1;
                            },
                            set: function(volume) {
                                player && player.execute('setVolume', volume);
                            }
                        },

                        play: {
                            value: function() {
                                if (player && player.execute('getCanPlay')) {
                                    if (API.activeSource.isLive && isHlsPlayback() && player.execute('getPaused')) { //live HLS
                                        isPlayOnReady = true;
                                        player.execute('load'); //fresh load rather than playback from the buffer to work around flashls issue
                                    } else {
                                        player.execute('play2');
                                    }

                                    isCompleted = false;
                                }
                            }
                        },

                        pause: {
                            value: function() {
                                if (player && player.execute('getCanPause')) {
                                    player.execute('pause');
                                }
                            }
                        }
                    });
                }

                /**
                 * Workaround for JS => Flash ExternalInterface calls to the player when running in the Citrix Receiver environment.
                 * Citrix runs a special Flash Player on the client side rather than transmitting multimedia playback from the server side.
                 * One of the issues their player has is that ExternalInterface calls from JS can be unreliable.  Here we apply the
                 * suggested (though not very elegant) workaround of using a try-catch to call again if the first attempt fails.
                 * @param  {String} funcName Name of the function on the player that you wish to call.
                 * @param  {...*} funcArgument Any number of arguments to pass through to the specified function.
                 * @return {*}          Return value from the specified funciton call.
                 */
                function executePlayerFunc(funcName) { //name of the function in the player followed by any arguments
                    var playerFunction = player[funcName];
                    var args = Array.prototype.slice.call(arguments, 1);
                    var returnVal;
                    var numTriesRemaining = 5;

                    while (numTriesRemaining) {
                        --numTriesRemaining;

                        //no more tries beyond this, so let the error fly
                        if (!numTriesRemaining) {
                            return playerFunction.apply(player, args);
                        } else { //some tries remaining, so catch errors
                            try {
                                return playerFunction.apply(player, args);
                            } catch(ex) {
                                $log.info('vg-flash-player executePlayerFunc failed for: ' + funcName);
                            }
                        }
                    }
                }

                function onEmptiedEvent() {
                    if (restorePlaybackPosition) {
                        API.play();
                    }
                }

                function onCurrentTimeChangeEvent(value) {
                    if (restorePlaybackPosition && player.execute('getPlaying') && player.execute('getCanSeek')) {
                        restorePosition();
                    }
                }

                function updateVg() {
                    API.onUpdateTime({
                        target: API.mediaElement[0]
                    });
                }

                function onCompleteEvent(isEnded) {
                    API.onComplete();

                    if (isEnded && !isCompleted) {
                        rewindVideo();

                        isCompleted = true;
                        if(API.autoPlay) {
                            player.execute('setAutoPlay', false);
                        }
                    }
                }

                /**
                 * Workaround for an internal issue with Strobe Media Player's autoRewind feature where 
                 * the player wont play the stream second time and stuck in ready status.
                 */
                function rewindVideo(){
                    var player = API.mediaElement[0];

                    if(player && player.execute('getCanSeek')){
                       player.execute('seek', 0);
                    }
                }

                function attemptToReconnect(playbackPosition) {
                    $log.info('Attempt to reconnect to the video stream.');
                    scope.onPlaybackOptionChange(getCurrentPlaybackOption(), playbackPosition);
                }

                function isReconnectSupported(url) {
                    return url && (url.indexOf('rtmp://') === 0 || url.indexOf('rtmfp://') == 0);
                }

                function restorePosition() {
                    if (!player.execute('canSeekTo', restorePlaybackPosition)) {
                        return;
                    }

                    player.execute('seek', restorePlaybackPosition);
                        
                    if (pauseAfterRestore) {
                        API.pause();
                    }

                    pauseAfterRestore = false;
                    restorePlaybackPosition = null;
                }

                function isHlsPlayback() {
                    return !!player.execute('getSrc').match(/.m3u8$/); //video src ends with .m3u8
                }

                function onPlaybackOptionChange(playbackOption, playbackPositionOverride) {
                    var isPlaying = API.currentState === 'play';
                    var isNotLive = !API.activeSource.isLive;

                    //TODO: scope.htmlSubtitles.isVisible = false;
                    
                    //capture playback position
                    var playbackPosition = isNaN(playbackPositionOverride) ? player.execute('getCurrentTime') : playbackPositionOverride;

                    if (isPlaying && !isReconnecting) {
                        player.execute('stop2');
                    }
                    
                    if (playbackPosition && isNotLive) {
                        restorePlaybackPosition = playbackPosition;
                        pauseAfterRestore = !isPlaying;
                    }

                    //apply playback url to the player
                    if (player.execute('getSrc') === playbackOption.url) { //no change in the source (such as for reconnect)
                        player.execute('load');
                        return;
                    } else { //set the video new source
                        player.execute('setMediaResourceURL', playbackOption.url);
                    }

                    //just start playing again if a live stream was playing
                    if (isPlaying && !isNotLive) {
                        API.play();
                    }
                    //TODO:switchPlayerSubtitle(scope.selectedSubtitle);
                }
            }
        }
    }
    ]);