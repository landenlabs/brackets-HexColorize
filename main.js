define(function (require, exports, module) {
    'use strict';

    // LanDenLAbs - HexColorize v1.1.1
    // Code copied from ColorHighligher, modified by Dennis Lang
    
    var css = ".h-phantom{position:relative;}\
.h-phantom:before{content:attr(data-color);color:inherit;background-color:inherit;pointer-events:none;position:absolute;top:0;left:0;border-radius:2px;white-space:pre;}";

    var document = window.document;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    var HexColorize = require('hexcolorize'),
        EditorManager = brackets.getModule('editor/EditorManager');

    function validLang(mode) {
        return true;    // any file
        /*
        return mode == 'css' ||
            mode == 'sass' ||
            mode == 'scss' ||
            mode == 'less' ||
            mode == 'html' ||
            mode == 'php'  ||
            mode == 'stylus';
        */
    }

    function processEditor(editor) {
        var cm = editor._codeMirror;
        if (cm) {
            if (editor.document && validLang(editor.document.language._id)) {
                HexColorize.addHighlighter(cm);
            }
            else {
                HexColorize.destroyHighlighter(cm);
            }
        }
    }

    EditorManager.on('activeEditorChange', function (event, editor) {
        if (editor && editor._codeMirror) {
            processEditor(editor);

            var doc = editor.document;
            if (!doc._hasColirizeDefinitionListeners) {
                doc._hasColirizeDefinitionListeners = true;
                doc.on('languageChanged', function () {
                    processEditor(editor);
                });
            }
        }
    });
});