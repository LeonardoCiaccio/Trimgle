( function( GA ){
    
	"use strict";

	chrome.browserAction.setBadgeBackgroundColor( {

		color : "#000000"

	} );	
	
	$.Trimgle.onReviewChange( function( eventname, tableReview ){
		
		if( eventname == "add" ){
			
			chrome.runtime.sendMessage( {

				 real : "newReview"

			} );
			
			_noticeReviews();
			
		}
		
		if( tableReview.length > 0 )chrome.browserAction.setIcon( { path : "img/icon.error.32.png" } );
		
	} );	
	
	$.Trimgle.onWatchChange( function( eventname, tableWatch ){
		
		if( eventname == "add" ){
			
			chrome.runtime.sendMessage( {

				 real : "newWatch"

			} );
			
		}
				
		chrome.browserAction.setBadgeText( {

			text : ( tableWatch.length > 0 ) ? tableWatch.length + "" : ""

		} );
		
	} );
	
	$.Trimgle.onPayAttention( function( tableReview, tableWatch ){
		
		if( tableReview.length > 0 ){
			
			_noticeReviews();
			
		}
		
		if( tableWatch.length > 0 ){
			
			_noticeNews();
			
		}
		
		chrome.browserAction.setBadgeText( {

			text : ( tableWatch.length > 0 ) ? tableWatch.length + "" : ""

		} );
		
	} );
	
	$.Trimgle.startListeners();
	
	GA( "Service", "new session", chrome.runtime.getManifest().version );

} )( window.GA || function(){} );