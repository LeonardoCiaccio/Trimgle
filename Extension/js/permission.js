( function( $ ){
	
	"use strict";
	
	if( !$ || !$.Trimgle )throw new Error( "jQuery.Trimgle required" );
			
// --> Anon info
	
	var autorized = window.GA;
	
	window.GA = function( c, a, l ){
		
		var sets = $.Trimgle.settings();
		
		if( sets && sets.sendAnonInfo === true )autorized( c, a, l );
		
	};
	
} )( window.jQuery );