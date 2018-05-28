define(['angular', 'app'], function(angular, app) {
  'use strict';
  app.filter('orderType', function($log) {
    return function(input) {
      var orderTypes = {'NORMAL':'일반','SHARE':'공유'};
      return orderTypes[input];
    };
  });
  app.filter('loadMethod', function($log) {
      return function(input) {
        var loadMethods = ['', '지게차','수작업','호이스트','크레인','컨베이어'];
        return loadMethods[input];
      };
  });
  app.filter('paymentType', function($log) {
    return function(input) {
      var paymentTypes = ['인수증','선/착불','수수료'];
      return paymentTypes[input];
    };
  });
  app.filter('carType', function($log) {
    return function(input) {
      var carTypes = ['카고','라보','다마스', '윙바디', '탑', '축카고', '초장축', '호루', 
                      '냉동탑', '풀러스카', '풀축카고', '윙축', '리프트', '플러스윙', 
                      '리프트윙', '풀축윙', '냉장원', '냉장윙축'];
      return carTypes[input];
    };
  });
  app.filter('ox', function($log) {
    return function(input) {
      var types = ['X', 'O'];
      return types[input];
    };
  });
  
  app.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                city = value.slice(0, 3);
                number = value.slice(3);
                number = number.slice(0, 3) + '-' + number.slice(3);
                break;
            case 11: // +CPPP####### -> CCC (PP) ###-####
                city = value.slice(0, 3);
                number = value.slice(3);
                number = number.slice(0, 4) + '-' + number.slice(4);
                break;
            default:
                return tel;
        }

        if (country === 1) {
            country = "";
        }

        return   city + "-" + number;
    };
  });

});
