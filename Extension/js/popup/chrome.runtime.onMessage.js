( function(){
	
	"use strict";
	
	var real = {
		
		 newItem : function( request, sender, sendResponse ){
			
			if( _iAmInHome() === true ){
				
				_goHome();
			
			}
						
		}
		
		,newReview : function( request, sender, sendResponse ){
			
			if( _iAmInReview() === true ){
				
				_goReview( true );
			
			}else{
				
				_autoPosition();
				
			}
						
		}
		
		,newWatch : function( request, sender, sendResponse ){
			
			if( _iAmInWatch() === true ){
				
				_goWatch( true );
			
			}else{
				
				_autoPosition();
				
			}
						
		}
		
	};
		
	chrome.runtime.onMessage.addListener( function( request, sender, sendResponse ){
					
		try{

		// ( it ) --> Richiamo eventuali estensioni

			real[ request.real ]( request, sender, sendResponse );

		}catch( e ){}

	} );
	
} )();