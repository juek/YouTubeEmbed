/*
######################################################################
JS/jQuery for Typesetter CMS plugin YouTube Embed
Author: J. Krausz
Date: 2017-08-03
Version 1.0b3
######################################################################
*/

$(document).ready( function() {

  // if you are using the OnePageToolkit plugin and want videos to start playing 
  // when the wrapping OPTK-section scrolls into scope, 
  // uncomment the following lines

  /*
  $(document).on("optk:inScope", ".GPAREA", function(){
    var you_tube_video_iframe = $(this).find(".youtube-embed-player > iframe");
    if( you_tube_video_iframe.length ){
      you_tube_video_iframe[0].src += "&autoplay=1";
    }
  });
  */
  
  // if you only want this behavior for specific video(s), add a CSS class 'autoplay-in-scope' to the YouTube Embedding section
  // and use this code instead:

  /*
  $(document).on("optk:inScope", ".GPAREA", function(){
    var you_tube_video_iframe = $(this).find(".filetype-YouTube_Embed.autoplay-in-scope .youtube-embed-player > iframe");
    if( you_tube_video_iframe.length ){
      you_tube_video_iframe[0].src += "&autoplay=1";
    }
  });
  */

}); /* domready end */
