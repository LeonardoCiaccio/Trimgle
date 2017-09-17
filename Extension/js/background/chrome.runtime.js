
( function( GA ){
    
	"use strict";
		
// --> Generate hard error in test ( temporanea )
	
	try{
		
		chrome.runtime.onInstalled.addListener( function( details ){
				
			if( details.reason == "update" ){
				
				$.Trimgle.settings( null, null, null, true );
				
			}
			
			GA( "Service", details.reason, chrome.runtime.getManifest().version );

		} );
		
	}catch( e ){}	
	
} )( window.GA || function(){} );

