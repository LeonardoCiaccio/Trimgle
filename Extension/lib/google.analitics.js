/*

	@Usage example : window.GA( "Extension", "new session", chrome.runtime.getManifest().version );

*/


( function(){
	
	"use strict";
	
// --> PARAMS
	
	const 
		 
		ANALITYCS	= "https://www.google-analytics.com/collect"
	
		,M			= "UA-106407540-1"
	
		,Y			= "555"
	
	;
	
// --> Tools
	
	var _getXHR = function(){
		
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
	
	};
	
// --> Class
	
	window.GA = function( c, a, l ){
		
		var request = _getXHR();
		
		if( !request )return false;
		
		c = c || "";
		a = a || "";
		l = l || "";

		if( c + a + l == "" )return false;
		
		var params = "v=1"   +
					 "&tid=" + M +
				  	 "&cid=" + Y +
					 "&ec="  + c +
					 "&ea="  + a +
					 "&el="  + l +
					 "&t=event"  ;

		request.open( "POST", ANALITYCS, true );
		request.send( params );
		
		// console.log( "GA : " + params );
		
	};
	
} )();












