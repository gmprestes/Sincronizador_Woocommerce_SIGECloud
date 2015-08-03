_SIGE = {
  Lancar: false
};
_Woocommerce = {
  URL: '',
  CK: '',
  CS: '',
  SSL: false
};

function CtrlSIGE($scope) {
  var db = new LinvoDB("DadosSIGE", { })

  $scope.SIGE = {};

  $scope.init = function() {
    db.findOne({}, function(err, doc) {
      $scope.SIGE = doc;
      _SIGE = $scope.SIGE;

      $scope.$apply();
    });
  }

  $scope.save = function() {

    db.save($scope.SIGE, function(err, docs) {});

    _SIGE = $scope.SIGE;
    alert("Dados salvos");
  }

  $scope.init();

}

function CtrlWoocomerce($scope) {
  var db = new LinvoDB("DadosWoocommerce", { })

  $scope.Woocommerce = {};

  $scope.init = function() {
    db.findOne({}, function(err, doc) {
      $scope.Woocommerce = doc;
      _Woocommerce = $scope.Woocommerce;
      $scope.$apply();

    });
  }

  $scope.save = function() {
    db.save($scope.Woocommerce, function(err, docs) {});
    _Woocommerce = $scope.Woocommerce;
    alert("Dados salvos");
  }

  $scope.init();
}
