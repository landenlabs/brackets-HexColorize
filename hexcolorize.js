define(function (require) {
    'use strict';

    // LanDenLAbs - HexColorize v1.1.1
    // Code copied from ColorHighligher, modified by Dennis Lang
    
    var Color = require('color');

    function processElement(e, color, colorNameOrString) {
        e.style.backgroundColor = colorNameOrString;
        e.style.borderRadius = '2px';
        e.style.color = color.light() < 50 ? '#fff' : '#000';
    }

    // cm = editor._codeMirror
    // node =  cm.display.lineDiv
    function process(cm, _, node) {
        var mode = cm.options.mode;
        var nodes = [];
        
        // Nodes - See https://help.adobe.com/en_US/dreamweaver/TokenInspector/CM-Modes-Interactive/demo/TokenInspector.html
        // Language modes - https://codemirror.net/mode/index.html
        switch (mode) {
        case 'sass':
            nodes = node.querySelectorAll('.cm-attribute, .cm-number');
            break;
        case 'text/x-styl':
            nodes = node.querySelectorAll('.cm-keyword, .cm-atom, .cm-number, .cm-string, .cm-meta, .cm-comment');
            break;
        default:
            nodes = node.querySelectorAll('.cm-keyword, .cm-atom, .cm-number, .cm-string, .cm-meta, .cm-comment');
        }
        
        for (var i = 0; i < nodes.length; i++) {
            var nd = nodes[i],
                color = null,
                tr, tg, tb;
            {
                var t = nd.innerText.trim();
                var hexIdx = t.indexOf('#');
                if (hexIdx >= 0) {
                    while (hexIdx >= 0) {
                        var hexColor = t.substr(hexIdx);
                        hexColor = hexColor.replace(/#([0-9a-fA-F]*).*/, "#$1");
                        if (hexColor.length == 3+1 || hexColor.length == 6+1) {
                            color = Color.fromHexString(hexColor);
                            if (color) {
                                processElement(nd, color, color.toHexString());
                                break;
                            }
                        }
                        hexIdx = t.indexOf('#', hexIdx+1);
                    }
                }
                else {
                    t = t.toLowerCase();
                    var m =  t.match(/.*(rgb\([^)]*\)|rgba\([^)]*\)|hsl\([^)]*\)|hsla\([^)]*\)).*/);
                    if (m)  {
                        t = m[1];
                        var parts = t.split(/[(,)]/);
                        if (parts.length == 5 || parts.length == 6) {
                            t= parts[0];    
                            tr=parts[1].trim();
                            tg=parts[2].trim();
                            tb=parts[3].trim();

                            if (t == 'rgb' || t == 'rgba') {
                                color = new Color(parseInt(tr), parseInt(tg ), parseInt(tb));
                            }
                            else {
                                color = Color.fromHSL(parseInt(tr), parseInt(tg), parseInt(tb));
                            }
                        }
                    }
                    if (color) {
                        processElement(nd, color, color.toHexString());
                    }
                }
            }
        }
    }

    return {
        // cm = editor._codeMirror
        addHighlighter: function (cm) {
            if (!cm._colirizeDefinition) {
                cm._colirizeDefinition = true;
                cm.on('renderLine', process);
                process(cm, null, cm.display.lineDiv);
            }
        },
        destroyHighlighter: function (cm) {
            if (cm._colirizeDefinition) {
                cm.off('renderLine', process);
                cm._colirizeDefinition = null;
            }
        }
    };
});