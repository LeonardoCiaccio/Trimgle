( function( $ ){
    
	"use strict";
		
	if( !$ )throw new Error( "jQuery required" );
	
// --> Events
	
	$( ".icon.alarm" ).on( "click", function( ev ){
		
		var sets = $.Trimgle.settings();
		
		if( !sets ){
			
			alert( chrome.i18n.getMessage( "problem_inact" ) );
			
			return false;
			
		}
		
		var isEnabled = !( $( ".icon.alarm" ).hasClass( "mute" ) );
		
		sets.notification = !isEnabled;
		
		$.Trimgle.settings( sets, function(){
			
			_loadSettings( sets );
			
		}, function(){
			
			alert( chrome.i18n.getMessage( "problem_inact" ) );
			
		} )
		
	} );
	
	$( ".logo img, #home i.icon.options, #home h2.title" ).on( "click", function( ev ){
		
		_changePage( "#about", function(){
			
			$( "#popup" ).attr( "cxx", "about" );
			
		} );
		
		ev.stopPropagation();
		
	} );
	
	$( "a.home" ).on( "click", function( ev ){
		
		_autoPosition();	
		
		ev.stopPropagation();
		
	} );
	
	$( ".ping.webhook" ).on( "click", function( ev ){
		
		_changePage( "#webhook", function(){
			
			$( "#popup" ).attr( "cxx", "webhook" );
						
		} );
		
		ev.stopPropagation();
		
	} );
		
	$( "a.section.edit" ).on( "click", function( ev ){
		
		_changePage( "#page-edit", function(){
			
			/*chrome.tabs.captureVisibleTab( null, { format: "png" }, function( src ){
			
				$( "#page-edit img.screenshot" ).attr( "src", src );

			} );*/
			
			$( "#popup" ).attr( "cxx", "page-edit" );
			
			setTimeout( function(){
				
				$( "#page-edit-title" ).first().focus();
				
			}, 100 );
			
		} );	
		
		ev.stopPropagation();
		
	} );
	
	$( ".ui.radio.checkbox" ).checkbox();
	
	$("#page-edit .saving .saving.updates").on( "click", function( evt ){
		
		var 
			 $self = $( this )
		
			,_toNormalEdit = function( callback ){
			
				if( typeof callback == "undefined" )callback = function(){};
								
				setTimeout( function(){
					
					$( ".saving .loader.updates" ).hide();

					$self.show();
				
					callback();
					
				} ,1000);
				
			}
		
			,_toLoadEdit = function(){
			
				$self.hide();
		
				$( ".saving .loader.updates" ).show();	
				
			}
		;
		
	// --> Updates
		
		_toLoadEdit();
				
		var unique = $( "#page-edit" ).attr( "trimgle-item" ) || "";
		
		if( !unique || unique == "" ){
			
			_toNormalEdit();
			
			alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 1 )" );
			
		}else{
						
			$.Trimgle.getItem( unique, function( filtered ){
				
				if( !filtered || filtered.length < 1 ){
					
					alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 2 )" );
					
					_toNormalEdit();
					
					return false;
					
				}
								
				var myitem = filtered[ 0 ];
				
				myitem.title = $( "#page-edit-title" ).val().trim();
				
				myitem.description = $( "#page-edit-desc" ).val().trim();
				
				myitem.interval = $( "input[name='time-check']:checked" ).val();
				
				var tmp = $( "#page-edit-webhook" ).val();
				
				if( !tmp || tmp.trim() != "" ){
					
					tmp = tmp.trim();
					
					myitem.pinglist = tmp.split( "\r\n" ) || [];
				
				}else{
					
					myitem.pinglist = [];
					
				}
				
				$.Trimgle.updateItem( myitem, function(){
					
					_toNormalEdit( function(){
						
						document.location.reload();
						
					} );
					
				}, function(){
				
					_toNormalEdit();
					
					alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 3 )" );

				} );
				
			}, function( reason ){
				
				_toNormalEdit();
				
				alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 4 ) " + reason );
				
			} );			
			
		}	
		
		evt.stopPropagation();
		
	} );
	
	$( "#explore i.refresh" ).on( "click", function( ev ){
		
		var 
			 $self = $( this )
		
			,_toNormalExplore = function( callback ){
			
				if( typeof callback == "undefined" )callback = function(){};
								
				setTimeout( function(){
					
					$self.removeClass( "loading" );
				
					callback();
					
				} ,1000);
				
			}
		
			,_toLoadExplore = function(){
			
				$self.addClass( "loading" );	
				
			}
		;
		
		_toLoadExplore();
				
		var unique = $( "#explore" ).attr( "trimgle-item" ) || "";
		
		if( !unique || unique == "" ){
			
			_toNormalExplore();
			
			alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 1 )" );
			
		}else{
						
			$.Trimgle.getItem( unique, function( filtered ){
				
				if( !filtered || filtered.length < 1 ){
					
					alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 2 )" );
					
					_toNormalExplore();
					
					return false;
					
				}
								
				var myitem = filtered[ 0 ];
				
				$.Trimgle.updateResults( myitem, function( upitem ){
					
					$( "#bullet-list" ).html( "" );
					
					$.each( upitem.newest, function( index, value ){
						
						var ele = ( value.link != "" && value.title != "" )
								  ? "<a href='" + value.link + "' target='_blank'>" + value.title + "</a>"
								  : ( value.text != "" ) ? value.text : ""
								  ;
						
						if( ele != "" )$( "#bullet-list" ).append( "<div class='item'>" + ele + "</div>" );
						
					} );
					
					_cursorToExplore();
					
					_toNormalExplore();
					
				}, function( num ){
										
					/*if( num != -1 && num != -3 ){
						
						alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 3 )" );
					
					}else{
						
						_goReview();
						
					}*/
					
					_goReview();
					
					_toNormalExplore();
					
				} );
				
			}, function( reason ){
				
				_toNormalEdit();
				
				alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 4 ) " + reason );
				
			} );			
			
		}
		
		ev.stopPropagation();
		
	} );
	
	$( "#about-anon-info" ).on( "click", function( ev ){
				
		var sets = $.Trimgle.settings();
		
		if( !sets ){
			
			alert( chrome.i18n.getMessage( "problem_inact" ) );
			
			return false;
			
		}
				
		sets.sendAnonInfo = $( this ).is( ":checked" );
		
		$.Trimgle.settings( sets, function(){
			
			_loadSettings( sets );
			
		}, function(){
			
			alert( chrome.i18n.getMessage( "problem_inact" ) );
			
		} )
		
		ev.stopPropagation();
		
	} );
		
	$( "#toreview .icon.remove" ).on( "click", function( ev ){
						
		var 
			$self = $( this )
		
			,endProc = function(){

				_autoPosition();
				
				$( "#toreview .row.container" ).html( "" );
				
				$( "#toreview .loader" ).hide();
			
				$self.show();
				
			}
		;
		
		$self.hide();
		
		$( "#toreview .loader" ).show();
		
		$.Trimgle.resetReview( function(){
			
			setTimeout( endProc, 1000 );
			
		}, function(){
			
			setTimeout( function(){
				
				endProc();
				
				alert( chrome.i18n.getMessage( "problem_inact" ) );
				
			}, 1000 );
						
		} );
		
		ev.stopPropagation();
		
	} );
		
	$( "#towatch .icon.remove" ).on( "click", function( ev ){
						
		var 
			$self = $( this )
		
			,endProc = function(){
				
				$( "#towatch .row.container" ).html( "" );
				
				$( "#towatch .loader" ).hide();

				_autoPosition();
			
				$self.show();
				
			}
		;
		
		$self.hide();
		
		$( "#towatch .loader" ).show();
		
		$.Trimgle.resetWatch( function(){
			
			setTimeout( endProc, 1000 );
			
		}, function(){
			
			setTimeout( function(){
				
				endProc();
				
				alert( chrome.i18n.getMessage( "problem_inact" ) );
				
			}, 1000 );
						
		} );
		
		ev.stopPropagation();
		
	} );
	
	$.Trimgle.onReviewChange( function( eventname, tableReview ){
				
		if( tableReview.length > 0 ){
			
			chrome.browserAction.setIcon( { path : "img/icon.error.32.png" } );
		
		}else{
			
			chrome.browserAction.setIcon( { path : "img/icon.32.png" } );
			
		}
		
	} );
		
	$.Trimgle.onWatchChange( function( eventname, tableWatch ){
				
		chrome.browserAction.setBadgeText( {

			text : ( tableWatch.length > 0 ) ? tableWatch.length + "" : ""

		} );
		
	} );
	
// --> Load contents into
			
	_loadSettings();
	
	_autoPosition();
	
} )( window.jQuery );

















