( function( $ ){
	
	"use strict";
	
	if( !$ || !$.Trimgle )throw new Error( "jQuery.Trimgle required" );
	
	var 
		 _checkNews = function(){
			
			$.ajax( {

				 url : urlNews
				
				,cache : false
				
				,jsonp : false
				
				,dataType : "json"
				
				,success  : function( data ) {

					if( !data || !data.lastNews || typeof data.lastNews != "string" || !data.lastNews.match( /^http/gi ) )return false;

					var sets = $.Trimgle.settings();

					if( sets.lastNews.localeCompare( data.lastNews ) == 0 )return false;
					
					sets.lastNews = data.lastNews;

					$.Trimgle.settings( sets );

				}

			} );
			
		}
	;
	
	setInterval( _checkNews ,( ( 1000 * 60 ) * 15 ) );
	
	_checkNews();
	
} )( window.jQuery );