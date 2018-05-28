define(['jquery', 'angular'],
        function($, angular) {
    var loaded;
    
    var menuUrl = 'views/menu/' + app_config.type + '.json';
    
    function initMenuItems(menuItems, id) {
      
      for (var i = 0; i < menuItems.length; i++) {
        var item = menuItems[i];
        item.id = angular.copy(id);
        item.id.push(i);
        if (angular.isArray(item.sub)) {
          initMenuItems(item.sub, item.id);
        }
      }
      return menuItems;
    }
    
    var load = function(ok, fail) {
      if (angular.isUndefined(loaded)) {
        $.ajax({
          type:"GET",
          url: menuUrl,
          async: false,
          contentType:'application/json;charset=utf-8',
          dataType:'text',
          success: function(data, status) {
//            var json = $.parseJSON(data);
            var json = eval("(" + data + ")"); 
            loaded = initMenuItems(json, []);
            (ok || angular.noop)(loaded);
          },
          error: function(xhr, status) {
            $log.debug('error', xhr, status);
            (fail || angular.noop)(status);
          }
        });
      } else {
        (ok || angular.noop)(loaded);
      }
    };
    return load;
});