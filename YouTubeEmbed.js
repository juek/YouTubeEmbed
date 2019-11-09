/**
 * ######################################################################################################
 * JS/jQuery for Typesetter CMS plugin YouTube Embed
 * Authors: J. Krausz, Mahotilo
 * Date: 2019-11-09
 * Version: 1.0-b4
 * partially based on https://stackoverflow.com/questions/34375655, https://jsfiddle.net/kmsdev/gsfkL6xL/
 * ######################################################################################################
 */

// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Played video will pause when becoming invisible and resume when becoming visible again
// Playback starts by the user. If user paused video, it stays paused

onYouTubeIframeAPIReady = function(){

  var LoadVideo = function(player_id){

    var Program = {

      Init        : function(){
                      this.NewPlayer();
                      this.EventHandler();
                    },

      NewPlayer   : function(){
                      var _this = this;
                      this.Player = new YT.Player(player_id, {});
                      _this.Player.$element = $('#' + player_id);
                      this.Player.Paused = 0;
                    },

      Play        : function(){
                      var _this = this;
                      if( (this.Player.getPlayerState() === 2 ) && (this.Player.Paused == 1) ){
                        this.Player.playVideo();
                        this.Player.Paused = 0;
                      }
                    },

      Pause       : function(){
                      var _this = this;
                      if( this.Player.getPlayerState() === 1 ){
                        this.Player.pauseVideo();
                        this.Player.Paused = 1;
                      }
                    },

      ScrollControl : function(){
                        if( Utils.IsElementInViewport(this.Player.$element[0]) ){
                          this.Play();
                        }else{
                          this.Pause();
                        }
                      },

      EventHandler  : function(){
                        var _this = this;
                        $(window).on('scroll', function(){
                          _this.ScrollControl();
                        });
                      }
    };


    var Utils = {

      IsElementInViewport : function(el){
        // el = el[0]; // get DOM element from jQuery object
        var rect = el.getBoundingClientRect(); 
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }

    };

    return Program.Init();
  };

  $('.youtube-embed-player > iframe').each(function(){
    LoadVideo($(this).attr('id'));
  });

};
