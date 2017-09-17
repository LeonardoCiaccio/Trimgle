/* 

	ATTENZIONE PER LA COMPRESSIONE USA https://jscompress.com/

	Nome db + sign + nome tabella = "Negozio-Clienti" ; "Negozio-"
	
	CODICI DI ERRORE : 
	
		1 : Si sta aggiungendo un valore che deve essere univoco e non lo è
		2 : Si sta tentando di aggiornare un record senza id '#' o con univoco errato		
		3 : Durante la rimozione alcuni records non sono stati trovati
		4 : Si sta muovendo un elemento verso un indice inesistente
		5 : Non si riesce a trovare l'indice del record da muovere
		6 : Si vuole spostare un record sullo stesso indice reale
		
		100 : Errore di decrittazzione mentre si preleva il db
		101 : Errore di crittazzione mentre si salva il db

*/

( function(){
	
	"use strict";
	
/// --> Global, opzioni e strumenti di classe

	var sign = ":"
	
	,dev = {
		
		version : "1.0.1.1"
		
		,
		
		author  : "Leonardo Ciaccio"
		
		,
		
		contact : "leonardo.ciaccio@gmail.com"
		
		,
		
		license : "MIT" 
		
		,
		
		credits : [
			
			"code.google.com/p/crypto-js"
			
			,
			
			"https://github.com/calvinmetcalf/lie"
			
		]
		
	}	
	
	,tools = { // --> tools
		
	// --> Incapsula un processo di cifratura

		encrypt : function( self, decrypted, mypass ){

			if( !mypass )mypass = self.password;
			if( !mypass )return decrypted;

			return CryptoJS.AES.encrypt( decrypted, mypass );

		}

		,
		
	// --> Incapsula un processo di decifratura

		decrypt : function( self, encrypted, mypass ){

			if( !mypass )mypass = self.password;
			if( !mypass )return encrypted;

			return CryptoJS.AES.decrypt( encrypted, mypass ).toString( CryptoJS.enc.Utf8 );

		}
 
		,
		
	// --> Genero un nuovo ID
		
		getNextID : function( self, tablename ){

			var mytable = tools.getDBtable( self, tablename );

			if( !mytable )return null;

			return ( mytable.length > 0 ) 
				   ? mytable.sort( function( a, b ){

						return ( b[ "#" ] - a[ "#" ] );

				   } )[ 0 ][ "#" ] + 1 
				   : 0 ;

		}
		
 		,
 
	// --> Controlla se una stringa può essere un oggetto JSON, in sintesi controlla se è coerente/cryptato
		
		isJSON : function( test ){
			
			try{
				
				return JSON.parse( test() );
				
			}catch( e ){
				
				return null;
				
			}
			
		} // <-- isJSON
		
		,
		
	// --> Controlla che un record sia univoco in una tabella
		
		isUnique : function( table, record ){
			
			return ( !record.unique || record.unique == "" || table.every( function( element, index, array ){
				
				return ( !element.unique || element.unique != record.unique );
				
			} ) );
			
		} // <-- isUnique
		
		,
		
	// --> Aggiorna i dati dello storage
		
		setDBtable : function( self, tablename, data ){
			
			data = data || [];
			
			var storage = self.storage
				
				,db 	= self.name
			
				,name 	= db + sign + tablename
			
				;
			
		// --> Ad ogni modo sovrascrivo se non ci sono errori
			
			try{						
				
				var encryme = tools.encrypt( self, JSON.stringify( data ) );
				
				if( !encryme )encryme = JSON.stringify( data );
			
				storage[ name ] = encryme;
				
				return true;
				
			}catch( e ){
				
				return false;	
				
			}
												
		} // <-- getDB
		
		,
		
	// --> Preleva i dati dallo storage
		
		getDBtable : function( self, tablename ){
			
			var storage  = self.storage
				
				,db 	 = self.name
			
				,name	 = db + sign + tablename
			
				;
			
		// --> Potrei non avere la tabella
			
			if( typeof storage[ name ] === "undefined" )return [];
				
			return this.isJSON( function test(){
						
				try{

					var decryme = tools.decrypt( self, storage[ name ] );

					return ( !decryme ) ? storage[ name ] : decryme;

				}catch( e ){

					return storage[ name ];

				}

			} );
			
		} // <-- getDB
		
		,
		
	 // --> Aggiorna un oggetto con dei nuovi valori
		
		deepMerge : function( to, from ){
			
			for ( var key in from) {
				
				try {
					
				// --> Compatibile con Firefox
					
					if ( from[ key ].constructor == Object ){
						
						to[ key ] = deepMerge( to[ key ], from[ key ] );

					}else{
						  
						to[ key ] = from[ key ];

					}

				}catch( e ){
					  
					to[ key ] = from[ key ];

				}
			}

			return to;
			
		} // <-- deepMerge
		
	}; // <-- tools;
	
/// --> La variabile globale con cui lavorare
	
	var localdbclass = function( newoptions ){
			
	// --> Se ho l'oggetto adeguato aggiorno le opzioni
		
		if( typeof newoptions !== "object" )newoptions = {};
		
	// --> Se per errore resetto lo storage lo riporto al local
		
		if( newoptions.storage != localStorage && newoptions.storage != sessionStorage ){
			
			this.storage = localStorage;
		
		}else{
			
			this.storage = newoptions.storage;
			
		}
		
	// --> Il nome del db è obbligatorio
		
		this.name = ( typeof newoptions.name !== "string" || newoptions.name == "" )
					? "localdbclass"
					: newoptions.name
					;
		
	// --> L'evento change deve essere una funzione
		
		this.change = ( typeof newoptions.change !== "function" )
					  ? function( tablename, recordschanged, eventname, mytableobj ){}
					  : newoptions.change
					  ;
		
	// --> Inizializzo la password
	
		this.password = null;
		
	// --> Riferimento globale allo sviluppatore
	
		this.dev = dev;
		
	// --> Restituisco me stesso per concatenare funzioni
		
		return this;
		
	};
		
/// --> Aggiungo record ed eseguo un callback alla fine
	
	localdbclass.prototype.add = function( tablename, records ){
			
		if( !tablename )throw new Error( "localdbclass.prototype.add : 'tablename' required !" );
			
		var self = this;
		
		return new Promise( function( resolve, reject ){
		
			records = ( Array.isArray( records ) ) ? records : [ records ];

		// --> Prelevo la tabella, potrebbe essere []

			var mytable = tools.getDBtable( self, tablename );

			if( !mytable )return reject( 100 );

		// --> Mi faccio un giro per ogni record

			var newrecords = [];

			for( var i = 0; i < records.length; i++ ){

				var record = records[ i ];

			// --> Potrei avere un valore unique, devo controllare

				if( !tools.isUnique( mytable, record ) )continue;

			// --> Aggiungo l'ID consecutivo al record

				var newid = tools.getNextID( self, tablename );
				
				if( newid !== null ){
					
					var newrecord = tools.deepMerge( record, { "#" : newid } ); 

				// --> Aggiungo il record alla tabella

					mytable.push( newrecord );

					newrecords.push( newrecord );
					
				}

			} // <-- forEach

		// --> Inserisco la tabella nel database

			var response = tools.setDBtable( self, tablename, mytable );

			if( !response )return reject( 101 );

		// --> Eseguo l'evento change con i records in questione

			self.change( tablename, newrecords, "add", mytable );

			return resolve( newrecords );
			
		} );
			
	};
	
/// --> Aggiorno un record
	
	localdbclass.prototype.update = function( tablename, records ){
			
		if( !tablename )throw new Error( "localdbclass.prototype.update : 'tablename' required !" );
		
		var self = this;
		
		return new Promise( function( resolve, reject ){
		
			records = ( Array.isArray( records ) ) ? records : [ records ];

		// --> Prelevo la tabella, potrebbe essere []

			var mytable = tools.getDBtable( self, tablename );

			if( !mytable )return reject( 100 );

		// --> Un ciclo per aggiornare

			var updated = []

				,count	= 0;

			for( var i = 0; i < mytable.length && count < records.length; i++ ){

				for( var ii = 0; ii < records.length; ii++ ){

					var record = records[ ii ];

					if( mytable[ i ][ "#" ] == record[ "#" ] ){

						count++;

					// --> Ok, ma se l'unique è diverso non si va avanti, inizio con il clonare il db

						var mytablecloned = mytable.slice();

					// --> Rimuovo l'oggetto in esame e vedo se esiste un unique simile

						mytablecloned.splice( i, 1 );

						if( !tools.isUnique( mytablecloned, record ) )continue;

						mytable[ i ] = tools.deepMerge( mytable[ i ], record );

						updated.push( mytable[ i ] );

					}

				} // <-- for records

			} // <-- for mytable

		// --> Inserisco la tabella nel database

			var response = tools.setDBtable( self, tablename, mytable );

			if( !response )return reject( 101 );

		// --> Eseguo l'evento change con il record in questione

			self.change( tablename, updated, "update", mytable );

			return resolve( updated );
			
		} );
		
	};
	
/// --> Effettuo una ricerca nel database
	
	localdbclass.prototype.remove = function( tablename, ids ){
		
		if( !tablename )throw new Error( "localdbclass.prototype.remove : Table name required !" );
		
		var self = this;
		
		return new Promise( function( resolve, reject ){
			
			ids = ( Array.isArray( ids ) ) ? ids : [ ids ]; 

		// --> Prelevo la tabella, potrebbe essere []

			var mytable = tools.getDBtable( self, tablename );

			if( !mytable )return reject( 100 );

		// --> Un ciclo per rimuovere

			var deleted = [];

			for( var i = 0; i < ids.length; i++ ){

			// --> Devo trovare l'indice array nella tabella

				var index = mytable.findIndex( function( record ){

					return ( record[ "#" ] == ids[ i ] );

				} );

				if( index > -1 ){

					deleted.push( mytable[ index ] );

				// --> Esiste sicuro

					mytable.splice( index, 1 );

				}

			} // <-- for ids

		// --> Inserisco la tabella nel database

			var response = tools.setDBtable( self, tablename, mytable );

			if( !response )return reject( 101 );

		// --> Eseguo l'evento change con il record in questione

			self.change( tablename, deleted, "remove", mytable );

		// --> Restituisco me stesso per concatenare funzioni

			return resolve( deleted );
			
		} );
		
	};
	
/// --> Sposto un record in una nuova posizione
	
	localdbclass.prototype.move = function( tablename, idfrom, idto ){
		
		if( !tablename )throw new Error( "localdbclass.prototype.move : Table name required !" );
				
		if( !( idfrom > -1 ) || !( idto > -1 ) )throw new Error( "localdbclass.prototype.move : ID required !" );
		
		var self = this;
		
		return new Promise( function( resolve, reject ){
			
		// --> Prelevo la tabella, potrebbe essere []
		
			var mytable = tools.getDBtable( self, tablename );

			if( !mytable )return reject( 100 );

		// --> Mi Assicuro che le posizioni sia intercambiabile

			var to = mytable.findIndex( function( record ){

				return ( idto == record[ "#" ] );

			} );

			if( to < 0 )return reject( 4 );

		// --> Devo conoscere l'indice effettivo del record

			var from = mytable.findIndex( function( record ){

				return ( idfrom == record[ "#" ] );

			} );

			if( from < 0 )return reject( 5 );

			if( from == to )return reject( 6 );

		// --> Sposto il record

			var moved = mytable.splice( from, 1 );

			mytable.splice( to, 0, moved[ 0 ] );

		// --> Inserisco la tabella nel database

			var response = tools.setDBtable( self, tablename, mytable );

			if( !response )return reject( 101 );
			
		// --> Eseguo l'evento change con il record in questione

			self.change( tablename, moved, "move", mytable );

		// --> Restituisco me stesso per concatenare funzioni

			return resolve( moved );
			
		} );
		
	};
	
/// --> Sposto di posizione 2 record
	
	localdbclass.prototype.invert = function( tablename, idfrom, idto ){
		
		if( !tablename )throw new Error( "localdbclass.prototype.invert : Table name required !" );
		
		if( !( idfrom > -1 ) || !( idto > -1 ) )throw new Error( "localdbclass.prototype.invert : ID required !" );
		
		var self = this;
		
		return new Promise( function( resolve, reject ){
			
		// --> Prelevo la tabella, potrebbe essere []
		
			var mytable = tools.getDBtable( self, tablename );

			if( !mytable )return reject( 100 );

		// --> Mi Assicuro che le posizioni sia intercambiabile

			var to = mytable.findIndex( function( record ){

				return ( idto == record[ "#" ] );

			} );

			if( to < 0 )return reject( 4 );

		// --> Devo conoscere l'indice effettivo del record

			var from = mytable.findIndex( function( record ){

				return ( idfrom == record[ "#" ] );

			} );

			if( from < 0 )return reject( 5 );

			if( from == to )return reject( 6 );

		// --> Sposto i records

			var movedfrom, movedto;

			if( from > to ){

				movedfrom = mytable.splice( from, 1 );

				movedto   = mytable.splice( to, 1 );

				mytable.splice( to, 0, movedfrom[ 0 ] );

				mytable.splice( from, 0, movedto[ 0 ] );

			}else{

				movedto   = mytable.splice( to, 1 );

				movedfrom = mytable.splice( from, 1 );

				mytable.splice( from, 0, movedto[ 0 ] );

				mytable.splice( to, 0, movedfrom[ 0 ] );

			}

		// --> Inserisco la tabella nel database

			var response = tools.setDBtable( self, tablename, mytable );

			if( !response )return reject( 101 );

		// --> Eseguo l'evento change con il record in questione

		self.change( tablename, [ movedfrom, movedto ], "invert", mytable );

		// --> Restituisco me stesso per concatenare funzioni

			return resolve( [ movedfrom, movedto ] );
			
		} );
				
	};
	
/// --> Effettuo un giro in una tabella
	
	localdbclass.prototype.query = function( tablename, condition, opt ){
		
		if( !tablename )throw new Error( "localdbclass.prototype.query : Table name required !" );
		
		var self = this;
		
		return new Promise( function( resolve, reject ){
			
			if( typeof condition !== "function" )condition = function(){ return true; };

			if( !opt )opt = {};

			opt.offset = ( !opt.offset ) ? 0 : ( parseInt( opt.offset ) > 0 ) ? parseInt( opt.offset ) : 0;

			opt.limit = ( !opt.limit ) ? -1 : ( parseInt( opt.limit ) > 0 ) ? parseInt( opt.limit ) : -1;

			if( opt.sort !== "disc" )opt.sort = "asc";

			//if( !opt.sortby )opt.sortby = "#";

			var response = [];

		// --> Prelevo la tabella, potrebbe essere []

			var mytable = tools.getDBtable( self, tablename );

			if( !mytable )return reject( 100 );

			var originaltable = mytable.slice();

		// --> Organizzo i dati per come richiesti

			if( opt.sortby && typeof opt.sortby === "string" ){

				if( opt.sort == "asc" ){

					mytable.sort( function( a, b ){

						if( typeof a[ opt.sortby ] === "string" && typeof b[ opt.sortby ] === "string" ){

						// --> Per i caratteri non ascii

							return a[ opt.sortby ].localeCompare( b[ opt.sortby ] );

						}

						return ( parseInt( a[ opt.sortby ] ) - parseInt( b[ opt.sortby ] ) );

					} );

				}else{

					mytable.sort( function( a, b ){

						if( typeof a[ opt.sortby ] === "string" && typeof b[ opt.sortby ] === "string" ){

						// --> Per i caratteri non ascii

							return b[ opt.sortby ].localeCompare( a[ opt.sortby ] );

						}

						return ( parseInt( b[ opt.sortby ] ) - parseInt( a[ opt.sortby ] ) );

					} );

				} // <-- if asc

			} // <-- if sortby

		// --> Un ciclo per la ricerca

			for( var i = opt.offset; i < mytable.length && ( opt.limit < 0 || i < opt.limit ); i++ ){

				var record = mytable[ i ];

				if( condition( record ) === true )response.push( record );

			}

			return resolve( response );
			
		} );
		
	};
	
/// --> Crypto tutto il mio db
	
	localdbclass.prototype.encryptdb = function( mypass ){
		
		var self = this;
		
		return new Promise( function( resolve, reject ){
			
			var storage 	 = self.storage

			,teststorage = {};
		
		// --> Faccio un giro di prova per valutare che tutti i db si possano cifrare, altrimenti non cambio nulla

			for( var key in storage ){

				if( key.match( new RegExp( "^" + self.name , "g" ) ) ){

					try{

						var encrypted = tools.encrypt( self, storage[ key ], mypass );

						if( !encrypted )return reject();

						teststorage[ key ] = encrypted;

					}catch( e ){

						return reject();

					}

				} // <-- if match

			} // <-- for storage

		// <-- Sembra tutto ok

			for( var key in teststorage ){

				storage[ key ] = teststorage[ key ];

			} // <-- for storage

			return resolve();
			
		} );
		
	};
	
/// --> Decrypto tutto il mio db
	
	localdbclass.prototype.decryptdb = function( mypass ){
		
		var self = this;
						
		return new Promise( function( resolve, reject ){
			
			var storage      = self.storage

			,teststorage = {};

		// --> Faccio un giro di prova per valutare che tutti i db si possano decifrare, altrimenti non cambio nulla

			for( var key in storage ){

				if( key.match( new RegExp( "^" + self.name , "g" ) ) ){

				// --> Potrebbe essere in chiaro

					try{

						if( JSON.parse( storage[ key ] ) ){

							teststorage[ key ] = storage[ key ];

							continue;

						}

					}catch( e ){}

					try{

						var decrypted = tools.decrypt( self, storage[ key ], mypass );

					// --> Faccio un test, potrebbe essere in chiaro

						if( !decrypted ){

							return reject();

						}else if( JSON.parse( decrypted ) ){

							teststorage[ key ] = decrypted;

							continue;

						}else{

							return reject();

						}								

					}catch( e ){

						return reject();

					}

				} // <-- if match

			} // <-- for storage

		// <-- Sembra tutto ok

			for( var key in teststorage ){

				storage[ key ] = teststorage[ key ];

			} // <-- for storage

			return resolve();
			
		} );
		
	};
	
/// --> Restituisco la tabella come oggetto
	
	localdbclass.prototype.getTable = function( tablename ){
		
		if( !tablename )throw new Error( "localdbclass.prototype.getTable : Table name required !" );
		
		var self = this;
		
		return tools.getDBtable( self, tablename );
		
	};

/// --> Restituisco il numero di record in una tabella
	
	localdbclass.prototype.countRecords = function( tablename ){
		
		if( !tablename )throw new Error( "localdbclass.prototype.countRecords : Table name required !" );
		
		var self = this;
		
		return new Promise( function( resolve, reject ){
			
			var mytable = tools.getDBtable( self, tablename );
		
			if( !mytable )return reject( 100 );

			return resolve( mytable.length );
			
		} );
				
	};
	
/// --> Esporta il database
	
	localdbclass.prototype.export = function(){
		
		var self = this;
				
		return new Promise( function( resolve, reject ){
			
			var storage = self.storage

			,alltable 	= [];

		// --> Raccolgo tutte le tabelle di questo DB

			for( var key in storage ){

				if( key.match( new RegExp( "^" + self.name , "g" ) ) ){

					var table = {};

					table[ key ] = storage[ key ];

					alltable.push( table );

				} // <-- if match

			} // <-- for storage	

			if( alltable.length < 1 )resolve( null );

			resolve( JSON.stringify( alltable ) );
			
		} );
		
	};
	
/// --> Importa un db database
	
	localdbclass.prototype.import = function( alldb ){
		
		var self = this;
			
		return new Promise( function( resolve, reject ){
    	
			var storage = self.storage;

		// --> Raccolgo tutte le tabelle di questo DB

			if( typeof alldb !== "string" )throw new Error( "localdbclass.prototype.import : require text format alldb" );

			try{

				var allmydb = JSON.parse( alldb );

				allmydb.forEach( function( table ){

					try{

						storage[ Object.keys( table ) ] = table[ Object.keys( table ) ];

					}catch( e ){}

				} );

			}catch( e ){

				reject( "localdbclass.prototype.import : problems on import" );

			}
			
			resolve();
			
  		} ); // <-- Promise
				
	};
	
/// --> Rimuove tutto il database, o una sola tabella
	
	localdbclass.prototype.clear = function( tablename ){
		
		var self = this;
		
		return new Promise( function( resolve, reject ){
			
			var storage = self.storage;

		// --> Raccolgo tutte le tabelle di questo DB

			for( var key in storage ){

				if( 
					( tablename && key.match( new RegExp( "^" + self.name + sign + tablename.toString() + "$", "g" ) ) ) ||
					( !tablename && key.match( new RegExp( "^" + self.name , "g" ) )  )
				){

					storage.removeItem( key );

				} // <-- if match

			} // <-- for storage

		// --> Eseguo l'evento change

			self.change( tablename, [], "clear", [] );
			
			resolve( self.name );
			
		} );
		
	};
	
/// --> Controlla se il db è cryptato
	
	localdbclass.prototype.isEncrypted = function(){
		
		var self = this;
		
		return new Promise( function( resolve, reject ){
			
			var storage = self.storage
			
			,count   = 0
			
			,cripted = 0
			
			;

		// --> Raccolgo tutte le tabelle di questo DB

			for( var key in storage ){

				if( key.match( new RegExp( "^" + self.name , "g" ) ) ){
					
					count++;
					
					if( tools.isJSON( function test(){
						
						try{
							
							var decryme = decrypt( storage[ key ] );
							
							return ( !decryme ) ? storage[ key ] : decryme;
							
						}catch( e ){
							
							return storage[ key ];
							
						}
						
					} ) === null )cripted++;

				} // <-- if match

			} // <-- for storage
						
			resolve( [ count, cripted ] );
			
		} );
		
	};
		
/// --> Rendo disponibile l'oggetto
	
	window.localdb = localdbclass;
	
} )();








