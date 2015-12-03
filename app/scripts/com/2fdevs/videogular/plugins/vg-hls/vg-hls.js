/**
 * @ngdoc directive
 * @name com.vbrick.videogular.plugins.hls.directive:vgHls
 * @restrict A
 * @description
 * Adds HLS support for vg-media.
 * This plugin requires hls.js file available at hls.js project:
 * https://github.com/dailymotion/hls.js
 *
 * <pre>
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-media vg-src="sources" vg-hls></vg-media>
 * </videogular>
 * </pre>
 *
 */
"use strict";
angular.module("com.vbrick.videogular.plugins.hls", ["com.2fdevs.videogular"])
    
    .constant("VG_HLS_SUPPORT", {
        isNative: (function(){
                var videoElement = angular.element("<video>")[0];
                var isNativelySupportedRegex = /probably|maybe/;
                var canPlayVnd = isNativelySupportedRegex.test(videoElement.canPlayType("application/vnd.apple.mpegURL"));
                var canPlayXmpeg = isNativelySupportedRegex.test(videoElement.canPlayType("application/x-mpegURL"));

                return videoElement.canPlayType && (canPlayVnd || canPlayXmpeg);
            })(),
        isMSE: Hls.isSupported()
    })

    .directive(
    "vgHls",
    ["$window", "VG_HLS_SUPPORT", function ($window, VG_HLS_SUPPORT) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attr, API) {
                var player;

                //Proceed augmenting behavior only if the browser is not capable of playing HLS natively and supports MediaSource Extensions (required for hls.js)
                if (!VG_HLS_SUPPORT.isNative && VG_HLS_SUPPORT.isMSE) {

                    //Returns true if the source has the standard HLS type defined OR an .mpd extension.
                    scope.isHLS = function isHLS(src, type) {
                        var hlsTypeRegEx = /^application\/vnd.apple.mpegurl/i;
                        var hasHlsType = hlsTypeRegEx.test(type);
                        var hasHlsExtension = src.indexOf && (src.indexOf(".m3u8") > 0);

                        return hasHlsType || hasHlsExtension;
                    };

                    scope.loadHlsPlayer = function(src, type){
                         if (src && scope.isHLS(src, type)) {
                            player = new $window.Hls();

                            //autoplay
                            if (API.autoPlay) {
                                player.on($window.Hls.Events.MANIFEST_PARSED, API.play);
                            }

                            //load the src and attach Hls to the mediaElement
                            player.loadSource(src);
                            player.attachMedia(API.mediaElement[0]);

                            return scope.unloadHlsPlayer;
                        }

                        return false;
                    };

                    scope.unloadHlsPlayer = function() {
                        //clean up existing hls.js player instance (if any)
                        if (player) {
                            API.stop();

                            //Dettach hls.js from the mediaElement
                            try {
                               player.destroy();
                            } catch(ex){}
                            player = null;
                        }
                    };

                    API.registerPlaybackPlugin(scope.loadHlsPlayer);
                }
            }
        }
    }
    ]);