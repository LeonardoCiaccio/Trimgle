
( function( $, j2h ){
	
	"use strict";
	
	if( !$ || !$.jqPath )throw new Error( "Require jQuery.jqPath" );
	
	if( !j2h )throw new Error( "Require j2h.js" );
	
	var 
		 mouseOver  = "-webkit-box-shadow:inset 0px 0px 0px 3px #f00!important;-moz-box-shadow:inset 0px 0px 0px 3px #f00!important;box-shadow:inset 0px 0px 0px 3px #f00!important;"
	
		,dimmer = "<div style='position:fixed!important;background:transparent!important;width:100%!important;height:100%!important;top:0px!important;left:0px!important;z-index:999999999999999!important;'></div>"
	
		,preload = "<div style='position:absolute!important;top:50%!important;margin-top:-50px!important;padding:20px!important;overflow:hidden!important;width:100%!important;height:100px!important;display: table!important;background:#cf2127;'><p style='color: white!important;display: table-cell!important;text-align:center!important;vertical-align: middle!important;font-family: verdana!important;font-weight: bold!important;font-size: 24px!important;text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.55)!important;'>{%t}</p></div>"
	
		,_noCache = function( link ){
			
			if( !link )return link;
			
			if( link.indexOf( "#trimgle" ) > -1 )return link.replace( /\#trimgle/gi, "" );
			
			if( link.indexOf( "?" ) > -1 ){
				
				return link.replace( "?", "?trimgle=" + Date.now() + "&" );
				
			}else if( link.indexOf( "#" ) > -1 ){
				
				return link.replace( "#", "?trimgle=" + Date.now() + "#" );
				
			}
			
			return link + "?trimgle=" + Date.now();
			
		}
	
		,_getXHR = function(){
                
			try {

				return new XMLHttpRequest();

			}catch( e ){}

			try {

				return new ActiveXObject( "Msxml3.XMLHTTP" );

			}catch( e ){}

			try {

				return new ActiveXObject( "Msxml2.XMLHTTP.6.0" );

			}catch( e ){}

			try {

				return new ActiveXObject( "Msxml2.XMLHTTP.3.0" );

			}catch( e ){}

			try {

				return new ActiveXObject( "Msxml2.XMLHTTP" );

			}catch( e ){}

			try {

				return new ActiveXObject( "Microsoft.XMLHTTP" );

			}catch( e ){}

			return null;

		}
		
		,_ping = function( url, callback ){
			
			if( typeof callback != "function" )callback = function(){};
			
			var xhr = _getXHR();

			url = _noCache( url )
			
			if( !url ){
				
				callback();
				
				return false;
				
			}
			
			xhr.responseType = "json";

			xhr.overrideMimeType( "text/json" );

			xhr.open( "GET", url, true );

			xhr.onload = function(){
				
			// --> Aspetto che carica tutta la pagina
				
				if( xhr.readyState === xhr.DONE ){
					
					callback( xhr );
					
				}
			
			}
			
			xhr.send( null );
			
		}
	
		,_appendEvents = function(){
		
			alert( chrome.i18n.getMessage( "info_json" ) );
			
			$( "body" ).attr( "trimgle","json" );
			
		// --> Elimino eventuali click

			$( "*" ).attr( "onclick", "return false;" );

		// --> Nascondo gli iframe

			$( "iframe" ).hide();

		// --> Appendo l'evento a tutti gli elementi

			$( "li" ).on( "mouseover", function( ev ){

				var _jqPath = $.jqPath.generic( $( this ), true, false );
				
				$( _jqPath ).attr( "style", function( index, value ){
					
					return ( !value ) ? mouseOver : mouseOver + value;
					
				} );

				ev.stopPropagation();

			} ).on( "mouseout", function( ev ){

				$( "[style*='" + mouseOver + "']" ).attr( "style", function( index, value ){
					
					if( !value )return false;
					
					return value.replace( new RegExp( mouseOver, "gi" ) ,"" );
					
				} );

			} ).on( "click", function( ev ){

				var _jqPath = $.jqPath.generic( $( this ), true, false );

				$( "body" ).append( dimmer );

				setTimeout( function(){

					chrome.runtime.sendMessage( {

						 exe : "newitem"

						,selector : _jqPath
						
						,type : "json"

					} );

				} ,300 );

				ev.stopPropagation();

				return false;

			} );
			
		}
	
		,_check = function(){
			
			if( $( "body" ).attr( "trimgle" ) ){
			
				alert( chrome.i18n.getMessage( "no_exe" ) );
					
				document.location.reload();
				
				return false;
					
			}
			
			return true;
			
		}
	
		,_escNotGood = function(){
			
			alert( chrome.i18n.getMessage( "not_good" ) );
			
			document.location.reload();
					
			return false;
			
		}
	
		,_haveBodyOnPing = function(){
						
			$( "body" ).html( preload.replace(/\{\%t\}/gi, chrome.i18n.getMessage( "load_this_content" ) ) );
			
			setTimeout( function(){
				
				_ping( document.location.href, function( xhr ){
				
					if( !xhr || !xhr.response )return _escNotGood();

					var _c = j2h( JSON.stringify( xhr.response ) );
					
					if( !_c )return _escNotGood();
					
					$( "body" ).html( "" ).append( _c );

					return _appendEvents();

				} );
				
			}, 1000 );
			
		}
	;
	
	if( _check() === true )_haveBodyOnPing();
		
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
	
} )( window.jQuery, window.j2h );