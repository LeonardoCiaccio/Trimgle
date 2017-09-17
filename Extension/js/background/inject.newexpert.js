
( function( $ ){
	
	"use strict";
	
	if( !$ )throw new Error("Require jQuery");
	
	var _selector = prompt( chrome.i18n.getMessage( "expert_prompt" ) );
	
	if( _selector )_selector = _selector.trim();
	
	if( _selector && _selector.length > 0 ){
			
		if( $( _selector ).length > 0 ){
			
			chrome.runtime.sendMessage( {

				 exe : "newitem"

				,selector : _selector

				,type : "html"

			} );

		}else{

			alert( chrome.i18n.getMessage( "no_selector" ) );
			
			document.location.reload();
		
		}
		
	}else{
		
		document.location.reload();
		
	}
	
	var cmd = {
		
		"getElements" : function( request, sender, sendResponse ){
			
			// console.log( request.result );
			
		}
		
		,
		
		"uninstall" : function( request, sender, sendResponse ){
						
			alert( request.onEndMex );
			
			document.location.reload();
			
		}
		
	};
	
	chrome.runtime.onMessage.addListener( function( request, sender, sendResponse ){
		
		try{
						
		// ( it ) --> Richiamo eventuali estensioni			
			
			cmd[ request.cmd ]( request, sender, sendResponse );

		}catch( e ){}
		
	} );
	
} )( window.jQuery );