/*
	
	$.jqPath()
	
		Una piccola ma potente estensione jQuery per ottenere il percorso assouto di un elemento
		
	FUNZIONI
	
		generic() restituisce il percorso assoluto generico html > body > div > div> ...
		
		unique() restituisce il percorso univoco html > body > div > :nth-child(1) > :nth-child(7) > ...
	
	PARAMETRI 
	
		target <string> <required> 
			selettore jQuery
		
		tipized <boolean> <optional [false] >
			se true, partendo dalla fine trova e inserisce la classe come selettore solo al primo che incontra
		
		shortner <boolean> <optional [false] >
			se true, partendo dalla fine trova e si ferma al primo "id" che incontra anziche partire da "html >"
			
*/




( function( $ ){
	
	"use strict";
	
	if( !$ )throw new Error( "jqPath require jQuery !" );
	
	var		
		_fromIndex = function( $ele ){
	
		// --> Passando un oggetto jQuery restituisce il selettore univoco da un indice o generico se è l'unico
				
			var tagname = $ele.prop( "tagName" ) || "";
			
			if( !tagname || tagname.length < 1 )return "";
			
			tagname = tagname.toLowerCase();
			
			if( tagname == "html" || tagname == "body" || $ele.parent().children().length == 1 )
				return tagname;

			var index = $ele.parent().children().index( $ele );

			return ( ":nth-child(" + ( index + 1 ) + ")" );

		} // <-- _identity
	
		,_fromID = function( $ele ){
			
		// --> Restiruisce un elemento da ID, #myid
			
			var xxid = $ele.attr( "id" ) || "";
			
			if( !xxid || xxid.length < 1 )return "";
			
			return ( "#" + xxid.trim() );
			
		} // <-- _fromID
	
		,_fromClass = function( $ele ){
			
		// --> Restiruisce un elemento tipizzato, div.myclass
			
			var tagname = $ele.prop( "tagName" ) || "";
			
			if( !tagname || tagname.length < 1 )return "";
			
			tagname = tagname.toLowerCase();
			
			var claxx = $ele.attr( "class" ) || "";
			
			if( !claxx || claxx.length < 1 )return "";
				
			claxx = claxx.trim().split( /\s+/ );
				
			if( claxx.length > 0 )
				return ( tagname + "." + claxx.join( "." ) );//return ( tagname + "." + claxx[ claxx.length - 1 ] );
				
			return "";
			
		} // <-- _fromClass
		
		,_jqPathGeneric = function( $ele, tipized, shortner, path ){
			
			path = path || ""
	
			if( !$ele || $ele.length != 1 )return path;
			
		// --> Iniziamo con il definire il processo
			
			var 
				_next = function(){
					
					try{
	
						return _jqPathGeneric( $ele.parent(), tipized, shortner, path );

					}catch( e ){
	
						return path;

					}
					
				}
			
				,myselector = $ele.prop( "tagName" ) || ""
			
				,tmp
			;
			
			if( myselector && myselector.length > 0 )
				myselector = myselector.toLowerCase();
			
			if( shortner === true ){
		
				tmp = _fromID( $ele );
				
				if( tmp && tmp.length > 0 ){
					
					path = ( path && path.length > 0 ) ? tmp + " > " + path : tmp;
					
					return path;
					
				}
				
			}
			
			if( tipized === true ){
		
				tmp = _fromClass( $ele );
				
				if( tmp && tmp.length > 0 ){
					
					myselector = tmp;
				
					tipized = false;
					
				}				
				
			}
			
			if( myselector && myselector.length > 0 )
				path = ( path && path.length > 0 ) ? myselector + " > " + path : myselector;
				
			return _next();
			
		} // <-- _jqPathGeneric
		
		,_jqPathUnique = function( $ele, tipized, shortner, path ){
			
			path = path || ""
	
			if( !$ele || $ele.length != 1 )return path;
			
		// --> Iniziamo con il definire il processo
			
			var 
				_next = function(){
					
					try{
	
						return _jqPathUnique( $ele.parent(), tipized, shortner, path );

					}catch( e ){
	
						return path;

					}
					
				}
			
				,myselector = _fromIndex( $ele ) || ""
			
				,tmp
			;
			
			if( myselector && myselector.length > 0 )
				myselector = myselector.toLowerCase();
			
			if( shortner === true ){
		
				tmp = _fromID( $ele );
				
				if( tmp && tmp.length > 0 ){
					
					path = ( path && path.length > 0 ) ? tmp + " > " + path : tmp;
					
					return path;
					
				}
				
			}
			
			if( tipized === true ){
		
				tmp = _fromClass( $ele );
				
				if( tmp && tmp.length > 0 ){
					
					myselector = tmp;
				
					tipized = false;
					
				}				
				
			}
			
			if( myselector && myselector.length > 0 )
				path = ( path && path.length > 0 ) ? myselector + " > " + path : myselector;
				
			return _next();
			
		} // <-- _jqPathUnique
	;
	
	$.extend( true, $, {
		
		jqPath : {
			
		// --> html > body > div > .... se tipizzato html > body > div > a.myclass
			
			generic : function( $target, tipized, shortner ){
				
				var 
					collection = []
				;
			
				$target.each( function(){

					var _jq = _jqPathGeneric( $( this ), tipized, shortner );
					
					if( _jq && _jq.length > 0 )
						collection.push( _jq );

				} );

				return collection.join( "," );
				
			} // <-- generic
			
		// --> html > body > div > :nth-child(1) > .... se tipizzato html > body > div.myclass > :nth-child(1)
			
			,unique : function( $target, tipized, shortner ){
				
				var 
					collection = []
				;
			
				$target.each( function(){

					var _jq = _jqPathUnique( $( this ), tipized, shortner );
					
					if( _jq && _jq.length > 0 )
						collection.push( _jq );

				} );

				return collection.join( "," );
				
			} 
			
		}
		
	} );
	
} )( window.jQuery );


