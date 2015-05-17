var myApp = angular.module('myApp',[]);

myApp.controller('ListController', ['$scope', function($scope) {

  $scope.list = [];
  $scope.addedList = [];

  $scope.updateList = function() {
    chrome.management.getAll(function (arr) {
        for(var i = 0; i < arr.length; i++) {
            // console.log(arr[i]);
            $scope.$apply(function () {
                    $scope.list.push({"name" : arr[i].name, "enabled" : arr[i].enabled, "id" : arr[i].id});
                });
            }
        });
  };

  $scope.updateAddedList = function() {
    $scope.addedList = [];
    chrome.storage.sync.get(null, function(items) {
        for (var property in items) {
            if (items.hasOwnProperty(property)) {
                var name = property.substr(14, property.length);
                $scope.$apply(function() {
                    $scope.addedList.push({"name" : items[property]});
                });
            }
        }
    });
    $scope.initialize();
  }


  $scope.initialize = function() {
    // Initialization step.
    // Handle the case if all extension are disabled to begin with
    // or more than one are enabled in the beginning.
    // Just have one enabled at the start.
    chrome.storage.sync.get(null, function(items) {

        var lastExtensionId = "";
        for (var property in items) {
          if (items.hasOwnProperty(property)) {
              var currentId = property.substr(14, property.length);
              chrome.management.get(currentId, function(extensionInfo) {
                    if (extensionInfo.enabled) {
                      chrome.management.setEnabled(extensionInfo.id, false);
                    }
                    lastExtensionId = currentId;
              });
          }
        }

        // Enable one of them. (the last one.)
        if (lastExtensionId != "")
            chrome.management.setEnabled(lastExtensionId, true);
    });
  }


  $scope.updateList();
  $scope.updateAddedList();

  var keys = [];
  var namespace = "random-newtab";

  $scope.save = function(rawId, value) {
    var id = namespace + ":" + rawId;
    console.log("Save id : " + id);
    var json = {};
    json[id] = value;
    chrome.storage.sync.set(json, function() {
          // Notify that we saved.
          console.log('Save call success ' + id + " : " + value);
        });
        $scope.updateAddedList();
  }

  $scope.remove = function(rawId) {
    var id = namespace + ":" + rawId;
    console.log("Remove id : " + id);
    var json = {};
    json[id] = false;
    chrome.storage.sync.remove(id, function() {
          // Notify that we saved.
          console.log('Remove call success ' + id);
        });
        $scope.updateAddedList();
  }

}]);
