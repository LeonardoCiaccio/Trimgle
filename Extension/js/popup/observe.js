( function( $ ){
    
	"use strict";
		
	if( !$ )throw new Error( "jQuery required" );
	
// --> HOME LIST
	
	var 
		homelist = $("#home .row.container")[ 0 ]
	
		,observer = new MutationObserver(function( mutations ){
		
			mutations.forEach( function( mutation ){
							
				_cursorToHome();
				
				var flag = ( $("#page-list").find( ".item" ).length > 0 ) ? "hide" : "show" ;
		  
				_noJobs( flag );
				
			} );
			
		})
	;

	var config = { childList: true, subtree : true };

	observer.observe( homelist, config );
	
	var v = new VanillaKinetic( $( "#home .row.container" )[ 0 ], {
		
		maxvelocity : 70,
		cursor : ""
		
	} );
	
	$( homelist ).bind( "mousewheel", function( ev ){ // --> DOMMouseScroll", function( event ){

		if( ev.originalEvent.wheelDelta > 0 || ev.originalEvent.detail < 0){
			
			$( this ).scrollTo( "-=50px", 100 );
		
		}else{
			
			$( this ).scrollTo( "+=50px", 100 );
			
		}
		
		ev.stopPropagation();
		
	} );
	
// --> EXPLORE LIST
	
	var 
		explorelist = $("#explore .row.container")[ 0 ]
	
		,observer2 = new MutationObserver(function( mutations ){
		
			mutations.forEach( function( mutation ){
			
				_cursorToExplore();
		  
			} );
			
		})
	;

	var config = { childList: true, subtree : true };

	observer2.observe( explorelist, config );
	
	var v2 = new VanillaKinetic( $( "#explore .row.container" )[ 0 ], {
		
		maxvelocity : 70,
		cursor : ""
		
	} );
	
	$( explorelist ).bind( "mousewheel", function( ev ){ // --> DOMMouseScroll", function( event ){

		if( ev.originalEvent.wheelDelta > 0 || ev.originalEvent.detail < 0){
			
			$( this ).scrollTo( "-=50px", 100 );
		
		}else{
			
			$( this ).scrollTo( "+=50px", 100 );
			
		}
		
		ev.stopPropagation();
		
	} );
	
// --> REVIEW LIST
	
	var 
		revievlist = $("#toreview .row.container")[ 0 ]
	
		,observer3 = new MutationObserver(function( mutations ){
		
			mutations.forEach( function( mutation ){
			
				_cursorToReview();
		  
			} );
			
		})
	;

	var config = { childList: true, subtree : true };

	observer3.observe( revievlist, config );
	
	var v3 = new VanillaKinetic( $( "#toreview .row.container" )[ 0 ], {
		
		maxvelocity : 70,
		cursor : ""
		
	} );
	
	$( revievlist ).bind( "mousewheel", function( ev ){ // --> DOMMouseScroll", function( event ){

		if( ev.originalEvent.wheelDelta > 0 || ev.originalEvent.detail < 0){
			
			$( this ).scrollTo( "-=50px", 100 );
		
		}else{
			
			$( this ).scrollTo( "+=50px", 100 );
			
		}
		
		ev.stopPropagation();
		
	} );
	
// --> WATCH LIST
	
	var 
		watchlist = $("#towatch .row.container")[ 0 ]
	
		,observer4 = new MutationObserver(function( mutations ){
		
			mutations.forEach( function( mutation ){
			
				_cursorToWatch();
		  
			} );
			
		})
	;

	var config = { childList: true, subtree : true };

	observer4.observe( watchlist, config );
	
	var v4 = new VanillaKinetic( $( "#towatch .row.container" )[ 0 ], {
		
		maxvelocity : 70,
		cursor : ""
		
	} );
	
	$( watchlist ).bind( "mousewheel", function( ev ){ // --> DOMMouseScroll", function( event ){

		if( ev.originalEvent.wheelDelta > 0 || ev.originalEvent.detail < 0){
			
			$( this ).scrollTo( "-=50px", 100 );
		
		}else{
			
			$( this ).scrollTo( "+=50px", 100 );
			
		}
		
		ev.stopPropagation();
		
	} );
	
} )( window.jQuery );









