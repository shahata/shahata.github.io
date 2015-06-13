# Wix Style

## Description 

This project unifies and gathers all of wix common styling patterns & components (colors, fonts, sizes, components, icons). It enables developers to use a simple styling library (without having to re-invent it in each project) and prevents code/styling duplication.

You can watch the [live demo page](http://wix.github.io/wix-style/dist/ "Live demo page") to get a glimpse.

## Requirements


[**wix-angular**](https://github.com/wix/wix-angular) stack that includes: sass, compass & bower. It will ensure that you use all components properly including the svg-icon-font.


## Installation

#####Go to the main directory of your project in terminal and run:

	bower install wix-style --save 

#####In your main SCSS file (main.scss, style.scss, etc) import wix-style project:

	@import "../bower_components/wix-style/dist/styles/sass/style";
	
You can add the import statement at the top of your documents for several reasons:

1. You can (It is not dependent on any other line).
2. You will use all of its features from the beginning.
3. You can override variables and mixins if you really must (not recommended at all)

**Important Note:** Pay attention that it is important that the directory structure will remain as follow:

1. bower component: `app/bower_component/wix-style`
2. your main sass file: `app/styles/main.scss`

## Helvetica Support

Regardless of wix-style project, in order to receive the proper fonts you are required to import helvetica fontFace via simple css. In case you don't have it in your code yet add this line at the `<head>` section (you can add it where you want but it is recommended to add it before you CSS files):
	
	<link rel="stylesheet" href="http://static.parastorage.com/services/third-party/fonts/Helvetica/fontFace.css">

## Where can I see a live demo?

You can see a demo page with all the project features under this link:
	
	app/bower_components/wix-style/dist/index.html

## How do I check all is working as expected?

Follow these 3 steps to see that wix-style is working for you:

1) **Variables** - add these variables in you main.scss file and see that your sass compiles.


	body {
	  font-family: $wix-helvetica-35;
	  font-size: $wix-font-size-page-header;
	  color: $wix-color-premium
	}
	
2) **buttons** - create a button or link in html and see that it is styled and designed.

	<a href="#" class="btn-default">This is a button<a/>
3) **SVG font** - add the following class to one of your elements

	<i class="wix-svg-font-icons-arrow-top"></i>
	
If you're done with these 3 steps it looks like you're all set and ready to go.

## Configuration variables

Project have various ways to configure wix-styles:

1) `$enable-wix-style-css` (default: true) - when false wix-style will add ANY css to your project. This is good practice when you use wix-style multiple times in the same project and you don't get the css from multiple files. (my-account for example).

2) `$wix-style-project-wrapper-selector (default: nil)` - when set to a string it will wrap ALL of the CSS classes that wix-style provides. for example: if I set
`$wix-style-project-wrapper-selector: '.my-project'` I will receive wix-style button under this selector:
`.my-project .btn-default.`

This is good practice if you have a component inside a wix-style project and you want to namespace it so it won't contaminate the scope of the main project.

3) Every component have a variable that enables to exclude it from the css it creates. for example: setting `$enable-buttons: false` will exclude button component from your code.
