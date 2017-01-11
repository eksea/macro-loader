/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Megrez Lu <lujiajing1126@gmail.com>
*/

'use strict';

var loaderUtils = require('loader-utils');
var path = require('path');
var fs = require('graceful-fs');
var _ = require('lodash');

function Preprocessor(source,config) {
	this.source = source;
	this.config = config;
}

Preprocessor.prototype.processMacro = function() {
	this._processDefinedMacro();
	return this.source;
}

Preprocessor.prototype._processDefinedMacro = function() {
	// return ["match_str1","match_str2"]
	var resArr = this.source.match(/#ifdef(?:[\s\S]*?)#endif/gi);
	var self = this;
	var isSet = function(macro) {
		return self.config.indexOf(macro) > -1;
	};
	if(resArr) {
		_.each(resArr,function(str) {
			// has else
			if(/#else/.test(str)) {
				var tmp = str.match(/#ifdef (.*)\r?\n([\s\S]*?)\r?\n(?:#else\r?\n)([\s\S]*?)\r?\n#endif/i);
				var macroTest = tmp[1];
				self.source = self.source.replace(str,isSet(macroTest) ? tmp[2] : tmp[3]);
			} else {
				var tmp = str.match(/#ifdef (.*)\r?\n([\s\S]*?)\r?\n#endif/i);
				var macroTest = tmp[1];
				self.source = self.source.replace(str,isSet(macroTest) ? tmp[2] : "");
			}
		});
	}
}

module.exports = function(content) {
	this.cacheable && this.cacheable();
	var queryString = loaderUtils.parseQuery(this.query);
	var source = content;
	var opt = {
		file: queryString.config,
		processor: null,
		config: null
	};
	if(opt.file) {
		try {
			opt.config = JSON.parse(fs.readFileSync(opt.file));
		} catch(err) {
			throw new Error('Macro Preprocessor Error: [CONFIG FILE ERR]' + err);
		}
	}

	if(opt.config) {
		opt.processor = new Preprocessor(content,opt.config);
		source = opt.processor.processMacro();
	}

	return source;
}

module.exports._Preprocessor = Preprocessor;