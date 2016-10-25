/**
 * @author odahcam
 * @version 1.0.0
 **/
;
(function($, window, document, undefined) {

    "use strict";

    if (!$) {
        console.error("jQuery não encontrado, seu plugin jQuery não irá funcionar.");
        return false;
    }

    /**
     * Store the plugin name in a variable. It helps you if later decide to change the plugin's name
     * @type {string} pluginName
     **/
    var pluginName = 'bootify';

    /*
     * The plugin constructor.
     */
    function Plugin(options) {

        if (options !== undefined) {

            // Variables default
            this.settings = $.extend({}, this.defaults);
            var containerClass = 'container-' + pluginName;

            // Checa se foi passada uma mensagem flat ou se há opções.
            if (typeof options !== 'string') {
                $.extend(this.settings, options);
            } else {
                this.settings.text = options;
            }

            var positionSet = this.settings.position;

            // Define uma posição suportada para o .alert
            if (this.positionSupported[this.settings.position] !== undefined) {
                positionSet = this.settings.position;
            } else {
                // Tenta encontrar um sinônimo
                var positionCamel = $.camelCase(this.settings.position);

                if (this.positionSinonym[positionCamel] !== undefined) {
                    positionSet = this.positionSinonym[positionCamel] || 'bottom-center';
                }
            }

            var position = positionSet.split('-'),
                positionSelector = '.' + position.join('.'),
                positionClass = position.join(' ');

            // Define o .glyphicon com base no .alert-<type>
            this.settings.icon = this.settings.icon || this.icons[this.settings.type];

            // Checa se já tem container, se não cria um.
            if ($('body > .' + containerClass + positionSelector).length === 0) {
                $('<div class="' + containerClass + ' ' + positionClass + '"></div>').appendTo('body');
            }

            // Adiciona o .alert ao .container conforme seu posicionamento.
            var putTo = position[0] == 'bottom' ? 'appendTo' : 'prependTo';

            this.$el = $('<div class="alert alert-dismissable alert-' + this.settings.type + ' boot-alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="glyphicon glyphicon-' + this.settings.icon + '"></span><p>' + this.settings.text + '</p></div>')[putTo]('.' + containerClass + positionSelector);

            // Exibe o .alert
            this.$el.animate({
                opacity: 1,
            }, this.settings.animationDuration);

            // Se o .alert tem tempo de expiração
            if (this.settings.timeout !== false) {
                var secondsTimeout = parseInt(this.settings.timeout * 1000),
                    timer = this.hide(secondsTimeout),
                    plugin = this;

                // Pausa o timeout baseado no hover
                this.$el.hover(
                    clearTimeout.bind(window, timer),
                    function() {
                        timer = plugin.hide(secondsTimeout);
                    });
            }
        }
    };

    $.extend(Plugin.prototype, {
        /*
         * Default options
         */
        defaults: {
            message: 'Helo!', // String: HTML
            type: 'info', // String: ['warning', 'success', 'danger', 'info']
            position: 'bottom-center', // String: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
            icon: undefined, // String: name
            timeout: false,
            animationDuration: 300 // Int: animation duration in miliseconds
        },
        icons: {
            warning: 'exclamation-sign',
            success: 'ok-sign',
            danger: 'remove-sign',
            info: 'info-sign'
        },
        positionSinonym: {
            bottom: 'bottom-center',
            leftBottom: 'bottom-left',
            rightBottom: 'bottom-right',
            top: 'top-center',
            rightTop: 'top-right',
            leftTop: 'top-left'
        },
        positionSupported: [
            'top-left',
            'top-center',
            'top-right',
            'bottom-left',
            'bottom-right'
        ],
        /**
         * @type {function} hide
         * @param {int} timeout
         * @return {int} setTimeoutID The setTimeout ID.
         **/
        hide: function(timeout) {
            var plugin = this;
            return setTimeout(function() {
                plugin.$el.animate({
                    opacity: 0,
                }, plugin.settings.animationDuration, $.remove.bind(plugin.$el));
            }, timeout);
        }
    });

    window[pluginName] = function(options) {
        new Plugin(options);
        return;
    };

})(window.jQuery || false, window, document);
