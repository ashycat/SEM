
define(['angular', 'app', 'services/menuloader'], function(angular, app, loader) {
  'use strict';
  app.factory('menu', function($location, $urlMatcherFactory) {
    var loaded;
    function initMenuItems(items) {
        angular.forEach(items, function(item) {
            if (angular.isDefined(item.url) && item.url !== null) {
                item.matcher = $urlMatcherFactory.compile(item.url);
            }
            if (angular.isArray(item.sub)) {
                initMenuItems(item.sub);
            }
        });
        return items;
    }
    function load(ok, fail) {
        if (angular.isUndefined(loaded)) {
            loader(function(data) {
                loaded = initMenuItems(data);
                (ok || angular.noop)(loaded);
            }, (fail || angular.noop));
        } else {
            (ok || angular.noop)(loaded);
        }
    }
    
    function matchPath(item) {
        if (item.url && angular.isDefined(item.matcher)) {
            return item.matcher.exec($location.path(), $location.search());
        } else {
            return false;
        }
    }
    
    function findMenuItem(id) {
        var menuItems = loaded;
        var item;
        for (var i = 0; i < id.length; i++) {
            item = menuItems[id[i]];
            menuItems = item.sub;
        }
        return item;
    }
    function match(id, withSub) {
        var menuItem = findMenuItem(id);
        if (angular.isUndefined(menuItem)) {
            return false;
        }
        var matched = matchPath(menuItem);
        console.log('matched',matched);
        if (!matched && withSub && angular.isArray(menuItem.sub)) {
            for (var i = 0; i < menuItem.sub.length; i++) {
                if (match(menuItem.sub[i].id, withSub)) {
                    return true;
                }
            }
        }
        return matched;
    }
    
    function currentPath(ok, fail) {
        function matchingItem(items) {
            for (var i = 0; i < items.length; i++) {
                if (matchPath(items[i])) {
                    return items[i];
                }
                if (angular.isArray(items[i].sub)) {
                    var sub = matchingItem(items[i].sub);
                    if (sub !== null) {
                        return sub;
                    }
                }
            }
            return null;
        }
        load(function(items) {
            var item = matchingItem(items);
            if (item === null) {
                (fail || angular.noop)();
            } else {
                var id = item.id;
                var path = [];
                for (var i = 0; i < id.length; i++) {
                    path.push(items[id[i]]);
                    items = items[id[i]].sub;
                }
                (ok || angular.noop)(path);
            }
        }, fail);
    }
    
    return {
        get: load,
        match: match,
        currentPath: currentPath
    };
  });
});