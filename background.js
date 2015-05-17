/**
* Background job that creates an alarm to
* rotate against a set of choosen
* new tab generator chrome extensions.
* TODO : Time to rotate is fixed at 5 mins.
*
*/

// Fire an alarm every 5 mins.
chrome.alarms.create("newtab", {
    "delayInMinutes" : 1,
    "periodInMinutes" : 1
});


chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "newtab") {
        chrome.storage.sync.get(null, function(items) {
          //console.log(items);
          var len = items.length;
          var map = {};
          var list = [];
          for (var property in items) {
            if (items.hasOwnProperty(property)) {
                list.push(property.substr(14, property.length));
            }
          }

          for (var property in items) {
            if (items.hasOwnProperty(property)) {
                var currentId = property.substr(14, property.length);
                //console.log("Current id " + currentId);
                chrome.management.get(currentId, function(extensionInfo) {
                      //console.log(extensionInfo);
                      if (extensionInfo.enabled) {
                        var index = list.indexOf(extensionInfo.id);
                        var nextPos = (index + 1) % list.length;
                        var nextId = list[nextPos];
                        console.log("Enable : " + nextId + " Disable : " + extensionInfo.name);
                        chrome.management.setEnabled(extensionInfo.id, false);
                        chrome.management.setEnabled(nextId, true);
                      }
                });
            }
          }



        });
    }
});


