'use strict';

var expect = require('chai').expect;
var spawn = require('child_process').spawn;

describe('Running slint', function () {

  it('should return an exit code 0 if valid', function (done) {
    var slint = spawn('node', ['./bin/slint', 'test/swaggers/good.json']);

    slint.on('close', function (code) {
      expect(code).to.equal(0);
      done();
    });
  });

  // nodejs error thrown overwrites status code
  it('should return a non-zero exit code if invalid', function (done) {
    var slint = spawn('node', ['./bin/slint', 'INVALID\ FILE']);

    slint.on('close', function (code) {
      expect(code).to.not.equal(0);
      done();
    });
  });

  it('should display usage if not given a swagger file', function (done) {
    var slint = spawn('node', ['./bin/slint']);
    var output;

    slint.stdout.on('data', function (data) {
      output = data.toString('utf8');
    });

    slint.on('close', function (code) {
      expect(output).to.contain('Usage:');
      done();
    });
  });

  it('should display help if given the --help option', function (done) {
    var slint = spawn('node', ['./bin/slint', '--help']);

    slint.stdout.on('data', function (data) {
      var output = data.toString('utf8');

      expect(output).to.contain('Usage:');
      done();
    });
  });

  it('should display the version if given the --version option', function (done) {
    var slint = spawn('node', ['./bin/slint', '--version']);

    slint.stdout.on('data', function (data) {
      var output = data.toString('utf8');

      expect(output).to.match(/^\d+\.\d+\.\d+/);
      done();
    });
  });

  it('should display errors if present', function (done) {
    var slint = spawn('node', ['./bin/slint', './test/swaggers/error.json']);
    var output;

    slint.stdout.on('data', function (data) {
      output += data.toString('utf8');
    });

    slint.on('close', function (code) {
      expect(output).to.contain('Errors found');
      done();
    });
  });

  it('should display warnings if present', function (done) {
    var slint = spawn('node', ['./bin/slint', './test/swaggers/warning.json']);
    var output;

    slint.stdout.on('data', function (data) {
      output += data.toString('utf8');
    });

    slint.on('close', function (code) {
      expect(output).to.contain('Warnings found');
      done();
    });
  });
});
