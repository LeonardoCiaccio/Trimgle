if( !$ )throw new Error( "jQuery required" );
    
"use strict";

var 
	 urlNews = "https://gist.githubusercontent.com/LeonardoCiaccio/6bbf8c946eb978e5057d910896a5f62b/raw/"

	,_noticeNews = function(){

		var sets = $.Trimgle.settings();

		if( !sets ){

			alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 100 )" );

			return false;

		}

		if( !sets.notification )return false;

		chrome.notifications.create( "newelements", {

			 type	: "basic"

			,iconUrl: "img/icon.48.png"

			,title	: chrome.i18n.getMessage( "title_not_news" )

			,message: chrome.i18n.getMessage( "mex_not_news" )

			,requireInteraction : false

		 }, function( notificationId ){

		// --> http://soundbible.com/2158-Text-Message-Alert-5.html

			var mysound = new Audio( "audio/noty1.mp3" );

			mysound.volume = 0.2;
			
			mysound.play();

		});

	}

	,_noticeReviews = function(){

		var sets = $.Trimgle.settings();

		if( !sets ){

			alert( chrome.i18n.getMessage( "problem_inact" ) + " ( 100 )" );

			return false;

		}

		if( !sets.notification )return false;

		chrome.notifications.create( "newreviews", {

			 type	: "basic"

			,iconUrl: "img/icon.48.png"

			,title	: chrome.i18n.getMessage( "title_not_review" )

			,message: chrome.i18n.getMessage( "mex_not_review" )

			,requireInteraction : false

		 }, function( notificationId ){

		// --> http://soundbible.com/2155-Text-Message-Alert-2.html

			var mysound = new Audio( "audio/noty2.mp3" );

			mysound.volume = 0.2;

			mysound.play();

		});

	}
;








