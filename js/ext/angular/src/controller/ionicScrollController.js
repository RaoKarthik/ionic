(function() {
'use strict';

angular.module('ionic.ui.scroll')

.controller('$ionicScroll', ['$scope', 'scrollViewOptions', '$timeout',
                     function($scope,   scrollViewOptions,   $timeout) {

  scrollViewOptions.bouncing = angular.isDefined(scrollViewOptions.bouncing) ?
    scrollViewOptions.bouncing :
    !ionic.Platform.isAndroid();

  var self = this;

  var element = this.element = scrollViewOptions.el;
  var scrollView = this.scrollView = new ionic.views.Scroll(scrollViewOptions);

  this.$element = angular.element(element);

  //Attach self to element as a controller so other directives can require this controller
  //through `require: '$ionicScroll'
  this.$element.data('$$ionicScrollController', this);

  window.addEventListener('resize', resize);
  $scope.$on('$destroy', function() {
    window.removeEventListener('resize', resize);
  });
  function resize() {
    scrollView.resize();
  }

  $timeout(function() {
    scrollView.run();

    self.refresher = element.querySelector('.scroll-refresher');

    // Activate pull-to-refresh
    if(self.refresher) {
      var refresherHeight = self.refresher.clientHeight || 0;
      scrollView.activatePullToRefresh(refresherHeight, function() {
        self.refresher.classList.add('active');
      }, function() {
        self.refresher.classList.remove('refreshing');
        self.refresher.classList.remove('active');
      }, function() {
        self.refresher.classList.add('refreshing');
        $scope.onRefresh && $scope.onRefresh();
        $scope.$parent.$broadcast('scroll.onRefresh');
      });
    }
  });

}]);

})();
