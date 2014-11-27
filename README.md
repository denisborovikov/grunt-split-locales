# grunt-split-locales

> Split css file into separate files by css selector html[lang="locale"].

E.g. you have a css file with common styles and locales specific styles:

```css
.reset {
  marign: 0
}

.common-style {
  color: #333;
}

html[lang="de"] .common-style {
  color: yellow;
}

html[lang="ru"] .common-style {
  color: red;
  font-weight: bold;
}
```

In this case plugin produces 3 files: one with common styles and one for each of locales in the source file. `html[lang]` will be removed from selectors.

common.css:

```css
.reset {
  marign: 0
}

.common-style {
  color: #333;
}
```

de.css:

```css
.common-style {
  color: yellow;
}
```

ru.css:

```css
.common-style {
  color: red;
  font-weight: bold;
}
```

It works with media queries as well.


## SCSS mixin usage example

If you use SCSS you can use mixin like this:

```scss
@mixin locale($locale) {
  @if type_of($locale) == list {
    @each $lang in $locale {
      html[lang="#{$lang}"] & {
        @content;
      }
    }
  } @else {
    html[lang="#{$locale}"] & {
      @content;
    }
  }
}
```

Usage example:

```scss
.class {
  width: 475px;

  @include locale(de) {
    height: 430px;
  }

  @include locale(ru) {
    height: 410px;
  }

  @include locale(it fr es) {
    height: 415px;
  }
}
```

Output:

```css
.class {
  width: 475px;
}

html[lang="de"] .class {
  width: 430px;
}

html[lang="ru"] .class {
  width: 410px;
}

html[lang="it"] .class {
  width: 415px;
}

html[lang="fr"] .class {
  width: 415px;
}

html[lang="es"] .class {
  width: 415px;
}
```

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-split-locales --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-split-locales');
```

## The "split_locales" task

### Overview
In your project's Gruntfile, add a section named `split_locales` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  split_locales: {
    your_target: {
      // Target-specific file lists.
    },
  },
});
```

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  split_locales: {
    options: {},
    files: {
      'dest/common.css': ['src/typography.css', 'src/forms.css'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 27.11.2014   Initial commit
