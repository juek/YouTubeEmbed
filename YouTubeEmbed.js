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


$(function(){
  $('.youtube-embed-player > iframe').each(function(){
    var dynamic_id = 'ytp-' + Math.random().toString(16).slice(2);
    $(this).attr('id', dynamic_id);
  });

  // That's for YouTube embeddings in SliderFactoy slides: 
  // Stop playing all vids in current slider on slide change
  $('.gpPrevSlide, .gpNextSlide').on('click', function(){
    $wrapper = $(this).closest('.gpSlideWrapper');
    stopAllYouTubeEmbeddingsInside($wrapper);
  });

  // SliderFactoy as of 1.0.2 triggers gpSlideChangeBefore and gpSlideChangeAfter events
  $(document).on('gpSlideChangeAfter', '.gpSlideWrapper', function(evt){
    $wrapper = $(evt.target);
    stopAllYouTubeEmbeddingsInside($wrapper);
  });

  function stopAllYouTubeEmbeddingsInside($wrapper){
    var $youTubeIframes = $wrapper.find(".youtube-embed-player > iframe");
    if( $youTubeIframes.length ){
      $youTubeIframes.each( function(){
        $(this)[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      });
    }
  }

});


// Played video will pause when scrolled out of sight and resume when becoming visible again
// Playback starts by the user. If user paused video, it stays paused

onYouTubeIframeAPIReady = function(){

  var LoadVideo = function(player_id){

    var Program = {

      Init        : function(){
                      this.NewPlayer();
                      this.EventHandler();
                    },

      NewPlayer   : function(){
                      this.Player = new YT.Player(player_id, {});
                      this.Player.element = document.getElementById(player_id);
                      this.Player.Paused = 0;
                    },

      Play        : function(){
                      if( typeof(this.Player.getPlayerState) == 'function' && this.Player.getPlayerState() === 2  && this.Player.Paused == 1 ){
                        this.Player.playVideo();
                        this.Player.Paused = 0;
                      }
                    },

      Pause       : function(){
                      if( typeof(this.Player.getPlayerState) == 'function' && this.Player.getPlayerState() === 1 ){
                        this.Player.pauseVideo();
                        this.Player.Paused = 1;
                      }
                    },

      ScrollControl : function(){
                        if( Utils.IsElementInViewport(this.Player.element) ){
                          this.Play();
                        }else{
                          this.Pause();
                        }
                      },

      EventHandler  : function(){
                        var _this = this;
                        $(window).on('scroll', function(){
                          var now = +new Date;
                          if( _this.lastExec && now < _this.lastExec + 250 ){
                            clearTimeout(_this.deferTimer);
                            _this.deferTimer = setTimeout(function(){
                              _this.lastExec = now;
                              _this.ScrollControl();
                            }, 250);
                          }else{
                            _this.lastExec = now;
                            _this.ScrollControl();
                          }
                        });
                      }
    };


    var Utils = {

      IsElementInViewport : function(el){
        var rect = el.getBoundingClientRect(); 
        var it_is = (
          rect.top    + rect.height * 0.5 >= 0 &&
          rect.left   + rect.width  * 0.5 >= 0 &&
          rect.bottom - rect.height * 0.5 <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right  - rect.width  * 0.5 <= (window.innerWidth || document.documentElement.clientWidth)
        );
        return it_is;
      }

    };

    return Program.Init();
  };

  $('.youtube-embed-player > iframe').each(function(){
    LoadVideo($(this).attr('id'));
  });

  $(document).on('SectionAdded SectionCopied', function(evt){
    var dynamic_id = 'ytp-' + Math.random().toString(16).slice(2);
    $(evt.target).find('iframe').attr('id', dynamic_id);
    // LoadVideo(dynamic_id); // won't work this way
  });

};
