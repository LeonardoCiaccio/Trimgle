
( function( GA ){
    
	"use strict";
		
	chrome.browserAction.onClicked.addListener( function( tab ){
					
		GA( "Service", "run", "icon bar" );
		
	} );
	
} )( window.GA || function(){} );

