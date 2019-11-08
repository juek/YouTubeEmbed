<?php
/*
######################################################################
PHP class for Typesetter CMS plugin YouTube Embed
Author: J. Krausz
Date: 2017-08-03
Version 1.0b3
######################################################################
*/

defined('is_running') or die('Not an entry point...');

class YouTubeEmbed {

  static function GetHead() {
    global $page, $addonRelativeCode;
    $page->css_user[] = $addonRelativeCode . '/YouTubeEmbed.css';
    $page->head_js[]  = $addonRelativeCode . '/YouTubeEmbed.js';
    common::AddColorBox();
  }



  static function SectionTypes($section_types){
    $section_types['YouTube_Embed'] = array();
    $section_types['YouTube_Embed']['label'] = 'YouTube Embed';
    return $section_types;
  }



  static function NewSections($links){
    global $addonRelativeCode;
    foreach($links as $key => $section_type_arr){
      if( $section_type_arr[0] == 'YouTube_Embed' ){
        $links[$key] = array('YouTube_Embed', $addonRelativeCode . '/icons/section.png');
      }
    }
    return $links;
  }



  static function DefaultContent($default_content, $type){
    if( $type !== 'YouTube_Embed' ){
      return $default_content;
    }
    global $addonRelativeCode;
    if( $type == 'YouTube_Embed' ){
      $newSection = array(
      'content'   => '<div class="youtube-embed-player youtube-embed-responsive_16by9">'
                   .  '<iframe src="//www.youtube.com/embed/M7lc1UVf-VE"></iframe>'
                   . '</div>',
      'gp_label'  => 'YouTube Embedding',
      'gp_color'  => '#e62117',
      );
    }
    return $newSection;
  }



  static function SaveSection($return, $section, $type){
    global $page;
    if( $type == 'YouTube_Embed' ){
      $content =& $_POST['gpcontent'];
      $page->file_sections[$section]['content'] = $content;
      return true;
    }
    return $return;
  }



  static function InlineEdit_Scripts($scripts, $type){
    if( $type !== 'YouTube_Embed' ){
      return $scripts;
    }
    global $addonRelativeCode, $addonCodeFolder, $addonFolderName;

    // addon JS Data Object/basepath
    $addonBasePath = (strpos($addonRelativeCode, 'addons/') > 0) 
      ? '/addons/' . $addonFolderName 
      : '/data/_addoncode/' . $addonFolderName;
    echo 'var YouTubeEmbed = { base : "' . $addonBasePath . '" }; ';

    // scripts
    //$scripts[] = $addonCodeFolder . '/YouTubeEmbed_edit.js'; 
    $scripts[] = $addonCodeFolder . '/YouTubeEmbed_edit.min.js'; 
    return $scripts;
  }

}