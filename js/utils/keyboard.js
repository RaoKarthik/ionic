(function(ionic) {

ionic.Platform.ready(function() {
  if (ionic.Platform.is('android')) {
    androidKeyboardFix();
  }
});

function androidKeyboardFix() {
        document.body.addEventListener('scrollChildIntoView', console.info.bind(console, 'scrollIntoView'));
  var rememberedDeviceWidth = window.innerWidth;
  var rememberedDeviceHeight = window.innerHeight;
  var keyboardHeight;
  window.addEventListener('resize', function(e) {
    //setTimeout so window.innerHeight has time to recalculate
    resize();
  });
  function resize() {
    document.body.classList.remove('hide-footer');
    if (rememberedDeviceWidth !== window.innerWidth) {
      //width changes? Orientation change!
      rememberedDeviceWidth = window.innerWidth;
      rememberedDeviceHeight = window.innerHeight;
      console.info('orientation change. deviceWidth =', rememberedDeviceWidth,
                  ', deviceHeight =', rememberedDeviceHeight);

    } else if (rememberedDeviceHeight !== window.innerHeight) {
      //height changes? Keyboard change!
      if (window.innerHeight < rememberedDeviceHeight) {
        //Wait for next frame so activeElement can catch up
        window.rAF(function() {
          //keyboard opens
          keyboardHeight = rememberedDeviceHeight - window.innerHeight;

          document.body.classList.add('hide-footer');

          //Wait for activeElement to get registered
          var activeEl = document.activeElement;
          if (activeEl) {
            //This event is caught by the nearest parent scrollView of the activeElement
            ionic.trigger('scrollChildIntoView', {
              target: activeEl,
              keyboardHeight: keyboardHeight,
              deviceHeight: window.innerHeight
            }, true);
          }
        }, 16);
      }
    }
  }
}

})(window.ionic);
