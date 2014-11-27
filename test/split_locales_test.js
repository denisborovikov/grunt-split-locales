'use strict';

var grunt = require('grunt');

exports.split_locales = {
  default_options: function(test) {
    test.expect(5);

    var files = ['de', 'es', 'it', 'ru', 'target'];

    for (var i = 0; i < files.length; i++) {
      var obj = files[i];

      var actual = grunt.file.read('tmp/' + files[i] + '.css');
      var expected = grunt.file.read('test/expected/' + files[i] + '.css');
      test.equal(actual, expected, files[i] + '.css is not match.');
    }

    test.done();
  }
};
