angular.module('sharingButton').directive('attributeAdd', function() {
  return {
    restrict: 'A',
    scope: {
      attributeAdd: '=',
    },
    link: function(scope, element, attrs) {
      scope.$watch("attributeAdd", function(attributes) {
        for (attr in attributes) {
          if (attributes[attr].length == 0) {
            element.removeAttr(attr);
          }
          else {
            element.attr(attr, attributes[attr]);
          }
        }
      });
    }
  };
});

angular.module('sharingButton').directive('fromTextArea', [ '$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            mode     : '@',
            content  : '='
        },
        link: function (scope, element, attrs, ngModel) {
            var editor = CodeMirror.fromTextArea(element[0], {
                lineNumbers: true,
                lineWrapping: true,
                mode: scope.mode,
                readOnly: true,
                showCursorWhenSelecting: true,
            });
            scope.$watch("content", function(attributes) {
              if (typeof scope.content !== 'undefined') {
                editor.setValue(scope.content);
              }
            });
        }
    };
}]);