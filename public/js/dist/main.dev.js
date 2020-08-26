"use strict";

var app = angular.module("app", []);
app.controller("page-handler", ['$scope', '$http', function ($scope, $http) {
  // Request Functions
  var request = {}; // Data handle functions

  var handle = {}; // Scope content (data) Container

  var content = {};
  var build = {};
  var admin = {};
  var options = {};
  var inArrayValues = [];

  admin.inArray = function (value, array) {
    inArrayValues = inArrayValues.concat(array);
    return array.includes(value);
  };

  admin.notInAllArray = function (value) {
    return !inArrayValues.includes(value);
  };

  admin.getObjectKeys = function (obj) {
    return Object.keys(obj);
  };

  admin.tableMassCheck = function (model) {
    content[model].table.forEach(function (rec) {
      rec.tmp = {
        checked: !options.tableMassCheck || false
      };
    });
  };

  admin.tableMassActive = function (model, value) {
    content[model].table.forEach(function (rec) {
      if (rec.tmp && rec.tmp.checked) admin.active(model, rec, value);
    });
    options.tableMassCheck = false;
  };

  admin.tableMassDelete = function (model, value) {
    var ans = confirm('~~~ Προσοχή! ~~~\nΔιαδικασία μαζικής Διαγραφής…\nΕίστε σίγουρος ότι θέλετε να διαγράψετε ΟΡΙΣΤΙΚΑ τις επιλεγμένες εγγραφές;');

    if (ans) {
      content[model].table.forEach(function (rec) {
        if (rec.tmp && rec.tmp.checked) admin.deleteByid(model, rec, false);
      });
      options.tableMassCheck = false;
    }
  };

  admin.active = function (model, rec, forse) {
    if (forse != null) rec.active = forse;else rec.active = !rec.active;
    return admin.updateByid(model, rec);
  };

  admin.addOrder = function (model, rec, value) {
    rec.order = parseInt(rec.order || 0) + parseInt(value);
    return admin.updateByid(model, rec);
  };

  admin.setSort = function (col) {
    if (options.sort.name == col) options.sort.reverse = !options.sort.reverse;else options.sort = {
      name: col,
      reverse: false
    };
  };

  admin.getPages = function (len, lim) {
    var ret = [];
    var l = 0;
    l = Math.ceil(len / lim);

    for (var i = 0; i < l; i++) {
      console.log("try to: " + lim * i);
      ret[i] = lim * i;
    }

    return ret;
  };

  admin.updateByid = function (model, rec) {
    var redirect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    rec.tmp = {
      disabled: true
    };
    if (rec.password == null || rec.password == '') delete rec.password;
    return $http.patch('/api/' + model + '/' + rec._id, {
      data: rec
    }).then(function (resp) {
      if (!resp.data.doc) return console.log('Error: Update Return emty doc');
      if (redirect) return window.location.href = "/administrator/" + model;
      return $scope.content[model].table.forEach(function (e, i) {
        if (e._id == resp.data.doc._id) {
          resp.data.doc.tmp = {
            disabled: false
          };
          $scope.content[model].table[i] = resp.data.doc;
        }
      });
    }, function (error) {
      lo;
      console.log(error);
    });
  };

  admin.deleteByid = function (model, rec) {
    var inform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    rec.tmp = {
      disabled: true
    };
    var ans = true;
    if (inform) ans = confirm('~~~ Προσοχή! ~~~\nΔιαδικασία Διαγραφής…\nΕίστε σίγουρος ότι θέλετε να διαγράψετε ΟΡΙΣΤΙΚΑ αυτήν την εγγραφή;');
    if (ans) return $http["delete"]('/api/' + model + '/' + rec._id).then(function (resp) {
      $scope.content[model].table.forEach(function (e, i) {
        if (e._id == rec._id) $scope.content[model].table.splice(i, 1);
      });
    }, function (error) {
      console.log(error);
    });else rec.tmp = {
      disabled: false
    };
  };

  request.edit = function (model, _id) {
    try {
      $http.post('/api/' + model + '/' + _id).then(function (resp) {
        if (resp.data) return handle.edit(model, resp.data);
        return handle.error(model, 'edit', resp);
      }, function (error) {
        console.log(error);
        return handle.error(model, 'table', error);
      });
    } catch (error) {
      console.log(error);
    }
  };

  request.table = function (model) {
    try {
      $http.post('/api/' + model).then(function (resp) {
        $scope.options = {
          sort: {
            name: 'order',
            reverse: false
          },
          limit: {
            limit: 100,
            begin: 0
          }
        };
        if (resp.data) return handle.table(model, resp.data);
        return handle.error(model, 'table', resp);
      }, function (error) {
        console.log(error);
        return handle.error(model, 'table', error);
      });
    } catch (error) {
      console.log(error);
    }
  };

  request.list = function (model) {
    try {
      $http.get('/api/' + model).then(function (resp) {
        if (resp.data) return handle.list(model, resp.data);
        return handle.error(model, 'list', resp);
      }, function (error) {
        console.log(error);
        return handle.error(model, 'list', error);
      });
    } catch (error) {
      console.log(error);
    }
  };

  handle.list = function (model, data) {
    try {
      if (!data.status) return handle.error(model, 'list', data);
      if (!data.doc) return handle.error(model, 'list', data);
      if (!content[model]) content[model] = {};
      content[model].list = data.doc;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  handle.table = function (model, data) {
    try {
      if (!data.status) return handle.error(model, 'table', data);
      if (!data.doc) return handle.error(model, 'table', data);
      if (!content[model]) content[model] = {};
      content[model].table = data.doc;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  handle.edit = function (model, data) {
    try {
      if (!data.status) return handle.error(model, 'edit', data);
      if (!data.doc) return handle.error(model, 'edit', data);
      if (!content[model]) content[model] = {};
      content[model].edit = data.doc;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }; //#################################


  handle.error = function (model, data) {
    try {} catch (error) {
      console.log(error);
    }
  }; //#####################################


  build.defimgsrc = function (model, rec) {
    return '/upload/images/' + model + "/" + rec._id + "/" + rec.images[0].filename;
  };

  $scope.request = request;
  $scope.handle = handle;
  $scope.content = content;
  $scope.build = build;
  $scope.admin = admin;
  $scope.options = options;
}]);