var bf = require('debug')('before'),
    bfe = require('debug')('beforeEach'),
    af = require('debug')('after'),
    afe = require('debug')('afterEach');
 
describe('Mocha test', function() {
  before(function() { bf('root'); });
  beforeEach(function() { bfe('root'); });
  after(function() { af('root'); });
  afterEach(function() { afe('root'); });
 
  describe('suite #1', function() {
    before(function() { bf('suite #1'); });
    beforeEach(function() { bfe('suite #1'); });
    after(function() { af('suite #1'); });
    afterEach(function() { afe('suite #1'); });
 
    it('test #1', function(){ });
    it('test #2', function(){ });
    it('test #3', function(){ });
  });
 
  describe('suite #2', function() {
    before(function() { bf('suite #2'); });
    beforeEach(function() { bfe('suite #2'); });
    after(function() { af('suite #2'); });
    afterEach(function() { afe('suite #2'); });
 
    it('test #4', function(){ });
    it('test #5', function(){ });
    it('test #6', function(){ });
 
    describe('suite #3', function() {
      before(function() { bf('suite #3'); });
      beforeEach(function() { bfe('suite #3'); });
      after(function() { af('suite #3'); });
      afterEach(function() { afe('suite #3'); });
 
      it('test #7', function(){ });
      it('test #8', function(){ });
      it('test #9', function(){ });
    });
  });
});