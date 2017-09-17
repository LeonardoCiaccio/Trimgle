( function( $ ){
    
	"use strict";
		
	if( !$ )throw new Error( "jQuery required" );
	
// --> TRANSLATE
	
	$( "h4.header.all .content span" ).text( chrome.i18n.getMessage( "all_contents" ) );
	$( "h4.header.all .content .sub.header" ).text( chrome.i18n.getMessage( "all_contents_sub" ) );
	
	$( "h4.header.one .content span" ).text( chrome.i18n.getMessage( "one_content" ) );
	$( "h4.header.one .content .sub.header" ).text( chrome.i18n.getMessage( "one_content_sub" ) );
	
	$( "h4.header.collection .content span" ).text( chrome.i18n.getMessage( "collection_content" ) );
	$( "h4.header.collection .content .sub.header" ).text( chrome.i18n.getMessage( "collection_content_sub" ) );
	
	$( "h4.header.search .content span" ).text( chrome.i18n.getMessage( "search" ) );
	$( "h4.header.search .content .sub.header" ).text( chrome.i18n.getMessage( "search_sub" ) );
	
	$( ".breadcrumb .section.home" ).text( chrome.i18n.getMessage( "home" ) );
	$( ".breadcrumb .section.about" ).text( chrome.i18n.getMessage( "about" ) );
	$( ".breadcrumb .section.page" ).text( chrome.i18n.getMessage( "page" ) );
	$( ".breadcrumb .section.edit" ).text( chrome.i18n.getMessage( "edit" ) );
	$( ".breadcrumb .section.webhook" ).text( chrome.i18n.getMessage( "ping_webhook" ) );
	$( ".breadcrumb .section.explore" ).text( chrome.i18n.getMessage( "explore" ) );
	$( ".breadcrumb .section.source-code" ).text( chrome.i18n.getMessage( "source_code" ) );
	
	$( ".row.about .sub.header.version" ).text( chrome.runtime.getManifest().version );
	
	$( ".row.about .header.contact span" ).text( chrome.i18n.getMessage( "contact" ) );	
	$( ".row.about .header.facebook span" ).text( chrome.i18n.getMessage( "official_page" ) );
	$( ".row.about .header.disclaimer span" ).text( chrome.i18n.getMessage( "disclaimer" ) );
	$( ".row.about .header.disclaimer .sub.header a" ).text( chrome.i18n.getMessage( "disclaimer_sub" ) );
	$( ".row.about .header.share span" ).text( chrome.i18n.getMessage( "share" ) );	
	
	$( "#about .row.about .checkbox.help.us label" ).text( chrome.i18n.getMessage( "anon_stats" ) );
	
	$( "label.title" ).text( chrome.i18n.getMessage( "title" ) );	
	$( "label.description" ).text( chrome.i18n.getMessage( "description" ) );
	$( "label[for='time-check']" ).text( chrome.i18n.getMessage( "check_every" ) );
	$( "label.time-5m" ).text( chrome.i18n.getMessage( "time_5m" ) );
	$( "label.time-15m" ).text( chrome.i18n.getMessage( "time_15m" ) );
	$( "label.time-30m" ).text( chrome.i18n.getMessage( "time_30m" ) );
	$( "label.time-1h" ).text( chrome.i18n.getMessage( "time_1h" ) );
	$( "label[for='level-check']" ).text( chrome.i18n.getMessage( "level_check" ) );
	$( "label.level-0" ).text( chrome.i18n.getMessage( "level_0" ) );
	$( "label.level-10" ).text( chrome.i18n.getMessage( "level_10" ) );
	$( "label.level-30" ).text( chrome.i18n.getMessage( "level_30" ) );
	$( "label.level-50" ).text( chrome.i18n.getMessage( "level_50" ) );	
	$( "label.ping.webhook" ).text( chrome.i18n.getMessage( "ping_webhook" ) );
	
	$( "p.webhook.p1" ).text( chrome.i18n.getMessage( "webhook_p1" ) );
	$( "p.webhook.p2" ).text( chrome.i18n.getMessage( "webhook_p2" ) );
	$( "p.webhook.p3" ).text( chrome.i18n.getMessage( "webhook_p3" ) );
	$( "p.webhook.p4" ).text( chrome.i18n.getMessage( "webhook_p4" ) );
	$( "p.webhook.p5" ).text( chrome.i18n.getMessage( "webhook_p5" ) );
	$( "p.webhook.p6" ).text( chrome.i18n.getMessage( "webhook_p6" ) );
	$( "p.webhook.p7" ).text( chrome.i18n.getMessage( "webhook_p7" ) );
	
	$( "#toreview .row.header h2 .content" ).text( chrome.i18n.getMessage( "problems" ) );
	$( "#towatch .row.header h2 .content" ).text( chrome.i18n.getMessage( "updates" ) );
	
} )( window.jQuery );













