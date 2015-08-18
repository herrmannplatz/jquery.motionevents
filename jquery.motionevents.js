(function($) {
  'use strict';

  var transitionEndEvent = 'transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd';
  var animationIterationEvent = 'animationiteration webkitAnimationIteration MSAnimationIteration oanimationiteration';
  var animationStartEvent = 'animationstart webkitAnimationStart MSAnimationStart oanimationstart';
  var animationEndEvent = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd';

  function validateTransition(property) {
    return function(e) {
      return property === e.originalEvent.propertyName;
    };
  }

  function validateAnimation(animation) {
    return function(e) {
      return animation === e.originalEvent.animationName;
    }
  }

  function on(elem, type, handler, validator) {
    $(elem).on(type, function wrappedHandler(e) {
      if (validator == null || validator(e)) {
        var isEventHandled = handler.call(this, arguments);
        if (isEventHandled === true) {
          $(this).off(type, wrappedHandler);
        }
      }
    });
  }

  function registerEvent(elem, event, handler, validator) {
    if (typeof handler === 'function') {
      return elem.each(function() {
        on(this, event, handler);
      });
    }

    if (typeof handler === 'object') {
      return elem.each(function() {
        for (var property in handler) {
          on(this, event, handler[property], validator(property));
        }
      });
    }
  }

  $.fn.extend({

    transitionend: function(handler) {
      registerEvent(this, transitionEndEvent, handler, validateTransition);
    },

    animationstart: function(handler) {
      registerEvent(this, animationStartEvent, handler, validateAnimation);
    },

    animationiteration: function(handler) {
      registerEvent(this, animationIterationEvent, handler, validateAnimation);
    },

    animationend: function(handler) {
      registerEvent(this, animationEndEvent, handler, validateAnimation);
    }

  });

}(jQuery));
