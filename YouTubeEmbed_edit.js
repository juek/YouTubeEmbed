/**
 * ###########################################################
 * JS/jQuery script for Typesetter CMS plugin YouTube Embed
 * Author: J. Krausz, mahotilo
 * Date: 2019-11-03
 * Version 1.0-b4
 * ###########################################################
 */


function gp_init_inline_edit(area_id, section_object){ 

  $gp.LoadStyle( YouTubeEmbed.base + '/YouTubeEmbed_edit.css' );
  gp_editing.editor_tools();

  gp_editor = {

    edit_div            : gp_editing.get_edit_area(area_id),
    save_path           : gp_editing.get_path(area_id),
    destroy             : function(){},
    checkDirty          : function(){ return gp_editor.isDirty; },
    resetDirty          : function(){},
    updateElement       : function(){},
    gp_saveData         : function(){},

    codeChanged         : false,
    isDirty             : false,
    updateEditor        : function(){},

    embedCode           : false,
    getEmbedCode        : function(){},
    applyEmbedCode      : function(){},
    toggleCodeEditing   : function(){},

    video               : "",  // "M7lc1UVf-VE"
    YouTubeParams       : {},
    YouTubeDefaults     : {
                            /* These are the current API defaults as of 2016-08. */
                            /* Possible changes by Google need to be adapted here, since all default parameters will be omitted in the iframe src. */
                            autoplay        : 0,                // 0 | 1
                            cc_load_policy  : 0,                // 0 | 1 (1 = force show closed captions even if disabled in user preferences)
                            color           : "red",            // "red" | "white"
                            controls        : 1,                // 0 | 1 | 2
                            disablekb       : 0,                // 0 | 1
                            end             : "",               // 0 | seconds for playback end
                            fs              : 1,                // 0 | 1
                            hl              : "default language",     // "en" | any valid ISO 639-1 lang code
                            iv_load_policy  : 1,                // 1 | 3
                            listType        : "video",          // "video" | "playlist" | "search" | "user_uploads"
                            list            : {
                                                video         : "", // e.g. "M7lc1UVf-VE" | any valid video id)
                                                playlist      : "", // "PLC77007E23FF423C6" | any valid list id)
                                                search        : "", // Search Query
                                                user_uploads  : ""  // YouTube user or channel name
                                              },
                            loop            : 0,                // 0 | 1
                            modestbranding  : 0,                // 0 | 1
                            origin          : "",               // "" |  the website's domain
                            playsinline     : 0,                // 0 | 1 (enable iOS inline player)
                            rel             : 1,                // 0 | 1
                            showinfo        : 1,                // 0 | 1
                            start           : "",               // 0 | seconds for playback start
                            theme           : "dark",           // "dark" | "light"
                          },
    getYouTubeParams    : function(){},
    setYouTubeParams    : function(){},

    sizing              : {
                            method         : "responsive_16by9", // "responsive_16by9", "responsive_4by3", "fixed"
                            width          : false,
                            height         : false,
                            default_sizes  : {
                              fixed             : { width : 854, height : 460 },
                              responsive_16by9  : { width : 854, height : 460 },
                              responsive_4by3   : { width : 640, height : 380 }
                            },
                          },
    getSize             : function(){},
    setSize             : function(){},

    ui                  : {},
    
    controls : {

      /* ### SIZE ### */
      box0 : { 
        ctl0 : {
          id      : 'sizing',
          tag     : 'select',
          title   : 'Video Player Size/Aspect Ratio',
          icon    : 'fa fa-arrows',
          attrs   : {},
          classes : 'ctl-100',
          options : [ 
                      { text  : 'responsive 16:9',  value : 'responsive_16by9' }, 
                      { text  : 'responsive 4:3',   value : 'responsive_4by3' }, 
                      { text  : 'fixed size',       value : 'fixed' }
                    ],
          actions : [ { on : 'change', call : 'setSize' } ]
        }, // end of ctl0
        ctl1 : {
          id      : 'width',
          tag     : 'input',
          title   : 'Fixed Width in Pixels',
          icon    : 'fa fa-arrows-h',
          attrs   : { placeholder : 'width', type : 'number', min : '200' },
          classes : 'ctl-50',
          actions : [ { on : 'change', call : 'setSize' } ]
        }, // end of ctl1
        ctl2 : {
          id      : 'height',
          tag     : 'input',
          title   : 'Fixed Height in Pixels',
          icon    : 'fa fa-arrows-v',
          attrs   : { placeholder : 'height', type : 'number', min : '200' },
          classes : 'ctl-50',
          actions : [ { on : 'change', call : 'setSize' } ]
        }, // end of ctl2

      }, // end of box0


      /* ### CONTENT ### */
      box1 : { 
        ctl0 : {
          id      : 'listType',
          tag     : 'select',
          title   : 'Video Content',
          icon    : 'fa fa-youtube-play',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'video(s)',  value : 'video' },
                      { text  : 'playlist ID',  value : 'playlist' },
                      { text  : 'search query',  value : 'search' },
                      { text  : 'user uploads',  value : 'user_uploads' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        }, // end of ctl0
        ctl1 : {
          id      : 'video',
          tag     : 'input',
          title   : 'YouTube Video ID(s)',
          icon    : 'fa fa-file-video-o',
          attrs   : { placeholder : 'Video-ID[,Video-ID,...]', type : 'text', required : 'required', pattern : "[A-Za-z0-9_,-]{11,}" },
          classes : 'ctl-100 yt-param',
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        }, // end of ctl1
        ctl2 : {
          id      : 'playlist',
          tag     : 'input',
          title   : 'YouTube Playlist ID',
          icon    : 'fa fa-list-ul',
          attrs   : { placeholder : 'Playlist-ID', type : 'text', required : 'required', pattern : "[A-Za-z0-9_,-]{18,}" },
          classes : 'ctl-100 yt-param',
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        }, // end of ctl2
        ctl3 : {
          id      : 'search',
          tag     : 'input',
          title   : 'Search Query',
          icon    : 'fa fa-search',
          attrs   : { placeholder : 'Search Query', type : 'text', required : 'required', pattern : ".{2,}" },
          classes : 'ctl-100 yt-param',
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        }, // end of ctl3
        ctl4 : {
          id      : 'user_uploads',
          tag     : 'input',
          title   : 'User Uploads',
          icon    : 'fa fa-user',
          attrs   : { placeholder : 'User or Channel Name', type : 'text', required : 'required', pattern : ".{4,}" },
          classes : 'ctl-100 yt-param',
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        }, // end of ctl2
      }, // end of box1


      /* ### AUTOPLAY ### */
      box2 : { 
        ctl0 : {
          id      : 'autoplay',
          tag     : 'select',
          title   : 'Auto Play',
          icon    : 'fa fa-play',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'autoplay off', value : '0' },
                      { text  : 'autoplay on',  value : '1' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box2


      /* ### LOOP ### */
      box3 : {
        ctl0 : {
          id      : 'loop',
          tag     : 'select',
          title   : 'Loop',
          icon    : 'fa fa-refresh',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'loop off', value : '0' },
                      { text  : 'loop on',  value : '1' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box2


      /* ### THEME ### */
      box4 : { 
        ctl0 : {
          id      : 'theme',
          tag     : 'select',
          title   : 'Theme',
          icon    : 'fa fa-paint-brush',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'dark theme', value : 'dark' },
                      { text  : 'light theme', value : 'light' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box4


      /* ### PROGRESS BAR COLOR ### */
      box5 : { 
        ctl0 : {
          id      : 'color',
          tag     : 'select',
          title   : 'Progress Bar Color',
          icon    : 'fa fa-paint-brush',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'red progress bar', value : 'red' },
                      { text  : 'white progress bar', value : 'white' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box5


      /* ### CONTROLS ### */
      box6 : { 
        ctl0 : {
          id      : 'controls',
          tag     : 'select',
          title   : 'Show Controls',
          icon    : 'fa fa-volume-up',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'hide controls', value : '0' },
                      { text  : 'show controls', value : '1' },
                      { text  : 'show controls on playback', value : '2' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box6


      /* ### DISABLE KEYBOARD ### */
      box7 : { 
        ctl0 : {
          id      : 'disablekb',
          tag     : 'select',
          title   : 'Keyboard Controls',
          icon    : 'fa fa-keyboard-o',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'keyboard controls on', value : '0' },
                      { text  : 'keyboard controls off', value : '1' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box7


      /* ### CLOSED CAPTIONS ### */
      box8 : { 
        ctl0 : {
          id      : 'cc_load_policy',
          tag     : 'select',
          title   : 'Keyboard Controls',
          icon    : 'fa fa-font',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'closed captions by user prefs', value : '0' },
                      { text  : 'force show closed captions', value : '1' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box8


      /* ### FULLSCREEN BUTTON ### */
      box9 : { 
        ctl0 : {
          id      : 'fs',
          tag     : 'select',
          title   : 'Fullscreen Button',
          icon    : 'fa fa-expand',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'hide fullscreen button', value : '0' },
                      { text  : 'show fullscreen button', value : '1' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box9


      /* ### PLAYER LANGUAGE ### */
      box10 : { 
        ctl0 : {
          id      : 'hl',
          tag     : 'select',
          title   : 'Player Language',
          icon    : 'fa fa-globe',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text : "default language", value : "default language" },
                      { text : "Abkhazian", value : "ab" },
                      { text : "Afar", value : "aa" },
                      { text : "Afrikaans", value : "af" },
                      { text : "Albanian", value : "sq" },
                      { text : "Amharic", value : "am" },
                      { text : "Arabic", value : "ar" },
                      { text : "Aragonese", value : "an" },
                      { text : "Armenian", value : "hy" },
                      { text : "Assamese", value : "as" },
                      { text : "Aymara", value : "ay" },
                      { text : "Azerbaijani", value : "az" },
                      { text : "Bashkir", value : "ba" },
                      { text : "Basque", value : "eu" },
                      { text : "Bengali (Bangla)", value : "bn" },
                      { text : "Bhutani", value : "dz" },
                      { text : "Bihari", value : "bh" },
                      { text : "Bislama", value : "bi" },
                      { text : "Breton", value : "br" },
                      { text : "Bulgarian", value : "bg" },
                      { text : "Burmese", value : "my" },
                      { text : "Byelorussian (Belarusian)", value : "be" },
                      { text : "Cambodian", value : "km" },
                      { text : "Catalan", value : "ca" },
                      { text : "Cherokee", value : "chr" },
                      { text : "Chewa", value : "nya" },
                      { text : "Chinese", value : "zh" },
                      { text : "Chinese (Simplified)", value : "zh-Hans" },
                      { text : "Chinese (Traditional)", value : "zh-Hant" },
                      { text : "Corsican", value : "co" },
                      { text : "Croatian", value : "hr" },
                      { text : "Czech", value : "cs" },
                      { text : "Danish", value : "da" },
                      { text : "Divehi", value : "div" },
                      { text : "Dutch", value : "nl" },
                      { text : "Edo", value : "bin" },
                      { text : "English", value : "en" },
                      { text : "Esperanto", value : "eo" },
                      { text : "Estonian", value : "et" },
                      { text : "Faeroese", value : "fo" },
                      { text : "Farsi", value : "fa" },
                      { text : "Fiji", value : "fj" },
                      { text : "Finnish", value : "fi" },
                      { text : "French", value : "fr" },
                      { text : "Frisian", value : "fy" },
                      { text : "Fulfulde", value : "ful" },
                      { text : "Galician", value : "gl" },
                      { text : "Gaelic (Scottish)", value : "gd" },
                      { text : "Gaelic (Manx)", value : "gv" },
                      { text : "Georgian", value : "ka" },
                      { text : "German", value : "de" },
                      { text : "Greek", value : "el" },
                      { text : "Greenlandic", value : "kl" },
                      { text : "Guarani", value : "gn" },
                      { text : "Gujarati", value : "gu" },
                      { text : "Haitian Creole", value : "ht" },
                      { text : "Hausa", value : "ha" },
                      { text : "Hawaiian", value : "haw" },
                      { text : "Hebrew he", value : "iw" },
                      { text : "Hindi", value : "hi" },
                      { text : "Hungarian", value : "hu" },
                      { text : "Icelandic", value : "is" },
                      { text : "Ido", value : "io" },
                      { text : "Igbo", value : "ibo" },
                      { text : "Indonesian", value : "in" },
                      { text : "Interlingua", value : "ia" },
                      { text : "Interlingue", value : "ie" },
                      { text : "Inuktitut", value : "iu" },
                      { text : "Inupiak", value : "ik" },
                      { text : "Irish", value : "ga" },
                      { text : "Italian", value : "it" },
                      { text : "Japanese", value : "ja" },
                      { text : "Javanese", value : "jv" },
                      { text : "Kannada", value : "kn" },
                      { text : "Kanuri", value : "kau" },
                      { text : "Kashmiri", value : "ks" },
                      { text : "Kazakh", value : "kk" },
                      { text : "Kinyarwanda (Ruanda)", value : "rw" },
                      { text : "Kirghiz", value : "ky" },
                      { text : "Kirundi (Rundi)", value : "rn" },
                      { text : "Konkani", value : "kok" },
                      { text : "Korean", value : "ko" },
                      { text : "Kurdish", value : "ku" },
                      { text : "Laothian", value : "lo" },
                      { text : "Latin", value : "la" },
                      { text : "Latvian (Lettish)", value : "lv" },
                      { text : "Limburgish ( Limburger)", value : "li" },
                      { text : "Lingala", value : "ln" },
                      { text : "Lithuanian", value : "lt" },
                      { text : "Macedonian", value : "mk" },
                      { text : "Malagasy", value : "mg" },
                      { text : "Malay", value : "ms" },
                      { text : "Malayalam", value : "ml" },
                      { text : "Maltese", value : "mt" },
                      { text : "Maori", value : "mi" },
                      { text : "Marathi", value : "mr" },
                      { text : "Moldavian", value : "mo" },
                      { text : "Mongolian", value : "mn" },
                      { text : "Nauru", value : "na" },
                      { text : "Nepali", value : "ne" },
                      { text : "Norwegian", value : "no" },
                      { text : "Occitan", value : "oc" },
                      { text : "Oriya", value : "or" },
                      { text : "Oromo (Afaan Oromo)", value : "om" },
                      { text : "Papiamentu", value : "pap" },
                      { text : "Pashto (Pushto)", value : "ps" },
                      { text : "Polish", value : "pl" },
                      { text : "Portuguese", value : "pt" },
                      { text : "Punjabi", value : "pa" },
                      { text : "Quechua", value : "qu" },
                      { text : "Rhaeto-Romance", value : "rm" },
                      { text : "Romanian", value : "ro" },
                      { text : "Russian", value : "ru" },
                      { text : "Samoan", value : "sm" },
                      { text : "Sangro", value : "sg" },
                      { text : "Sanskrit", value : "sa" },
                      { text : "Serbian", value : "sr" },
                      { text : "Serbo-Croatian", value : "sh" },
                      { text : "Sesotho", value : "st" },
                      { text : "Setswana", value : "tn" },
                      { text : "Shona", value : "sn" },
                      { text : "Sichuan Yi", value : "ii" },
                      { text : "Sindhi", value : "sd" },
                      { text : "Sinhalese", value : "si" },
                      { text : "Siswati", value : "ss" },
                      { text : "Slovak", value : "sk" },
                      { text : "Slovenian", value : "sl" },
                      { text : "Somali", value : "so" },
                      { text : "Spanish", value : "es" },
                      { text : "Sundanese", value : "su" },
                      { text : "Swahili (Kiswahili)", value : "sw" },
                      { text : "Swedish", value : "sv" },
                      { text : "Syriac", value : "syr" },
                      { text : "Tagalog", value : "tl" },
                      { text : "Tajik", value : "tg" },
                      { text : "Tamazight", value : "zgh" },
                      { text : "Tamil", value : "ta" },
                      { text : "Tatar", value : "tt" },
                      { text : "Telugu", value : "te" },
                      { text : "Thai", value : "th" },
                      { text : "Tibetan", value : "bo" },
                      { text : "Tigrinya", value : "ti" },
                      { text : "Tonga", value : "to" },
                      { text : "Tsonga", value : "ts" },
                      { text : "Turkish", value : "tr" },
                      { text : "Turkmen", value : "tk" },
                      { text : "Twi", value : "tw" },
                      { text : "Uighur", value : "ug" },
                      { text : "Ukrainian", value : "uk" },
                      { text : "Urdu", value : "ur" },
                      { text : "Uzbek", value : "uz" },
                      { text : "Venda", value : "ven" },
                      { text : "Vietnamese", value : "vi" },
                      { text : "Volap&uuml;k", value : "vo" },
                      { text : "Wallon", value : "wa" },
                      { text : "Welsh", value : "cy" },
                      { text : "Wolof", value : "wo" },
                      { text : "Xhosa", value : "xh" },
                      { text : "Yiddish", value : "yi" },
                      { text : "Yoruba", value : "yo" },
                      { text : "Zulu", value : "zu" }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box19


      /* ### SHOW INFOS ### */
      box11 : { 
        ctl0 : {
          id      : 'showinfo',
          tag     : 'select',
          title   : 'Show Video Information',
          icon    : 'fa fa-info-circle',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'no infos before playback', value : '0' },
                      { text  : 'show infos', value : '1' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box11


      /* ### ANNOTATIONS ### */
      box12 : { 
        ctl0 : {
          id      : 'iv_load_policy',
          tag     : 'select',
          title   : 'Show Video Annotations',
          icon    : 'fa fa-sticky-note-o',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'show video annotations', value : '1' },
                      { text  : 'do not show video annotations', value : '3' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box12


      /* ### MODEST BRANDING ### */
      box13 : { 
        ctl0 : {
          id      : 'modestbranding',
          tag     : 'select',
          title   : 'YouTube Logo (Modest Branding)',
          icon    : 'fa  fa-youtube',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'show YouTube logo', value : '0' },
                      { text  : 'do not show YouTube logo', value : '1' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box13


      /* ### PLAY INLINE ON iOS ### */
      box14 : { 
        ctl0 : {
          id      : 'playsinline',
          tag     : 'select',
          title   : 'Play Video Inline on iOS',
          icon    : 'fa  fa-apple',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'iOS: play fullscreen', value : '0' },
                      { text  : 'iOS: play inline', value : '1' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box14


      /* ### SHOW RELATED VIDEOS ### */
      box15 : { 
        ctl0 : {
          id      : 'rel',
          tag     : 'select',
          title   : 'Show Related Videos',
          icon    : 'fa fa-th',
          attrs   : {},
          classes : 'ctl-100 yt-param',
          options : [ 
                      { text  : 'do not show related videos', value : '0' },
                      { text  : 'show related videos', value : '1' }
                    ],
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        } // end of ctl0
      }, // end of box15


      /* ### START @ SEC ### */
      box16 : { 
        ctl0 : {
          id      : 'start',
          tag     : 'input',
          title   : 'Start Video at (seconds)',
          icon    : 'fa  fa-toggle-right',
          attrs   : { placeholder : '0', type : 'number' },
          classes : 'ctl-100 yt-param',
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        }, // end of ctl0
      }, // end of box16


      /* ### END @ SEC ### */
      box17 : { 
        ctl0 : {
          id      : 'end',
          tag     : 'input',
          title   : 'End Video at (seconds)',
          icon    : 'fa fa-toggle-left',
          attrs   : { placeholder : '59', type : 'number' },
          classes : 'ctl-100 yt-param',
          actions : [ { on : 'change', call : 'setYouTubeParams' } ]
        }, // end of ctl0
      }, // end of box17


      /* ### ORIGIN ### */
      box18 : { 
        ctl0 : {
          id      : 'origin',
          tag     : 'input',
          title   : 'Origin',
          icon    : 'fa fa-home',
          attrs   : { placeholder : 'http://www.example.com', type : 'text' },
          classes : 'ctl-100 yt-param',
          actions : [ 
                      { on : 'change', call : 'setYouTubeParams' },
                      { on : 'click focus', call : 'setOrigin' }
                    ]
        }, // end of ctl0
      } // end of box18

    } // end of controls

  }; /* gp_editor -- end */




  gp_editor.gp_saveData = function() {
    gp_editor.edit_div.find('.gpclear').remove();
    var content = gp_editor.edit_div.html();
    gp_editor.isDirty = false;
    return '&gpcontent=' + encodeURIComponent(content);
  }; /* fnc gp_editor.gp_saveData --end */




  gp_editor.toggleCodeEditing = function(action){
    var embed_code_editor = $("div.editor_ctl_code_editor");
    var edit_code_btn = $(".editor_ctl_edit_btn");
    var close_button = $("button#ts_YTE_close_code");
    switch( action ){
      case "show":
        gp_editor.ui.option_area.find(".yt-param select, .yt-param input, .yt-param textarea").prop("disabled", true);
        embed_code_editor.slideDown();
        edit_code_btn.slideUp();
        break;

      case "close":
        if( gp_editor.codeChanged ){
          apply_changes = confirm("Embed code was changed. Apply changes now?")
          if( apply_changes ){
            gp_editor.applyEmbedCode();
            gp_editor.updateControls();
          }
        }
        gp_editor.ui.option_area.find(".yt-param select, .yt-param input, .yt-param textarea").prop("disabled", false);
        embed_code_editor.slideUp();
        edit_code_btn.slideDown();
        break;

      case "apply":
        gp_editor.codeChanged = false;
        gp_editor.applyEmbedCode();
        gp_editor.updateControls();
        // close_button.html('<i class="fa fa-times"></i> Close');
        break;
    }
  };/* fnc gp_editor.toggleCodeEditing --end */




  gp_editor.getEmbedCode = function(updateEditor){
    var the_iframe = gp_editor.edit_div.find("iframe");
    if( !the_iframe.length ){ 
      alert("Error: iframe element is missing!");
      return false;
    }
    gp_editor.embedCode = the_iframe[0].outerHTML;
    if( updateEditor ){
      gp_editor.ui.embed_code.val(gp_editor.embedCode);
    }
    if( gp_editor.embedCode.indexOf("M7lc1UVf-VE") > 0 ){
      return true;
    }
    return false;
  }; /* fnc gp_editor.getEmbedCode --end */




  gp_editor.applyEmbedCode = function(){
    gp_editor.embedCode = gp_editor.ui.embed_code.val();
    gp_editor.edit_div.find("iframe").remove();
    var $new_iframe = $(gp_editor.embedCode);
    var new_src = $new_iframe.attr('src');
    if( new_src && new_src.indexOf('enablejsapi') == -1 ){
      new_src += (new_src.indexOf('?') == -1) ? '?enablejsapi=1' : '&enablejsapi=1';
      $new_iframe.attr('src', new_src);
    }
    gp_editor.edit_div.find(".youtube-embed-player").append($new_iframe);
    var html = $new_iframe[0].outerHTML;
    gp_editor.ui.embed_code.val(html);
    gp_editor.isDirty = true;
  }; /* fnc gp_editor.applyEmbedCode --end */




  gp_editor.updateControls = function(){
    gp_editor.getSize();
    gp_editor.getYouTubeParams();
 
    gp_editor.ui.sizing.val(gp_editor.sizing.method);
    gp_editor.ui.width.val(gp_editor.sizing.width);
    gp_editor.ui.height.val(gp_editor.sizing.height);

    gp_editor.ui.autoplay.val(gp_editor.YouTubeParams.autoplay);
    gp_editor.ui.cc_load_policy.val(gp_editor.YouTubeParams.cc_load_policy);
    gp_editor.ui.color.val(gp_editor.YouTubeParams.color);
    gp_editor.ui.controls.val(gp_editor.YouTubeParams.controls);
    gp_editor.ui.disablekb.val(gp_editor.YouTubeParams.disablekb);
    gp_editor.ui.end.val(gp_editor.YouTubeParams.end);
    gp_editor.ui.fs.val(gp_editor.YouTubeParams.fs);
    gp_editor.ui.hl.val(gp_editor.YouTubeParams.hl);
    gp_editor.ui.iv_load_policy.val(gp_editor.YouTubeParams.iv_load_policy);
    gp_editor.ui.listType.val(gp_editor.YouTubeParams.listType);
    gp_editor.ui.video.val(gp_editor.video); 
    gp_editor.ui.playlist.val(gp_editor.YouTubeParams.list.playlist); 
    gp_editor.ui.search.val(gp_editor.YouTubeParams.list.search); 
    gp_editor.ui.user_uploads.val(gp_editor.YouTubeParams.list.user_upload); 
    gp_editor.ui.loop.val(gp_editor.YouTubeParams.loop);
    gp_editor.ui.modestbranding.val(gp_editor.YouTubeParams.modestbranding);
    gp_editor.ui.origin.val(gp_editor.YouTubeParams.origin)
    gp_editor.ui.playsinline.val(gp_editor.YouTubeParams.playsinline);
    gp_editor.ui.rel.val(gp_editor.YouTubeParams.rel);
    gp_editor.ui.showinfo.val(gp_editor.YouTubeParams.showinfo);
    gp_editor.ui.start.val(gp_editor.YouTubeParams.start);
    gp_editor.ui.theme.val(gp_editor.YouTubeParams.theme);
  }; /* fnc gp_editor.updateControls--end */




  gp_editor.getSize = function(){
    var player = gp_editor.edit_div.find(".youtube-embed-player");
    var iframe = gp_editor.edit_div.find("iframe");

    gp_editor.sizing.method = "fixed"; 
    if( player.hasClass("youtube-embed-responsive_16by9") ){
      gp_editor.sizing.method = "responsive_16by9"; 
    };
    if( player.hasClass("youtube-embed-responsive_4by3") ){
      gp_editor.sizing.method = "responsive_4by3"; 
    };

    var width = iframe.attr("width");
    if( !width ){
      // no width attr, use default
      width = gp_editor.sizing.default_sizes[gp_editor.sizing.method].width;
    }
    var height = iframe.attr("height");
    if( !height ){
      // no height attr, use default
      height = gp_editor.sizing.default_sizes[gp_editor.sizing.method].height;
    }

    gp_editor.sizing.width = width;
    gp_editor.sizing.height = height;

  }; /* fnc gp_editor.getSize --end */




  gp_editor.setOrigin = function(){
    console.log("SetOrigin");
    if( gp_editor.ui.origin.val().trim() == "" ){
     gp_editor.ui.origin
      .val(location.origin)
      .select();
     gp_editor.setYouTubeParams();
    }
  }; /* fnc gp_editor.setOrigin --end */




  gp_editor.setSize = function(){
    var player = gp_editor.edit_div.find(".youtube-embed-player");
    var iframe = gp_editor.edit_div.find("iframe");

    gp_editor.sizing.method = $("#ts_YTE_sizing").val();

    var width = parseInt( $("#ts_YTE_width").val() );
    if( isNaN(width) || width <= 0 ){
      // invalid width => use default
      width = gp_editor.sizing.default_sizes[gp_editor.sizing.method].width;
    }
    var height = parseInt( $("#ts_YTE_height").val() );
    if( isNaN(height) || width <= 0 ){
      // invalid height => use default
      height = gp_editor.sizing.default_sizes[gp_editor.sizing.method].height;
    }

    $("#ts_YTE_width").val(width);
    gp_editor.sizing.width = width;
    $("#ts_YTE_height").val(height);
    gp_editor.sizing.height = height;

    iframe.attr({
      "width"   : gp_editor.sizing.width,
      "height"  : gp_editor.sizing.height
    });

    player.removeClass("youtube-embed-responsive_16by9 youtube-embed-responsive_4by3")
    switch ( gp_editor.sizing.method ){
      default:
      case "responsive_4by3":
      case "responsive_16by9":
        player.addClass("youtube-embed-" + gp_editor.sizing.method);
        gp_editor.ui.width.closest('label').hide();
        gp_editor.ui.height.closest('label').hide();
        break;
      case "fixed":
        gp_editor.ui.width.closest('label').show();
        gp_editor.ui.height.closest('label').show();
        break;
    }

    // update embed code
    gp_editor.getEmbedCode(true);
    gp_editor.isDirty = true;
  }; /* fnc gp_editor.setSize --end */





  gp_editor.getYouTubeParams = function(){
    var iframe_src = gp_editor.edit_div.find("iframe").attr("src");
    if( !iframe_src ){
      alert("Error: Iframe not found or has no valid src attribute.");
      return false;
    }
    var url_parts = iframe_src.split('?');
    // console.log("URL parts:" , url_parts);
    var video = url_parts[0].lastIndexOf('/embed') ? url_parts[0].substr(url_parts[0].lastIndexOf('/embed')+7) : false;
    //console.log("Video ID:" + video);
    var pairs = url_parts.length>1 ? url_parts[1].split('&') : [] ;
    var result = {};
    pairs.forEach(function(pair){
      var pair = pair.split('=');
      var key = pair[0];
      var value = decodeURIComponent(pair[1] || '');
      if( result[key] ){
        if( Object.prototype.toString.call( result[key] ) === '[object Array]' ){
          result[key].push( value );
        }else{
          result[key] = [ result[key], value ];
        }
      }else{
        result[key] = value;
      }
    });
    gp_editor.YouTubeParams = JSON.parse(JSON.stringify(result));
    //console.log("YTP before: ", gp_editor.YouTubeParams);

    if( typeof(gp_editor.YouTubeParams.list) == "string"){
      var listObj = { video : '', playlist : '', search : '', user_uploads : '' };
      if( typeof(gp_editor.YouTubeParams.listType) == "undefined" ){
        // has a list ID but no listType
        if( gp_editor.YouTubeParams.list.substr(0,2) == "PL" ){
          //console.log("PL!");
          gp_editor.YouTubeParams.listType = "playlist";
          listObj.playlist = gp_editor.YouTubeParams.list;
        }
      }else{
        listObj[gp_editor.YouTubeParams.listType] = gp_editor.YouTubeParams.list;
      }
      gp_editor.YouTubeParams.list = listObj;
      gp_editor.YouTubeParams.list.video = video ? video : '';
    }

    // replsace all non-existing params with defaults
    $.each( gp_editor.YouTubeDefaults, function(i, v){
      // console.log( "["+i+"]" + " -> typeof = " + typeof(gp_editor.YouTubeParams[i]) );
      if( typeof(gp_editor.YouTubeParams[i]) == "undefined" ){
        gp_editor.YouTubeParams[i] = v;
      }
    });
    //console.log("YTP after: ", gp_editor.YouTubeParams);
    gp_editor.video = video ? video : '';

    if( typeof(gp_editor.YouTubeParams.playlist) != "undefined" ){
      gp_editor.video += (',' + gp_editor.YouTubeParams['playlist']);
    }
    // console.log("YouTube Params:" , gp_editor.YouTubeParams);
    return true;
  }; /* fnc gp_editor.getYouTubeParams --end */





  gp_editor.setYouTubeParams = function(){
    
    gp_editor.YouTubeParams = {
      autoplay       : gp_editor.ui.autoplay.val(),
      cc_load_policy : gp_editor.ui.cc_load_policy.val(),
      color          : gp_editor.ui.color.val(),
      controls       : gp_editor.ui.controls.val(),
      disablekb      : gp_editor.ui.disablekb.val(),
      end            : gp_editor.ui.end.val().trim(),
      fs             : gp_editor.ui.fs.val(),
      hl             : gp_editor.ui.hl.val(),
      iv_load_policy : gp_editor.ui.iv_load_policy.val(),
      listType       : gp_editor.ui.listType.val(),
      list           : { 
                          video       : gp_editor.ui.video.val(),
                          playlist    : gp_editor.ui.playlist.val(),
                          search      : gp_editor.ui.search.val(),
                          user_upload : gp_editor.ui.user_uploads.val()
                        },
      loop           : gp_editor.ui.loop.val(),
      modestbranding : gp_editor.ui.modestbranding.val(),
      origin         : gp_editor.ui.origin.val().trim(),
      playsinline    : gp_editor.ui.playsinline.val(),
      rel            : gp_editor.ui.rel.val(),
      showinfo       : gp_editor.ui.showinfo.val(),
      start          : gp_editor.ui.start.val().trim(),
      theme          : gp_editor.ui.theme.val()
    };

    var params = {};
    gp_editor.video = false;

    // transfer all non-empty, non-default and non-object (list) values into the params object
    $.each( gp_editor.YouTubeDefaults, function(i, v){
      if( gp_editor.YouTubeParams[i] != v && gp_editor.YouTubeParams[i] != "" && typeof(gp_editor.YouTubeParams[i]) != "object" ){
        params[i] = gp_editor.YouTubeParams[i];
      }
    });

    if( params.hl == "--AUTO--" ){
      // remove hl parameter
      delete params.hl;
    }
    switch( params.listType ){
      default :
      case "video" :
        gp_editor.ui.video.closest('label').show();
        gp_editor.ui.playlist.closest('label').hide();
        gp_editor.ui.search.closest('label').hide();
        gp_editor.ui.user_uploads.closest('label').hide();

        gp_editor.video = gp_editor.ui.video.val().trim();

        // loop for single videos also requires playlist=video_ID (crazy hackish weird API)
        if( params.loop == "1" ){
          params.playlist = gp_editor.video;
        }
        /*
        if( !gp_editor.video.match(/^[A-Za-z0-9_,-]{11}$/) ){
          gp_editor.ui.video[0].setCustomValidity("Please insert a valid video ID");
          // alert("Warning: The Video ID seems to be invalid!");
        }
        */
        delete params.listType;
        delete params.list;
        break;

      case "playlist" : 
        gp_editor.ui.video.closest('label').hide();
        gp_editor.ui.playlist.closest('label').show();
        gp_editor.ui.search.closest('label').hide();
        gp_editor.ui.user_uploads.closest('label').hide();
        /*
        if( !gp_editor.YouTubeParams.list.playlist.match(/^[A-Za-z0-9_-]{18}$/) ){
          gp_editor.ui.playlist[0].setCustomValidity("Please insert a valid playlist ID");
          alert("Warning: The Playlist field may not be empty!");
        } 
        */
        params.list = gp_editor.YouTubeParams.list.playlist;
        break;

      case "search" : 
        gp_editor.ui.video.closest('label').hide();
        gp_editor.ui.playlist.closest('label').hide();
        gp_editor.ui.search.closest('label').show();
        gp_editor.ui.user_uploads.closest('label').hide();
        /*
        if( gp_editor.YouTubeParams.list.search.length < 2 ){
          gp_editor.ui.search[0].setCustomValidity("Please insert a search query");
          alert("Warning: The Search Query field may not be empty!");
        }
        */
        params.list = gp_editor.YouTubeParams.list.search;
        break;

      case "user_uploads" : 
        gp_editor.ui.video.closest('label').hide();
        gp_editor.ui.playlist.closest('label').hide();
        gp_editor.ui.search.closest('label').hide();
        gp_editor.ui.user_uploads.closest('label').show();
        /*
        if( gp_editor.YouTubeParams.list.user_upload.length < 4 ){
          //gp_editor.ui.user_uploads[0].setCustomValidity("Please insert a YouTube username");
          // alert("Warning: The Username field may not be empty!");
        }
        */
        params.list = gp_editor.YouTubeParams.list.user_upload;
        break;
    }

    /*
    if( typeof(params.list) == "undefined" ){
      delete params.listType;
    }
    */
    var the_iframe = gp_editor.edit_div.find("iframe");
    the_iframe.attr("title", 'Video_' + gp_editor.video);
    var new_src = 'https://www.youtube-nocookie.com/embed' + (gp_editor.video ? '/'+gp_editor.video : '') + '?enablejsapi=1';
    if( !$.isEmptyObject(params) ){
      new_src += "&" + $.param(params);
    }
    the_iframe.attr("src", new_src);
    if( gp_editor.YouTubeParams.fs == "1" ){
      the_iframe.attr("allowfullscreen", "1");
    }else{
      the_iframe.removeAttr("allowfullscreen");
    }
    gp_editor.ui.embed_code.val(the_iframe[0].outerHTML.replace(/\&amp;/g,"&"));
    
    gp_editor.isDirty = true;

  }; /* fnc gp_editor.setYouTubeParams --end */




  /* ----------------------------- */
  /* --- GET DATA FROM CONTENT --- */
  /* ----------------------------- */
  var isDefaultContent = gp_editor.getEmbedCode(false); 
  gp_editor.getSize();
  gp_editor.getYouTubeParams();


  /* --- RENDER EDITOR AREA --- */
  gp_editor.ui.option_area = $('<div id="ts_YTE_options" />').prependTo('#ckeditor_controls');

  /* EDIT CODE BUTTON */
  var contol = $('<div class="editor_ctl_box editor_ctl_edit_btn"><label title="Edit YouTube Embed Code" /></div>');
  gp_editor.ui.edit_button = $('<button id="ts_YTE_edit_code"><i class="fa fa-pencil"></i> Edit Embed Code</button>');
  gp_editor.ui.edit_button
    .appendTo(contol.find('label'))
    .on('click', function(){
      gp_editor.toggleCodeEditing("show");
    });
  contol.appendTo(gp_editor.ui.option_area);

  /* EMBED CODE EDITOR */
  var contol = $(
      '<div class="editor_ctl_box editor_ctl_code_editor">'
    +   '<div id="ts_YTE_editor_msg">YouTube Embed Code&nbsp;&nbsp;'
    +     '<a href="https://developers.google.com/youtube/player_parameters" target="_blank" '
    +       'id="ts_YTE_api_info" title="YouTube Player Parameters"><i class="fa fa-info-circle no-margin"></i></a>'
    +   '</div>'
    +   '<label title="YouTube Embed Code" />'
    + '</div>'
  );
  gp_editor.ui.embed_code = $(
    '<textarea id="ts_YTE_ec" placeholder="Paste YouTube Embed Code here" required="required">'
    + gp_editor.embedCode
    + '</textarea>'  
  ).appendTo(contol.find('label'))
   .on('change', function(){
     gp_editor.codeChanged = true;
   });


  gp_editor.ui.apply_button = $('<button id="ts_YTE_apply_code"><i class="fa fa-check"></i> Apply</button>')
    .appendTo(contol)
    .on('click', function(){
      gp_editor.toggleCodeEditing("apply");
    });

  gp_editor.ui.close_button = $('<button id="ts_YTE_close_code"><i class="fa fa-times"></i> Close</button>')
    .appendTo(contol)
    .on('click', function(){
      gp_editor.toggleCodeEditing("close");
    });
  contol.appendTo(gp_editor.ui.option_area);


  /* ### BULD CONTROLS ### */

  $.each(gp_editor.controls, function(box,ctls){
    var control = $('<div class="editor_ctl_box"/>');
    // console.log("box:", box, "ctls:", ctls);
    $.each(ctls, function(ctl, props){
      // console.log("box=" + box +  ", ctl="+ctl, " -> props:", props);
      var label = $('<label title="' + props.title + '"/>');
      if( typeof(props.icon) != "undefined" && props.icon != '' ){
        label.append('<i class="' + props.icon + ' fa-fw"/>');
        label.addClass('has-icon');
      }
      if( typeof(props.classes) != "undefined" && props.classes != '' ){
        label.addClass(props.classes);
      }
      gp_editor.ui[props.id] = $('<' + props.tag + '/>');
      gp_editor.ui[props.id].attr('id', 'ts_YTE_' + props.id);
      if( typeof(props.attrs) != "undefined" ){
        gp_editor.ui[props.id].attr(props.attrs);
      }
      if( props.tag == 'select' && typeof(props.options) != "undefined" ){
        $.each(props.options, function(oi,ov){
          gp_editor.ui[props.id].append('<option value="' + ov.value + '">' + ov.text + '</option>');
        });
      }
      if( typeof(props.actions) != "undefined" ){
        $.each(props.actions, function(ai,av){
          //console.log('gp_editor.ui.' + props.id + '.on("' + av.on + '", gp_editor.' + av.call + ');');
          gp_editor.ui[props.id].on(av.on, gp_editor[av.call]);
        });
      }
      switch( props.id ){
        case "sizing":
          gp_editor.ui[props.id].val(gp_editor.sizing.method);
          break;
        case "width":
        case "height":
          gp_editor.ui[props.id].val(gp_editor.sizing[props.id]);
          break;
        case "video":
          gp_editor.ui[props.id].val(gp_editor.video);
          break;
        case "playlist":
        case "search":
        case "user_uploads" :
          gp_editor.ui[props.id].val(gp_editor.YouTubeParams.list[props.id]);
          break;
        default:
          gp_editor.ui[props.id].val(gp_editor.YouTubeParams[props.id]);
          break;
      }
      gp_editor.ui[props.id].appendTo(label);
      label.appendTo(control);
    });
    control.appendTo(gp_editor.ui.option_area);
  });


  // show/hide fields
  
  if( gp_editor.sizing.method != "fixed"){
    gp_editor.ui.width.closest('label').hide();
    gp_editor.ui.height.closest('label').hide();
  }  
  gp_editor.ui.video.closest('label').hide();
  gp_editor.ui.playlist.closest('label').hide();
  gp_editor.ui.search.closest('label').hide();
  gp_editor.ui.user_uploads.closest('label').hide();
  gp_editor.ui[gp_editor.YouTubeParams.listType].closest('label').show();

  if( isDefaultContent ){
    window.setTimeout(function(){
      gp_editor.toggleCodeEditing("show");
      gp_editor.ui.embed_code.focus().select();
    },1200);
  }

  // hide ajax overlay
  loaded();
  // neded to fix editor overflow/scrolling
  $(window).trigger("resize");

} /* main fnc gp_init_inline_edit --end */
