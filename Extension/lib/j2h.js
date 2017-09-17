( function(){
	
	var	
		_isObj = function( _obj ){

		   return ( typeof _obj === "object" && JSON.stringify( _obj ).indexOf( "{" ) == 0 ); 

		}
	;
	
	window.j2h = function( text, signature ){
		
		signature = signature || "";
		
		if( typeof text !== "string" )return null;
		
		text = text.trim();
		
		var textJson ;
		
		try{
			
			textJson = JSON.parse( text );
			
		}catch( e ){
			
			var newlistitem = document.createElement( "li" );			
				
			if( signature != "" )newlistitem.setAttribute( "class", signature );
			
			newlistitem.textContent = text;
			
			return newlistitem;
			
		}
		
		var self = window.j2h;
		
	// --> Fatti i controlli possiamo procedere
		
		if( Array.isArray( textJson ) === true ){
			
			var newlist = document.createElement( "ul" );
			
			textJson.forEach( function( arrEle, index ){
				
				var newlistitem = document.createElement( "li" );
				
				if( ( Array.isArray( arrEle ) === true ) || ( _isObj( arrEle ) === true ) ){
					
					var tmp = self( JSON.stringify( arrEle ) );
					
					if( !tmp )return true;
					
					newlistitem = tmp;
					
				}else{
					
					newlistitem.textContent = arrEle;
					
				}			
				
				if( signature != "" )newlistitem.setAttribute( "class", signature );
				
				newlist.appendChild( newlistitem );
				
			} ); // <-- forEach
			
			return ( newlist.childNodes.length > 0 ) ? newlist : null;
			
		}else if( _isObj( textJson ) === true ){
			
			var newlist = document.createElement( "ul" );
			
			for( var x in textJson ){
				
				var newlistitem = document.createElement( "li" );
			
				if( signature != "" )newlistitem.setAttribute( "class", signature );
				
				newlistitem.textContent = x;
				
				newlist.appendChild( newlistitem );
				
				var tmp = self( JSON.stringify( textJson[ x ] ), x.replace( /[^\w]/gi, "") );
					
				if( !tmp )continue;
				
				newlist.appendChild( tmp );	
				
			}
			
			return ( newlist.childNodes.length > 0 ) ? newlist : null;
			
		}else{
			
			var 
				 newlist = document.createElement( "ul" )
				
				,newlistitem = document.createElement( "li" )
			;
							
			if( signature != "" )newlistitem.setAttribute( "class", signature );
			
			newlistitem.textContent = textJson;
			
			newlist.appendChild( newlistitem );
			
			return newlist;
		}
		
		return null;
		
	};
	
} )();