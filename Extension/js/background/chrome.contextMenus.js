

( function( GA ){
    
	"use strict";
				
	var id0 = chrome.contextMenus.create( {
		
			 title 	 : chrome.i18n.getMessage( "name" )
		
			,id		 : "main"
			
			,contexts : [ "all" ] 
			
	} );
	
	var id1 = chrome.contextMenus.create( { 
		
			 title		: chrome.i18n.getMessage( "new_link" )
			
			,contexts 	: [ "all" ]
			
			,parentId	: id0
			
			,onclick		: function( info, tab ){
				
			// --> Invio jQuery e jqPath, in fine il resto
				
				/*if( chrome.runtime.lastError ){
					
					alert( chrome.i18n.getMessage( "no_context" ) );
					
					return false;
					
				}*/
				
				chrome.tabs.executeScript( tab.id, { 

					allFrames 	: false,
					file 		: "lib/jquery.min.js"

				}, function(){
					
					if( chrome.runtime.lastError ){
						
						alert( chrome.i18n.getMessage( "no_context" ) );
						
						return false;
					
					}
				
					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "lib/jqPath.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );

					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "js/background/inject.newlink.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );
					
				} );
				
				GA( "Service", "menu", chrome.i18n.getMessage( "new_link" ) );
				
			}

	} );
	
	var id2 = chrome.contextMenus.create( { 
		
			 title		: chrome.i18n.getMessage( "new_link_collection" )
		
			,contexts 	: [ "all" ]
			
			,parentId	: id0
			
			,onclick		: function( info, tab ){
				
			// --> Invio jQuery e jqPath, in fine il resto
				
				chrome.tabs.executeScript( tab.id, { 

					allFrames 	: false,
					file 		: "lib/jquery.min.js"

				}, function(){
					
					if( chrome.runtime.lastError ){
						
						alert( chrome.i18n.getMessage( "no_context" ) );
						
						return false;
					
					}
				
					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "lib/jqPath.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );

					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "js/background/inject.newlink.collection.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );
					
				} );
				
				GA( "Service", "menu", chrome.i18n.getMessage( "new_link_collection" ) );
				
			}

	} );
	
	var ids1 = chrome.contextMenus.create( { 
		
			 type : "separator"
		
			,contexts 	: [ "all" ]
			
			,parentId	: id0
	
	} );
	
	var id3 = chrome.contextMenus.create( { 
		
			 title		: chrome.i18n.getMessage( "new_text" )
		
			,contexts 	: [ "all" ]
			
			,parentId	: id0
			
			,onclick		: function( info, tab ){
				
			// --> Invio jQuery e jqPath, in fine il resto
				
				chrome.tabs.executeScript( tab.id, { 

					allFrames 	: false,
					file 		: "lib/jquery.min.js"

				}, function(){
					
					if( chrome.runtime.lastError ){
						
						alert( chrome.i18n.getMessage( "no_context" ) );
						
						return false;
					
					}
				
					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "lib/jqPath.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );

					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "js/background/inject.newtext.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );
					
				} );
				
				GA( "Service", "menu", chrome.i18n.getMessage( "new_text" ) );
				
			}

	} );
	
	var id4 = chrome.contextMenus.create( { 
		
			 title		: chrome.i18n.getMessage( "new_text_collection" )
		
			,contexts 	: [ "all" ]
			
			,parentId	: id0
			
			,onclick		: function( info, tab ){
				
			// --> Invio jQuery e jqPath, in fine il resto
				
				chrome.tabs.executeScript( tab.id, { 

					allFrames 	: false,
					file 		: "lib/jquery.min.js"

				}, function(){
					
					if( chrome.runtime.lastError ){
						
						alert( chrome.i18n.getMessage( "no_context" ) );
						
						return false;
					
					}
				
					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "lib/jqPath.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );

					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "js/background/inject.newtext.collection.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );
					
				} );
				
				GA( "Service", "menu", chrome.i18n.getMessage( "new_text_collection" ) );
				
			}

	} );
	
	var ids2 = chrome.contextMenus.create( { 
		
			 type : "separator"
		
			,contexts 	: [ "all" ]
			
			,parentId	: id0
	
	} );
	
	var id5 = chrome.contextMenus.create( { 
		
			 title		: chrome.i18n.getMessage( "json" )
		
			,contexts 	: [ "all" ]
			
			,parentId	: id0
			
			,onclick		: function( info, tab ){
				
			// --> Invio jQuery e jqPath, in fine il resto
				
				chrome.tabs.executeScript( tab.id, { 

					allFrames 	: false,
					file 		: "lib/jquery.min.js"

				}, function(){
					
					if( chrome.runtime.lastError ){
						
						alert( chrome.i18n.getMessage( "no_context" ) );
						
						return false;
					
					}
				
					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "lib/jqPath.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );
				
					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "lib/j2h.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );

					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "js/background/inject.newjson.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );
					
				} );
				
				GA( "Service", "menu", chrome.i18n.getMessage( "json" ) );
				
			}

	} );
	
	var ids3 = chrome.contextMenus.create( { 
		
			 type : "separator"
		
			,contexts 	: [ "all" ]
			
			,parentId	: id0
	
	} );
	
	var id6 = chrome.contextMenus.create( { 
		
			 title		: chrome.i18n.getMessage( "expert" )
		
			,contexts 	: [ "all" ]
			
			,parentId	: id0
			
			,onclick		: function( info, tab ){
				
			// --> Invio jQuery e jqPath, in fine il resto
				
				chrome.tabs.executeScript( tab.id, { 

					allFrames 	: false,
					file 		: "lib/jquery.min.js"

				}, function(){
					
					if( chrome.runtime.lastError ){
						
						alert( chrome.i18n.getMessage( "no_context" ) );
						
						return false;
					
					}

					chrome.tabs.executeScript( tab.id, { 

						allFrames 	: false,
						file 		: "js/background/inject.newexpert.min.js"

					}, function(){

						// console.log( chrome.runtime.lastError );

					} );
					
				} );
				
				GA( "Service", "menu", chrome.i18n.getMessage( "expert" ) );
				
			}

	} );
	
	var id7 = chrome.contextMenus.create( { 
		
			 title		: chrome.i18n.getMessage( "cache" )
		
			,contexts 	: [ "all" ]
			
			,parentId	: id0
			
			,onclick		: function( info, tab ){
				
			// --> Invio jQuery e jqPath, in fine il resto
				
				chrome.tabs.executeScript( tab.id, { 

					allFrames 	: false,
					code 		: "var __signature=\"#trimgle\";document.location.href.indexOf(__signature)<0&&(document.location.href=document.location.href+__signature);alert(\"" + chrome.i18n.getMessage( "good_cache" ) + "\");"

				}, function(){
					
					if( chrome.runtime.lastError ){
						
						alert( chrome.i18n.getMessage( "no_context" ) );
						
						return false;
					
					}
					
				} );
				
				GA( "Service", "menu", chrome.i18n.getMessage( "cache" ) );
				
			}

	} );

		
} )( window.GA || function(){} );

