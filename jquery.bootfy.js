/**
 * @author odahcam
 * @version 1.0.0
 */
!(function($, window, document, undefined) {

    /*
     * undefined is used here as the undefined global variable in ECMAScript 3 is
     * mutable (ie. it can be changed by someone else). undefined isn't really being
     * passed in so we can ensure the value of it is truly undefined. In ES5, undefined
     * can no longer be modified.
     *
     * window and document are passed through as local variables rather than global
     * as this (slightly) quickens the resolution process and can be more efficiently
     * minified (especially when both are regularly referenced in your plugin).
     *
     */

    "use strict";

    if (!$) {
        console.error("jQuery não encontrado, seu plugin jQuery não irá funcionar.");
        return false;
    }

    /**
     * Store the plugin name in a variable. It helps you if later decide to
     * change the plugin's name
     * @type {string} pluginName
     */
    var pluginName = 'bootfy';

    /**
     * This is a real private method. A plugin instance has access to it
     * @param {Object} $obj
     * @param {int} timeout
     * @return {int} setTimeoutID The setTimeout ID.
     */
    var bootfyHide = function($obj, timeout) {
        return setTimeout(function() {
            $obj.animate({
                opacity: 0,
            }, 300, $obj.remove);
        }, timeout);
    }


    /**
     * The plugin method.
     */
    $.fn[pluginName] = function(options) {

        if (options !== undefined) {

            // Variables default
            var settings = this.defaults,
                containerClass = 'container-' + pluginName;

            // Checa se foi passada uma mensagem flat ou se há opções.
            if (typeof options !== 'string') {
                $.extend(settings, options);
            } else {
                settings.text = options;
            }

            var positionSet = '';

            // Define uma posição suportada para o .alert
            if (this.positionSupported[settings.position] !== undefined) {
                positionSet = settings.position;
            } else
            // Tenta encontrar um sinônimo
            if (this.positionSinonym[$.camelCase(settings.position)] !== undefined) {
                positionSet = this.positionSinonym[$.camelCase(settings.position)] || 'bottom-center';
            }

            var position = positionSet.split('-'),
                positionSelector = '.' + position.join('.'),
                positionClass = position.join(' ');

            // Define o .glyphicon com base no .alert-<type>
            settings.icon = settings.icon || this.icons[settings.type];

            // Checa se já tem container, se não cria um.
            if ($('body > .' + containerClass + positionSelector).length === 0) {
                $('<div class="' + containerClass + ' ' + positionClass + '"></div>').appendTo('body');
            }

            // Adiciona o .alert ao .container conforme seu posicionamento.
            var putTo = position[0] == 'bottom' ? 'appendTo' : 'prependTo';
                $obj = $('<div class="alert alert-dismissable alert-' + settings.type + ' boot-alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="glyphicon glyphicon-' + settings.icon + '"></span><p>' + settings.text + '</p></div>')
                    [putTo]('.' + containerClass + positionSelector);

            // Exibe o .alert
            $obj.animate({
                opacity: '1',
            }, 300);

            // Se o .alert tem tempo de expiração
            if (settings.timeout !== false) {
                var secondsTimeout = parseInt(settings.timeout * 1000),
                    timer = bootfyHide($obj, secondsTimeout);

                // Pausa o timeout baseado no hover
                $obj.hover(
                    clearTimeout.call(this, timer),
                    function() {
                        timer = bootfyHide($obj, secondsTimeout);
                    });
            }
        }
    };


    /**
     * Default options
     */
    $.fn[pluginName].defaults = {
        message: 'Helo!', // String: HTML
        type: 'info', // String: ['warning', 'success', 'danger', 'info']
        position: 'bottom-center', // String: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
        icon: undefined, // String: name
        timeout: false
    };

    $.fn[pluginName].icons = {
        warning: 'exclamation-sign',
        success: 'ok-sign',
        danger: 'remove-sign',
        info: 'info-sign'
    };

    $.fn[pluginName].positionSinonym = {
        bottom: 'bottom-center',
        leftBottom: 'bottom-left',
        rightBottom: 'bottom-right',
        top: 'top-center',
        rightTop: 'top-right',
        leftTop: 'top-left'
    };

    $.fn[pluginName].positionSupported = [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-right'
    ];

})(window.jQuery || false, window, document);
