:: Package Release ------------------------------------------------------------------------------------------------

xcopy "Extension\_locales" "Release\_locales"  /S /E /K /I /Y
xcopy "Extension\audio" "Release\audio"  /S /E /K /I /Y
xcopy "Extension\css" "Release\css"  /S /E /K /I /Y
xcopy "Extension\img" "Release\img"  /S /E /K /I /Y

xcopy "Extension\js\permission.min.js" "Release\js\permission.min.js" /Y
xcopy "Extension\js\popup\translate.min.js" "Release\js\popup\translate.min.js" /Y
xcopy "Extension\js\popup\popup.min.js" "Release\js\popup\popup.min.js" /Y
xcopy "Extension\js\popup\observe.min.js" "Release\js\popup\observe.min.js" /Y
xcopy "Extension\js\popup\global.min.js" "Release\js\popup\global.min.js" /Y
xcopy "Extension\js\popup\chrome.runtime.onMessage.min.js" "Release\js\popup\chrome.runtime.onMessage.min.js" /Y

xcopy "Extension\js\background\background.min.js" "Release\js\background\background.min.js" /Y
xcopy "Extension\js\background\global.min.js" "Release\js\background\global.min.js" /Y
xcopy "Extension\js\background\chrome.runtime.onMessage.min.js" "Release\js\background\chrome.runtime.onMessage.min.js" /Y
xcopy "Extension\js\background\chrome.browserAction.min.js" "Release\js\background\chrome.browserAction.min.js" /Y
xcopy "Extension\js\background\chrome.contextMenus.min.js" "Release\js\background\chrome.contextMenus.min.js" /Y
xcopy "Extension\js\background\chrome.runtime.min.js" "Release\js\background\chrome.runtime.min.js" /Y
xcopy "Extension\js\background\last.news.min.js" "Release\js\background\last.news.min.js" /Y
xcopy "Extension\js\background\inject.newtext.min.js" "Release\js\background\inject.newtext.min.js" /Y
xcopy "Extension\js\background\inject.newtext.collection.min.js" "Release\js\background\inject.newtext.collection.min.js" /Y
xcopy "Extension\js\background\inject.newlink.min.js" "Release\js\background\inject.newlink.min.js" /Y
xcopy "Extension\js\background\inject.newlink.collection.min.js" "Release\js\background\inject.newlink.collection.min.js" /Y
xcopy "Extension\js\background\inject.newjson.min.js" "Release\js\background\inject.newjson.min.js" /Y
xcopy "Extension\js\background\inject.newexpert.min.js" "Release\js\background\inject.newexpert.min.js" /Y

xcopy "Extension\lib\trimgle.min.js" "Release\lib\trimgle.min.js" /Y
xcopy "Extension\lib\vanilla.kinetic.min.js" "Release\lib\vanilla.kinetic.min.js" /Y
xcopy "Extension\lib\localdb.min.js" "Release\lib\localdb.min.js" /Y
xcopy "Extension\lib\lie.min.js" "Release\lib\lie.min.js" /Y
xcopy "Extension\lib\jquery.scrollTo.min.js" "Release\lib\jquery.scrollTo.min.js" /Y
xcopy "Extension\lib\jquery.min.js" "Release\lib\jquery.min.js" /Y
xcopy "Extension\lib\jqPath.min.js" "Release\lib\jqPath.min.js" /Y
xcopy "Extension\lib\j2h.min.js" "Release\lib\j2h.min.js" /Y
xcopy "Extension\lib\google.analitics.min.js" "Release\lib\google.analitics.min.js" /Y
xcopy "Extension\lib\crypto-js.min.js" "Release\lib\crypto-js.min.js" /Y
xcopy "Extension\lib\semantic.min.js" "Release\lib\semantic.min.js" /Y

xcopy "Extension\background.min.html" "Release\background.min.html" /Y
xcopy "Extension\popup.min.html" "Release\popup.min.html" /Y
xcopy "Extension\manifest.json" "Release\manifest.json" /Y





