define(['app'], function(app){
  
app.factory('api/goods/resources', function(WrappedRestApi, RestApi, $log) {
    var goodsCategories = RestApi.all('goodsCategories');
    var goodsCategoriesOne = WrappedRestApi.one('goodsCategories');
    var goods = RestApi.all('goods');
    var goodsOne = RestApi.one('goods');
    
    return {
      // 화물정보 
      getGoods : function(param, ok, fail) {
        goods.one(''+param.id).get(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('fail response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 위치 검색
      findGoodsCategories : function(param, ok, fail) {
        $log.debug("findGoodsCatecory : ", param);
        goodsCategories.all("find").getList(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
    };
  });
});