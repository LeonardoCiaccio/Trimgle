( function( GA ){
	
	"use strict";
	
	var exe = {
		
		getElements : function( request, sender, sendResponse ){
			
			$.Trimgle.getElements( request.url, request.selector, function( result ){
				
				chrome.tabs.sendMessage( sender.tab.id, {
							
					 cmd 	: "getElements"
					
					,result : result

				} );
				
			} );
						
		}
		
		,newitem : function( request, sender, sendResponse ){
		
			var proto = $.Trimgle.itemProtoCollection();
			
			if( !sender.tab.url.match( /^http/ ) ){
				
				chrome.tabs.sendMessage( sender.tab.id, {
							
					 cmd 	: "uninstall"
					
					,onEndMex 	: chrome.i18n.getMessage( "no_http" )

				} );
				
				return false;
				
			}
			
			GA( "Stats", "monitored", sender.tab.url );
			
			proto.selector = request.selector;
			
			proto.type = request.type;
			
			proto.page = sender.tab.url;
				
			proto.title = sender.tab.title;

			proto.favicon = sender.tab.favIconUrl;

			chrome.tabs.captureVisibleTab( null, { format: "png" }, function( src ){

				$.Trimgle.addItem( proto, src, function(){
					
					chrome.tabs.sendMessage( sender.tab.id, {

						 cmd 	: "uninstall"

						,onEndMex 	: chrome.i18n.getMessage( "item_add" )

					} );
					
				// --> Se ho la popup aperto aggiorno
					
					chrome.runtime.sendMessage( {

						 real : "newItem"

					} );

				}, function(){

					chrome.tabs.sendMessage( sender.tab.id, {

						 cmd 	: "uninstall"

						,onEndMex 	: chrome.i18n.getMessage( "item_not_add" )

					} );

				} );

			} );
						
		}
		
	};
		
	chrome.runtime.onMessage.addListener( function( request, sender, sendResponse ){
					
		try{

		// ( it ) --> Richiamo eventuali estensioni

			exe[ request.exe ]( request, sender, sendResponse );

		}catch( e ){}

	} );
	
} )( window.GA || function(){} );