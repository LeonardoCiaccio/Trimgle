if( !$ )throw new Error( "jQuery required" );

var 
	 maxchar = 25

	,signreview = "review-index"

	,signwatch = "watch-index"

	,_iAmInHome = function(){
		
		return ( $( "#home.transition.visible" ).length > 0 );
		
	}

	,_iAmInReview = function(){
		
		return ( $( "#toreview.transition.visible" ).length > 0 );
		
	}

	,_iAmInWatch = function(){
		
		return ( $( "#towatch.transition.visible" ).length > 0 );
		
	}

	,_truncate = function( text, len ){
		
		len = len || maxchar;
		
		if( text.length > len )text = text.substring( 0, len ) + " ...";
		
		return text;
		
	}

	,_changePage = function( selector, before, after ){
			
		before = before || function(){};
		after = after || function(){};

		var swit = function(){
			
			before();

			$( selector ).transition( "fade", 500, function(){

				after();

			} );
			
		};
		
		if( $( ".mypage.transition.visible" ).length > 0 ){
			
			$( ".mypage.transition.visible" ).transition( "fade", 500, function(){

				swit();

			} );
			
		}else{
			
			swit();
			
		}
		
	}
	
	,_loadAllReviews = function( update ){
		
		var 
			allreviews = $.Trimgle.getAllReviews()

			,$list = $( "#toreview .row.container" ).first()
		;

		$list.html( "" );

		$.each( allreviews, function( index, item ){

			if( update === true ){

				if( $( "#toreview .row.container [" + signreview + "='" + item[ "#" ] + "']" ).length > 0 )return true;

			}

			var $cloned = $( "#proto_review" ).clone( true );

			$cloned.removeAttr( "id" );

			$cloned.find( "a.pageurl" ).attr( "href", item.page ).text( item.title );

			$cloned.find( ".desc.page" ).text( item.desc );

			$cloned.find( ".dets.error" ).text( item.lasterror );

			$cloned.find( ".info.error" ).text( "[ " + item.status + " ] " + new Date( item.when ).toLocaleString() );

			$cloned.find( "img.avatar" )
				.attr( "src", item.favicon )
				.attr( signreview, item[ "#" ] );

			if( $list.html() != "" )$list.prepend( "<div class=\"ui divider\"></div>" );

			$list.prepend( $cloned.html() );

			$cloned.remove();

		} );

	}
	
	,_loadAllWatchs = function( update ){
		
		var 
			allwatchs = $.Trimgle.getAllWatchs()

			,$list = $( "#towatch .row.container" ).first()
		;

		$list.html( "" );

		$.each( allwatchs, function( index, item ){

			if( update === true ){

				if( $( "#towatch .row.container [" + signwatch + "='" + item[ "#" ] + "']" ).length > 0 )return true;

			}

			var $cloned = $( "#proto_watch" ).clone( true );

			$cloned.removeAttr( "id" );

			$cloned.find( "a.pageurl" ).attr( "href", item.page ).text( item.title );

			$cloned.find( ".desc.page" ).text( item.desc );

			$.each( item.newdata, function( index2, item2 ){
				
				var ele = ( item2.link != "" && item2.title != "" )
								  ? "<a href='" + item2.link + "' target='_blank'>" + item2.title + "</a>"
								  : ( item2.text != "" ) ? item2.text : ""
								  ;
						
				if( ele != "" )$cloned.find( ".bulleted.list" ).append( "<div class='item'>" + ele + "</div>" );
				
			} );
			
			$cloned.find( "img.avatar" )
				.attr( "src", item.favicon )
				.attr( signwatch, item[ "#" ] );

			if( $list.html() != "" )$list.prepend( "<div class=\"ui divider\"></div>" );

			$list.prepend( $cloned.html() );

			$cloned.remove();

		} );

	}

	,_goReview = function( update ){
			
		$( "#toreview .icon.remove" ).hide();
			
		$( "#toreview .loader" ).show();
		
		setTimeout( function(){
			
			_loadAllReviews( update );

			if( !update )_changePage( "#toreview", function(){

				$( "#popup" ).attr( "cxx", "toreview" );

				setTimeout( _cursorToReview, 100 );

			} );

			$( "#toreview .loader" ).hide();

			$( "#toreview .icon.remove" ).show();
			
		}, 300);

	}

	,_goWatch = function( update ){
			
		$( "#towatch .icon.remove" ).hide();
			
		$( "#towatch .loader" ).show();
		
		setTimeout( function(){
			
			_loadAllWatchs( update );

			if( !update )_changePage( "#towatch", function(){

				$( "#popup" ).attr( "cxx", "towatch" );

				setTimeout( _cursorToWatch, 100 );

			} );

			$( "#towatch .loader" ).hide();

			$( "#towatch .icon.remove" ).show();
			
		}, 300);

	}

	,_animateScroll = function(){

		$( "#drag-scroll" )
			.transition( "stop all" )
			.transition( "hide" )
			.transition( "clear queue" );

		$( "#drag-scroll i" ).attr( "class", "icon large hand paper white" );

		$( "#drag-scroll" ).transition( "fade", 500, function(){

			$( "#drag-scroll i" ).attr( "class", "icon large hand rock white" );

			$( "#drag-scroll" ).transition( "bounce", 1500, function(){

				$( "#drag-scroll" ).transition( "fade", 500 );

				$( "#drag-scroll i" ).attr( "class", "icon large hand paper white" );

			} );

		} );

	}

	,_iconReadAll = function( $items, $icon ){
		
		if( $items.length < 1 ){
			
			$icon.hide();
			
		}else{
			
			$icon.show();
			
		}
		
	}

	,_iconReadAllPage = function(){
		
		_iconReadAll( $( "#page .row.container .item" ), $( "#page .icon.read-all" ) );
		
	}

	,_appendCursor = function( $ele, maxh, flag ){
		
		if( $ele[ 0 ].scrollHeight > ( ( $( "#main" ).height() / 100 ) * maxh ) ){
			
			if( flag === true )_animateScroll();
			
			if( !$ele.hasClass( "drag scroll" ) )$ele.addClass( "drag scroll" );

		}else{
		
			$ele.removeClass( "drag scroll" );

		}

	}

	,_cursorToPage = function( flag ){
		
		_appendCursor( $( "#page .row.container" ), 83.5, flag );
		
	}

	,_cursorToHome = function( flag ){
		
		_appendCursor( $( "#home .row.container" ), 83.5, flag );
		
	}

	,_cursorToExplore = function( flag ){
		
		_appendCursor( $( "#explore .row.container" ), 83.5, flag );
		
	}

	,_cursorToReview = function( flag ){
		
		_appendCursor( $( "#toreview .row.container" ), 60.5, flag );
		
	}

	,_cursorToWatch = function( flag ){
		
		_appendCursor( $( "#towatch .row.container" ), 60.5, flag );
		
	}

	,_loadAllElements = function(){
		
		var allitems = $.Trimgle.getAllItems();

		$( "#page-list" ).html( "" );

		$.each( allitems, function( index, item ){

			var $newitem = $( "#proto_item" ).clone( true );

			$newitem.removeAttr( "id" ); 

			var myfav = item.favicon;

			if( !myfav || myfav == "" )myfav = "img/unknown.png";

			$newitem.find( "img.avatar" ).attr( "src", myfav );

			$newitem.find( ".content .header" ).text( _truncate( item.title, 20 ) );

			$newitem.find( ".content .header" ).attr( "href", item.page );

			$newitem.find( ".content .description" ).text( _truncate( item.description, 32 ) );

			$newitem.find( ".fast.stats" ).text( chrome.i18n.getMessage( "every" ) + " " + item.interval );

			$newitem.find( "i.explore" ).on( "click", function( ev ){

				$( "#explore" ).attr( "trimgle-item", item.addeded );

				$( "a.section.explorator" ).text( _truncate( item.title, 17 ) );

				$( "a.section.explorator" ).attr( "href", item.page );

				$( "#bullet-list" ).html( "" );

				$.each( item.newest, function( index, value ){

					var ele = ( value.link != "" && value.title != "" )
							  ? "<a href='" + value.link + "' target='_blank'>" + value.title + "</a>"
							  : ( value.text != "" ) ? value.text : ""
							  ;

					if( ele != "" )$( "#bullet-list" ).append( "<div class='item'>" + ele + "</div>" );

				} );

				_changePage( "#explore", function(){

					$( "#popup" ).attr( "cxx", "explore" );

				}, _cursorToExplore );

				ev.stopPropagation();

			} );

			$newitem.find( "i.options" ).on( "click", function( ev ){

				$( "#page-edit" ).attr( "trimgle-item", item.addeded );

				var screenshot = localStorage[ "screenshot:" + item.addeded ] || "img/unknown.screenshot.png";	

				$( "#page-edit-page" ).attr( "href", item.page );

				$( "img.screenshot" ).attr( "src", screenshot );

				$( "#page-edit-title" ).val( item.title );

				$( "#page-edit-desc" ).val( item.description );

				$("input[value='" + item.interval + "']").prop("checked", true);

				$( "#page-edit-webhook" ).val( item.pinglist.join( "\r\n" ) );

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

			$newitem.find( "i.remove" ).on( "dblclick", function( ev ){

				$( this ).popup( "hide" );	

				$.Trimgle.removeItem( item[ "#" ], function(){

					$newitem.remove();

				}, function(){

					alert( chrome.i18n.getMessage( "problem_inact" ) );

				} );

				ev.stopPropagation();

			} );

			$newitem.on( "mouseover", function(){

				$( this ).find( ".row.options" ).show();

			} ).on( "mouseleave", function(){

				$( this ).find( ".row.options" ).hide();

			} );

			$newitem.find( "i.remove" ).popup( {

				 position : "top left"

				,offset	  : -7

				,variation : "inverted"

				,hoverable : true

				,content  : chrome.i18n.getMessage( "ask_sure" )

				,target   : $newitem.find( "img.avatar" ).first()

			} );

			$( "#page-list" ).prepend( $newitem );

		} );

	}

	,_loadSettings = function( sets ){

		sets = sets || $.Trimgle.settings();

		if( !sets ){

			alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 100 )" );

			return false;

		}

		if( sets.notification == true ){

			$( ".icon.alarm" ).removeClass( "mute" );

		}else{

			if( !$( ".icon.alarm" ).hasClass( "mute" ) )$( ".icon.alarm" ).addClass( "mute" );			

		}

		$( "#about-anon-info" ).prop( "checked" , !( !sets.sendAnonInfo ) );

	}

	,_goHome = function(){

		_loadAllElements();

		_changePage( "#home", function(){

			$( "#popup" ).attr( "cxx", "home" );
			
			setTimeout( _cursorToHome, 100 );

		}, function(){
			
			_showNews();
			
		} );

	}

	,_autoPosition = function(){

		var allreviews = $.Trimgle.getAllReviews();

		if( allreviews.length > 0 )return _goReview();
		
		var allwatchs = $.Trimgle.getAllWatchs();

		if( allwatchs.length > 0 )return _goWatch();

		_goHome();

	}

	,_showNews = function(){
		
		var sets = $.Trimgle.settings();
		
		if( !sets || sets.lastNews === "" || sets.lastNews === sets.oldNews )return false;
		
		$( "#home h2.title" ).popup( {
			
			on : "manual"
			
			,position : "top center"
			
			,context : "#home"
			
			,exclusive : true 
			
			,closable : false

			,variation : "inverted"

			,hoverable : false

			,html  : chrome.i18n.getMessage( "popup_news" ) + " <a href='" + sets.lastNews + "' target='_blank' class='reset-news'>" + chrome.i18n.getMessage( "news" ) + "</a> !"
			
			,onShow : function(){
			
				$( ".reset-news" ).on( "click", function( ev ){
				
					sets.oldNews = sets.lastNews;
					
					$.Trimgle.settings( sets );
                    
                    ev.stopPropagation();
				
				} );
			
			}
			
		} ).popup( "show" ); 
		
	}

	,_noJobs = function( flag ){
				
		$( "#home h2.title" ).popup( {
			
			on : "manual"
			
			,position : "top center"
			
			,context : "#home"
			
			,exclusive : false
			
			,closable : false

			,variation : "inverted"

			,hoverable : false

			,content  : chrome.i18n.getMessage( "no_jobs" )
			
		} ).popup( flag );
				
	}
;









