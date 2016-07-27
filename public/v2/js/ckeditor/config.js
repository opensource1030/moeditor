/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

config.removeButtons = 'Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript';

// Dialog windows are also simplified.
config.removeDialogTabs = 'link:advanced';

config.skin = 'moono-dark';

config.extraPlugins = 'colorbutton';

config.extraPlugins = 'font';

    //config.colorButton_colors = '00923E,F8C100,28166F,fc1f1f,000000,ffffff';
    config.font_style = {
        element:        'span',
        styles:         { 'font-family': '#(family)' },
        overrides:      [ { element: 'font', attributes: { 'face': null } } ]
    };


    config.colorButton_backStyle = {
        element: 'span',
        styles: { 'background-color': '#(color)' }
    };
    config.colorButton_enableMore = true;
    config.colorButton_enableAutomatic = true;
    config.colorButton_foreStyle = {
        element: 'span',
        styles: { color: '#(color)' }
    };
    config.format_tags = 'h1;h2;h3;h4';
/*config.toolbar_Head = [
    { name: 'basicstyles', items: ['Bold', 'Italic'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'styles', items: ['Format'] },
    { name: 'links', items: ['Link', 'Unlink'] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] }
];
    
config.toolbar_Text = [
    { name: 'basicstyles', items: ['Bold', 'Italic'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'links', items: ['Link', 'Unlink'] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] }
];*/

};