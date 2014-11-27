/*
 * grunt-split-locales
 * https://github.com/Metaller/grunt-split-locales
 *
 * Copyright (c) 2014 Denis Borovikov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('split_locales', 'Split css file into separate files by css selector html[lang="locale"].', function() {
    var options,
        rules,
        rule,
        sheets = {},
        i,
        css,
        path;

    options = this.options({
    });

    css = require('css');
    path = require('path');

    // Separate styles by locales
    function splitBySheets(locale, node) {
      if (sheets[locale]) {
        sheets[locale].stylesheet.rules = sheets[locale].stylesheet.rules.concat(node);
      } else {
        sheets[locale] = {
          type      : 'stylesheet',
          stylesheet: {
            rules: [node]
          }
        };
      }
    }

    // Check if current rule contains locale selector html[lang='locale_name'].
    // If so, remove html[lang] from css selector, return rule as object
    // containing locale code and rule itself.
    // Otherwise return false.
    function getRuleByLocale(rule) {
      var re = /html\[lang=['"]{0,1}(.[a-z-]+?)['"]{0,1}\][\s\S]{0,1}/i,
          match = re.exec(rule.selectors);

      if (match != null) {
        var locale = match[1];

        // Remove html[lang] from the selector
        for (var j = 0; j < rule.selectors.length; j++) {
          rule.selectors[j] = rule.selectors[j].replace(re, '');
        }

        return {
          locale: locale,
          rule  : rule
        };
      }

      return false;
    }

    function splitRules(rule) {
      var localeRule,
          query = rule.media;

      if (query) {
        // Current rule is media node with an own list of rules
        var media = {};

        // Process each rule separately
        for (var j = 0; j < rule.rules.length; j++) {
          localeRule = getRuleByLocale(rule.rules[j]);

          if (!localeRule) {continue;}

          // Add current rule to separated media node for each locale
          if (media[localeRule.locale]) {
            media[localeRule.locale].rules = media[localeRule.locale].rules.concat(localeRule.rule);
          } else {
            media[localeRule.locale] = {
              type : 'media',
              media: query,
              rules: [localeRule.rule]
            };
          }

          // Remove rule from the original set
          rule.rules.splice(j--, 1);
        }

        // Add just created media nodes to the corresponding locale sheet
        for (var locale in media) {
          splitBySheets(locale, media[locale]);
        }

      } else {
        // Curent rule is a single css rule
        localeRule = getRuleByLocale(rule);

        if (!localeRule) {return;}

        // Add rule to the corresponding locale sheet
        splitBySheets(localeRule.locale, localeRule.rule);

        // Remove rule from the original set
        rules.splice(i--, 1);
      }
    }

    function splitLocales(filepath, files) {
      var source = grunt.file.read(filepath);
      var obj = css.parse(source, {source: filepath});

      rules = obj.stylesheet.rules;

      for (i = 0; i < rules.length; i++) {
        rule = rules[i];

        splitRules(rule);
      }

      for (var locale in sheets) {
        var filename = path.dirname(files.dest) + path.sep + locale + '.css';
        grunt.file.write(filename, css.stringify(sheets[locale]));

        grunt.log.writeln('File "' + filename + '" created.');
      }

      return css.stringify(obj);
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(files) {

      var output = files.src.map(function(filepath){
        return splitLocales(filepath, files);
      }).join('\n\n');

      grunt.file.write(files.dest, output);
      // Print a success message.
      grunt.log.writeln('File "' + files.dest + '" created.');
    });
  });

};
