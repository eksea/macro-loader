var assert = require('assert');
var lib = require('../index.js');
var Preprocessor = lib._Preprocessor;

describe('Preprocessor', function() {
  var singleMacroFileWithElseStr = "#ifdef REACT_NATIVE\nimport React, { Component, PropTypes } from 'react-native'\n#else\nimport React, { Component, PropTypes } from 'react'\n#endif";
  var singleMacroFileWithoutElseStr = "#ifdef REACT_NATIVE\nimport React, { Component, PropTypes } from 'react-native'\n#endif";
  var configWithRN = ["REACT_NATIVE"];
  var configWithoutRN = [];
  var processor_single_else_withRN;
  var processor_single_else_withoutRN;
  var processor_single_withRN;
  var processor_single_withoutRN;
  describe('correctiness tests', function () {
  	beforeEach(function() {
    	processor_single_else_withRN = new Preprocessor(singleMacroFileWithElseStr,configWithRN);
    	processor_single_else_withoutRN = new Preprocessor(singleMacroFileWithElseStr,configWithoutRN);
    	processor_single_withRN = new Preprocessor(singleMacroFileWithoutElseStr,configWithRN);
    	processor_single_withoutRN = new Preprocessor(singleMacroFileWithoutElseStr,configWithoutRN);
    });
    it('should return Positive result for single macro with else in file', function () {
      assert.equal(processor_single_else_withRN.processMacro(), "import React, { Component, PropTypes } from 'react-native'");
    });
    it('should return Negative result for single macro with else in file', function() {
      assert.equal(processor_single_else_withoutRN.processMacro(), "import React, { Component, PropTypes } from 'react'");
    });
    it('should return empty string for single macro without else in file', function() {
      assert.equal(processor_single_withoutRN.processMacro(), "");
    });
    it('should return wrapped string for single macro without else in file', function() {
      assert.equal(processor_single_withRN.processMacro(), "import React, { Component, PropTypes } from 'react-native'");
    });
  });
});