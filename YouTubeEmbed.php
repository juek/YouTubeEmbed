<?php
/**
 * ######################################################################
 * PHP class for Typesetter CMS plugin YouTube Embed
 * Authors: J. Krausz, Mahotilo
 * Date: 2019-11-09
 * Version: 1.0-b4
 * ######################################################################
 */

defined('is_running') or die('Not an entry point...');


class YouTubeEmbed {

  static function GetHead() {
    global $page, $addonRelativeCode;
    $page->css_user[] = $addonRelativeCode . '/YouTubeEmbed.css';
    $page->head_js[]  = $addonRelativeCode . '/YouTubeEmbed.js';
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
    global $addonRelativeCode;
    if( $type !== 'YouTube_Embed' ){
      return $default_content;
    }

    if( $type == 'YouTube_Embed' ){
      $newSection = array(
      'content'   => '<div class="youtube-embed-player youtube-embed-responsive_16by9">'
                   .   '<iframe id="ytp-' . \gp\tool::RandomString(12) . '" src="https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1" '
                   .   'title="YouTube Developers Live: Embedded Web Player Customization"></iframe>'
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
    global $addonRelativeCode, $addonCodeFolder, $addonFolderName;

    if( $type !== 'YouTube_Embed' ){
      return $scripts;
    }

    // addon JS Data Object/basepath
    $addonBasePath = (strpos($addonRelativeCode, 'addons/') > 0) 
      ? '/addons/' . $addonFolderName 
      : '/data/_addoncode/' . $addonFolderName;
    echo 'var YouTubeEmbed = { base : "' . $addonBasePath . '" }; ';

    // scripts
    // $scripts[] = $addonCodeFolder . '/YouTubeEmbed_edit.min.js'; 
    $scripts[] = $addonCodeFolder . '/YouTubeEmbed_edit.js'; 
    return $scripts;
  }

}
