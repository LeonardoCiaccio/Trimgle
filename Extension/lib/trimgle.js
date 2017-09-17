/*

	VERSION : 1.0.0

	List error :
	
		1000 : not similar obj ( data to db )

*/



( function( $, L, j2h ){
	
	"use strict";
	
	if( !$ )throw new Error( "jQuery required" );
	
	if( !L )throw new Error( "LocalDB required" );
	
	if( !j2h )throw new Error( "j2h required" );
	
	var 
		dbDefault = "Timgle DB"
	
		,debuging = false
		
		,_lol = function( mex ){
			
			var mex = new Date().toLocaleString() + " : " + mex;
						
			if( debuging === true )console.log( mex );
			
		}
	
		,tables = {
			
			settings : "Settings"
			
			,elements : "Elements"
			
			,toReview : "To Review"
			
			,toWatch : "To Watch"
			
		}
		
		,period = {
			
			m1	: ( 1000 * 60 )
			
			,m5	: ( ( 1000 * 60 ) * 5 )
			
			,m15: ( ( 1000 * 60 ) * 15 )
			
			,m30: ( ( 1000 * 60 ) * 30 )		
			
			,h1	: ( ( 1000 * 60 ) * 60 )		
			
			,h6	: ( ( ( 1000 * 60 ) * 60 ) * 6 )		
			
			,h12	: ( ( ( 1000 * 60 ) * 60 ) * 12 )		
			
			,h24	: ( ( ( 1000 * 60 ) * 60 ) * 24 )
			
		}
	
		,protoSettings = { // --> Si auto aggiorna
			
			 "#" : null
			
			,notification : true
			
			,sendAnonInfo : true
			
			,lastNews : "https://www.facebook.com/Trimgle/"
			
			,oldNews : ""
			
		}
	
		,protoItemCollection = {

			"#"	:	null
			
			,title	: ""

			,page	: ""

			,description	: ""
			
			,type 	: 'html' // <-- html default, 'j' json
			
			,favicon : ""
			
			,selector	: ""
			
			,interval : "m30"

			,newest	: [] // <-- Lista di protoItemCollectionlist

			,oldest	: [] // <-- Lista di protoItemCollectionlist

			,pinglist	: [] // <-- Lista di indirizzi con marcatori per i ping dei dati
			
			,addeded : 0
			
			,pinged : 0

		}
	
		,protoItemCollectionlist = {
			
			 title	: ""

			,link	: ""

			,text	: ""

		}
	
		,db = new L( {

		// --> Potrebbe anche essere sessionStorage

			storage : localStorage

			,

		// --> Il nome del database

			name : dbDefault

			,

		// --> Questa funzione viene chiamata ogni volta che ci sono variazioni

			change: function( tablename, recordschanged, eventname, mytableobj ){
				
				/*if( eventname == "add" && ( tablename == tables.toReview || tablename == tables.toWatch ) ){
					
					_onPayAttention( recordschanged );
					
					_lol( "Aggiunti elementi da controllare : " + tablename );
				
				}*/
				
				if( tablename == tables.toReview ){
					
					_onReviewChange( eventname, mytableobj );
					
					_lol( "_onReviewChange : " + tablename );
				
				}else if( tablename == tables.toWatch ){
					
					_onWatchChange( eventname, mytableobj );
					
					_lol( "_onWatchChange : " + tablename );
				
				}else if( tablename == tables.elements && ( eventname == "remove" || eventname == "clear" ) ){
					
					$.each( recordschanged, function( index, item ){
						
						localStorage.removeItem( "screenshot:" + item.addeded );
						
						_lol( "Rimosso lo screenshot : " + item.addeded );
						
						db.query( tables.toReview, function( record ){
							
							return ( record.id == item.addeded );
							
						} ).then( function( filtered ){
							
							_lol( "Rimuovo toReview : " + filtered[ 0 ][ "#" ] );
							
							db.remove( tables.toReview, filtered[ 0 ][ "#" ] );
							
						} );
						
						db.query( tables.toWatch, function( record ){
							
							return ( record.id == item.addeded );
							
						} ).then( function( filtered ){
							
							_lol( "Rimuovo toWatch : " + filtered[ 0 ][ "#" ] );
							
							db.remove( tables.toWatch, filtered[ 0 ][ "#" ] );
							
						} );
						
					} );
					
				}
				
			}

		} )
	
		,listeners = [
			
			{
				interval : "m5"
				
				,time : period.m5
				
				,listener : null
				
			}
			
			,{
				interval : "m15"
				
				,time : period.m15
				
				,listener : null
				
			}
			
			,{
				interval : "m30"
				
				,time : period.m30
				
				,listener : null
				
			}
			
			,{
				interval : "h1"
				
				,time : period.h1
				
				,listener : null
				
			}
			
		]
	
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
	
		,_minifyHTML = function( htmlCode ){
			
			return htmlCode.replace(/>[\r\n\t ]+</g, "><");
			
		}
	
		,_compressText = function( text ){
			
			return text.replace(/[\r\n\t ]/g, "");
			
		}
	
		,_cleanLink = function( link ){
			
			if( !link || link == "" )return link;
			
			return link
					.replace( /(\?trimgle\=\d{0,100}&)/gi, "?" )
					.replace( /(\?trimgle\=\d{0,100}$)/gi, "" );
			
		}
	
		,_compressElements = function( $elements ){
			
			var compressed = [];
			
			$.each( $elements, function(){
				
				var tagname = $( this ).prop( "tagName" ) || "";
								
				if( tagname && tagname != "" ){
					
					var proto = $.extend( {}, protoItemCollectionlist );
					
					if( tagname.toLowerCase() == "a" ){
						
						proto.title = $( this ).text() || "";
						proto.title = proto.title.trim();
						
						proto.link = $( this )[ 0 ].href || "";
						proto.link = _cleanLink( proto.link.trim() );
						
					}else{
						
						proto.text = $( this ).text() || "";						
						proto.text = proto.text.trim();
						
					}
						
					if( ( proto.title != "" && proto.link != "" ) || proto.text != "" )compressed.push( proto );
					
				}
				
			} );
			
			return compressed;
			
		}
	
		,_filterNewest = function( oldest, newest ){
			
			var 
				comparer = function( otherArray ){
					
				 	return function( current ){
					
						return otherArray.filter( function( other ){
						  
					  		return ( 
									   other.link.localeCompare( current.link ) == 0
									&& other.title.localeCompare( current.title ) == 0
									&& other.text.localeCompare( current.text ) == 0 
							); 
					
					  	} ).length == 0;
				  
				  	}
				
				}
			;

			var 
				 onlyOldest = oldest.filter( comparer( newest ) )
			
				,onlyNewest = newest.filter( comparer( oldest ) )

				,filtered = onlyOldest.concat( onlyNewest ) || []
			;
			
			return filtered;
			
		}
	
		,_onPayAttention = function(){
			
			_lol( "Eseguo il PayAttention vuoto" );
			
		}
	
		,_onReviewChange = function(){}
	
		,_onWatchChange = function(){}
	
		,_toReview = function( item, lasterror, status ){
			
			lasterror = lasterror || "";
			
			status = status || 0;
			
			var now = Date.now();
			
			db.add( tables.toReview, {
				
				 id 	 	: item.addeded 
				
				,lasterror 	: lasterror 
				
				,status		: status
				
				,when 	 	: now 
				
				,title 	 	: item.title 
				
				,page 	 	: item.page
				
				,desc 	 	: item.description
				
				,favicon	: item.favicon 
			
			} ).then( function(){

			// --> Probabilmente segnalo la presenza di nuovi aggiornamenti

				_lol( item.addeded + " inserito in review" );

			}, function( reason ){

			// --> Probabilmente già presente

				_lol( item.addeded + ", non riesco ad inserirlo in review : " + reason );

			} );
			
		}
	
		,_toWatch = function( item, filtered ){
			
			if( !filtered )return false;
			
			if( !$.isArray( filtered ) )filtered = [ filtered ];
			
			var now = Date.now();
			
			db.add( tables.toWatch, { 
				
				 id 	 : item.addeded
				
				,newdata : filtered
				
				,when 	 : now 
				
				,title 	 : item.title 
				
				,page 	 : item.page
				
				,desc 	 : item.description
				
				,favicon : item.favicon
			
			} ).then( function(){

			// --> Probabilmente segnalo la presenza di nuovi aggiornamenti

				_lol( item.addeded + " inserito in watchlist" );

			}, function( reason ){

			// --> Probabilmente già presente

				_lol( item.addeded + ", non riesco ad inserirlo in watchlist : " + reason );

			} );
			
		}
		
		,_ping = function( url, callback ){
			
			_lol( "Chiamata al _ping() : " + url );
			
			if( typeof callback != "function" )callback = function(){};
			
			var xhr = _getXHR();

			url = _noCache( url )
			
			if( !url ){
				
				callback();
				
				_lol( "Il link ha problemi : " + url );
				
				return false;
				
			}
			
			xhr.responseType = "document";

			xhr.overrideMimeType( "text/html" );

			xhr.open( "GET", url, true );

			xhr.onload = function(){

				_lol( "ping ... : " + url );
				
			// --> Aspetto che carica tutta la pagina
				
				if( xhr.readyState === xhr.DONE ){
					
					callback( xhr );
					
				}
			
			}
			
			xhr.send( null );
			
		}
	
		,_toPing = function( pinglist, filtered ){
			
			_lol( "Chiamata al _toPing()" );
			
			$.each( pinglist, function( i1, url ){
				
				$.each( filtered, function( i2, item ){
				
					if( ( item.link.length > 0 && item.title.length > 0 ) || item.text.length > 0 ){
						
						var myurl = url
									 .replace( /\{\%l\}/g, encodeURIComponent( item.link ) )
									 .replace( /\{\%t\}/g, encodeURIComponent( item.title ) )
									 .replace( /\{\%p\}/g, encodeURIComponent( item.text ) )
									 .trim();
						
						setTimeout( function(){
							
							if( myurl && myurl != "" )_ping( myurl, function(){
												
								_lol( "ping ok : " + myurl );

							} );
							
						} ,1000);
						
					}else{
						
						_lol( "Strano, ci sono elementi inconcruenti, vai in debug approfondito, grave !" );
						
					}
				
				} );
				
			} );
			
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
	
		,_elementJob = function( item, goWatch, onUpdated, onError, onEndSequence ){ 
			
			goWatch = goWatch || false;
			
			if( typeof onUpdated != "function" )onUpdated = function(){};
			if( typeof onError != "function" )onError = function(){};
			if( typeof onEndSequence != "function" )onEndSequence = function(){};
			
			var 
				xhr = _getXHR()

				,url = _noCache( item.page )
			;
			
			if( !url ){
				
				onError( -2 );
				
				onEndSequence();
				
				_lol( "Il link ha problemi : " + url );
				
				_toReview( item, chrome.i18n.getMessage( "no_link" ) + " " + url );
				
				return false;
				
			}
		
		// --> Dalla 1.0.0.4 aggiunto il type
			
			item.type = item.type || "html";
			
			xhr.responseType = "document";

			xhr.overrideMimeType( "text/html" );

			xhr.open( "GET", url, true);

			xhr.onload = function(){

				_lol( "Controllo : " + item.addeded );
				
			// --> Aspetto che carica tutta la pagina
				
				if( xhr.readyState === xhr.DONE ){
					
					_lol( item.addeded + " ha appena finito di caricare il documento" );
					
					item.pinged = Date.now();
					
				// --> Devo avere qualcosa altrimenti non faccio nulla	
				
					var 						
						 $elements
					
						,loadedDOM = xhr.responseXML
					;
						
					if( loadedDOM instanceof HTMLDocument ){

						if( item.type === "json" ){
							
							var _c = j2h( $( "body", loadedDOM ).text() );
							
							if( _c )$( "body", loadedDOM ).append( _c );
							
						}
						
						$( "script, iframe", loadedDOM ).remove();

						$elements = $( item.selector, loadedDOM );

					}
					
					if( !$elements || $elements.length < 1 ){
						
						_lol( item.addeded + " non ho trovato i marcatori, metto in review, esco !" );
				
						onEndSequence();
						
						_toReview( item, chrome.i18n.getMessage( "no_signature" ), xhr.status );
						
						onError( -1 );
						
						return false;
						
					}
					
				// --> Inizio ad aggiornare l'item
					
					item.oldest = item.newest;

					item.newest = _compressElements( $elements );				

					if( item.newest.length < 1 ){
						
						_lol( item.addeded + " ho i marcatori ma non i risultati, metto in review, esco !" );
						
						onError( -3 );
				
						onEndSequence();
						
						_toReview( item, chrome.i18n.getMessage( "no_results" ), xhr.status );
						
						return false;
						
					}
					
					var filtered = _filterNewest( item.oldest, item.newest );
					
				// --> Aggiorno il record

					db.update( tables.elements, item ).then( function(){
						
						_lol( item.addeded + " aggiornato" );
						
						if( item.oldest.length > 0 && item.newest.length > 0 && filtered.length > 0 ){

						// --> Invio agli aggiornamenti

							_lol( item.addeded + " ci sono cambiamenti" );
							
							if( ! ( !goWatch ) ){
								
								_toWatch( item, filtered );
							
								_lol( item.addeded + " aggiunto a toWatch" );
								
							}else{
								
								_lol( item.addeded + " non aggiunto a toWatch" );
								
							}
							
						// --> Eseguo i ping
							
							_toPing( item.pinglist, filtered );

							onUpdated( item );
				
							onEndSequence();
							
						}else{

							onUpdated( item );
				
							onEndSequence();
							
							_lol( item.addeded + " non ci sono cambiamenti" );

						}

					}, function( reason ){
							
					// --> Dovrei inviare al log errori	
						
						onError( -4 );
				
						onEndSequence();

						_toReview( item, chrome.i18n.getMessage( "no_update" ) );
						
						_lol( item.addeded + ", non riesco ad aggiornarlo : " + reason );

					} );

				}

			};

			xhr.onerror = function(){

				_lol( item.addeded + ", errori di connessione !" );
				
				onError( -5 );
				
				onEndSequence();
				
				_toReview( item, chrome.i18n.getMessage( "connection_error" ), xhr.status );

			}

			xhr.send( null );
			
		}
	
		,_isSimilarKey = function( newobj, objproto ){
	
			if( typeof newobj != "object" || typeof objproto != "object" )return false;

			var isequal = true;

			$.each( newobj, function( i, val ){

				if( !( i in objproto ) ){

					isequal = false;

					return false;

				}

			} );

			return isequal;

		}
	
		,_cleanSets = function( newobj, objproto ){
	
			if( typeof newobj != "object" || typeof objproto != "object" )return null;

			var cleaned = {};

			$.each( newobj, function( i, val ){

				if( i in objproto ){
					
					cleaned[ i ] = newobj[ i ];
					
				}

			} );

			return $.extend( {}, objproto, cleaned );

		}
	
		,_stopListeners = function( restart ){
			
			
			$.each( listeners, function( index, listener ){
					
				_lol( "Fermo il listener " + listener.interval );
				
				clearInterval( listener.listener );
				
				if( restart === true ){
					
					_lol( "Avvio il listener " + listener.interval );
					
					var workjob = function(){
															
						_lol( "Eseguo il listener " + listener.interval );
						
					// --> Devo farmi un giro per il database e avviare i job
						
						var 
							thitable = db.getTable( tables.elements ) || []
						;
						
						$.each( thitable, function( index, item ){
														
							if( listener.interval === item.interval ){
								
								_lol( "Eseguo il _elementJob per " + item.addeded );
								
								setTimeout( function(){
									
									_elementJob( item, true, null, null, function(){
																				
										if( index + 1 == thitable.length )_onPayAttention();
																			
									} );
									
								},1000 );
							
							}
							
						} );
												
					};
					
					listener.listener = setInterval( workjob, listener.time );
					
				// --> Eseguo appena viene avviata la routin
					
					workjob();
					
				}
					
			} );
			
		}
	
		,_getElements = function( url, selector, callback ){
			
			if( typeof callback != "function" )callback = function(){};
			
			_lol( "Prelevo le informazioni ..." );
			_lol( url );
			_lol( selector );
			
			_ping( url, function( xhr ){
				
				var 
					loadedDOM = xhr.responseXML

					,$elements
				;

				if( loadedDOM instanceof HTMLDocument ){

					$elements = $( loadedDOM ).find( selector );

				}
				
				if( !$elements || $elements.length < 1 ){
					
					_lol( "Ping ok, ma non ho elementi" );
					
					return callback("www");

				}
				
				var result = _compressElements( $elements ) || [];
					
				_lol( "Ping ok" );
				
				return callback( result );
				
			} );
			
		}
	;
	
// --> La classe TRIMGLE
	
	var thisclass = {
					
			debug : function( flag ){
				
				debuging = flag;				
				
			}
		
			,settings : function( newsets, resolve, reject, merge ){
				
				resolve = resolve || function(){};
				reject	= reject  || function(){};
				
				if( !( !newsets ) ){
					
				// --> Setter			
					
					/*if( !_isSimilarKey( newsets, protoSettings ) ){

						_lol( "Non posso aggiornare i sets, non è adeguato" );

						reject( 1000 );
						
						return null;

					}*/
					
					var cSets = _cleanSets( newsets, protoSettings );
					
					if( !cSets ){

						_lol( "Non posso aggiornare i sets, non è adeguato" );

						reject( 1000 );
						
						return null;

					}
					
					if( cSets[ "#" ] === null ){
						
						db.add( tables.settings, cSets ).then( function(){

							_lol( "Settaggi aggiunti" );
							
							resolve();

						}, function(){

							_lol( "Non riesco a salvare i settaggi" );

							reject();

						} );
						
					}else{
						
						db.update( tables.settings, cSets ).then( function(v){

							_lol( "Settaggi aggiornati" );
							
							resolve();

						}, function(){

							_lol( "Non riesco a salvare i settaggi" );

							reject();

						} );
						
					}
					
				}else if( !merge ){
					
				// --> Getter
					
					var sets = db.getTable( tables.settings ) || [];
					
					if( sets.length < 1 )return $.extend( {}, protoSettings );
					
					return sets[ 0 ];
					
				}else if( merge === true ){
					
				// --> onInstall extension
					
					var 
						 sets = db.getTable( tables.settings ) || []
						
						,merged = ( sets.length < 1 ) 
									? $.extend( {}, protoSettings ) 
									: $.extend( {}, protoSettings, sets[ 0 ] )
					
						,self	= this
					;
					
					_lol( "Rimuovo i settaggi vecchi" );
					
					db.remove( tables.settings, [ 0 ] ).then( function(){
						
						_lol( "Chiamo l'aggiornamento dei settaggi, merge" );

						merged[ "#" ] = null;
						
						self.settings( merged );
						
					}, function(){
						
						_lol( "Non riesco a rimuovere i settaggi vecchi" );
						
					} );
					
				}
				
			}
		
			,itemProtoCollection 	: function(){
				
				var clone = $.extend( {}, protoItemCollection );
				
				return clone;
				
			}
		
			,onReviewChange : function( callback ){
				
				if( typeof callback === "function" )_onReviewChange = function( eventname, mytableobj ){
					
					_lol( "Eseguo onReviewChange custom" );
					
					callback( eventname, mytableobj );
					
				};
				
			}
		
			,onWatchChange : function( callback ){
				
				if( typeof callback === "function" )_onWatchChange = function( eventname, mytableobj ){
					
					_lol( "Eseguo onWatchChange custom" );
					
					callback( eventname, mytableobj );
					
				};
				
			}
		
			,onPayAttention : function( callback ){
				
				if( typeof callback === "function" )_onPayAttention = function(){
					
					_lol( "Eseguo il payAttention custom" );
					
					callback( db.getTable( tables.toReview ), db.getTable( tables.toWatch ) );
					
				};
				
			}
		
			,startListeners : function(){
								
				_stopListeners( true );				
				
			}
		
			,stopListeners : function(){
				
				_stopListeners();				
				
			}
		
			,getAllItems : function( callback ){
				
				return db.getTable( tables.elements );
				
			}
		
			,getAllReviews : function( callback ){
				
				return db.getTable( tables.toReview );
				
			}
		
			,getAllWatchs : function( callback ){
				
				return db.getTable( tables.toWatch );
				
			}
		
			,getItem : function( addeded, resolve, reject ){
				
				db.query( tables.elements, function( item ){
										
					return ( item.addeded.toString().localeCompare( addeded ) == 0 );
					
				} ).then( resolve, reject );
				
			}
		
			,resetReview : function( resolve, reject ){
				
				resolve = resolve || function(){};
				reject	= reject  || function(){};
				
				db.clear( tables.toReview ).then( resolve, reject );
				
			}
		
			,resetWatch : function( resolve, reject ){
				
				resolve = resolve || function(){};
				reject	= reject  || function(){};
				
				db.clear( tables.toWatch ).then( resolve, reject );
				
			}
		
		// --> Aggiunge una nuova pagina da controllare
			
			,addItem	: function( item, screenshot, resolve, reject ){
												
				screenshot = screenshot || "";
				
				resolve = resolve || function(){};
				reject	= reject  || function(){};
				
				if( !_isSimilarKey( item, protoItemCollection ) ){
				
					_lol( "Non posso aggiungere il nuovo item, non è adeguato : " + item.page );
					
					return reject( 1000 );
				
				}
				
				item.addeded = Date.now();
				
				_ping( item.favicon, function( xhr ){
					
					if( !xhr || xhr.status != 200 ){
						
						item.favicon = "img/unknown.png"
						
					}
				
					db.add( tables.elements, item ).then( function(){

						_lol( "Aggiunto il nuovo item " + item.addeded );

					// --> Aggiungo lo screenshot

						localStorage[ "screenshot:" + item.addeded ] = screenshot;

					// --> Prima chiamata

						_elementJob( item );

						resolve();

					}, function(){

						_lol( "Non riesco ad aggiungere " + item.addeded + " nel database" );

						reject();

					} );				
					
				} )
				
			} // <-- add
		
		// --> Aggiorna una pagina
		
			,updateItem	: function( item, resolve, reject ){
								
				resolve = resolve || function(){};
				reject	= reject  || function(){};
				
				if( !_isSimilarKey( item, protoItemCollection ) ){
				
					_lol( "Non posso aggiornare l'item, non è adeguato : " + item.page );
					
					return reject( 1000 );
				
				}
				
				db.update( tables.elements, item ).then( function(){
					
					_lol( "Aggiornato il nuovo item " + item.addeded );
					
					resolve();
					
				}, function(){
					
					_lol( "Non riesco ad aggiornare " + item.addeded + " nel database" );
					
					reject();
					
				} );
				
			}
			
		// --> Rimuove una pagina dal database
		
			,removeItem	: function( id, resolve, reject ){
								
				resolve = resolve || function(){};
				reject	= reject  || function(){};
				
				db.remove( tables.elements, id ).then( function(){
					
					_lol( "Item con id  " + id + " rimosso dal database");
					
					resolve();
					
				}, function(){
					
					_lol( "Non riesco a rimuovere l'item con id " + id + " dal database" );
					
					reject();
					
				} );
				
			} // <-- remove	
		
		// --> Restituisce un array con elementi scorporati
		
			,getElements : function( url, selector, callback ){
				
				_lol( "Ricevo la richiesta degli elementi" );
				
				_getElements( url, selector, callback );
				
			}
		
			,updateResults : function( item, onUpdated, onError ){
				
				_lol( "Ricevo la richiesta per aggiornare i risultati" );
				
				_elementJob( item, false, onUpdated, onError );
				
			}
		
		}
	;
	
// --> Estendiamo jQuery con la nuova classe
	
	$.extend( $, { Trimgle : thisclass } );
	
} )( window.jQuery, window.localdb, window.j2h );







