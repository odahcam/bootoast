// Uses CommonJS, AMD or browser globals to create a module. This example
// creates a global even when AMD is used. This is useful if you have some
// scripts that are loaded by an AMD loader, but they still want access to
// globals. If you do not need to export a global for the AMD case, see
// commonjsStrict.js.

// If you just want to support Node, or other CommonJS-like environments that
// support module.exports, and you are not creating a module that has a
// circular dependency, then see returnExportsGlobal.js instead. It will allow
// you to export a function as the module value.

// Defines a module "bootoast" that depends another module called
// "b". Note that the name of the module is implied by the file name. It is
// best if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

;(function(root, factory) {

	if (typeof define === 'function' && define.amd) {

		// AMD. Register as an anonymous module.
		define(['exports', 'jquery'], function(exports, jquery) {
			factory((root.bootoast = exports), jquery);
		});

	} else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {

		// CommonJS
		factory(exports, require('jquery'));

	} else {

		// Browser globals
		factory((root.bootoast = {}), root.jQuery);

	}

}(this, function(exports, $, undefined) {
	// Use bootoast, bootbox in some fashion.

	'use strict';

	if (!$) {
		console.error('jQuery não encontrado, seu plugin jQuery não irá funcionar.');
		return false;
	}

	/**
	 * Store the plugin name in a variable. It helps you if later decide to change the plugin's name
	 * @type {string} pluginName
	 **/
	var pluginName = 'bootoast';

	/*
	 * The plugin constructor.
	 */
	function Bootoast(options) {

		if (options !== undefined) {

			// Variables default
			this.settings = $.extend({}, this.defaults);

			// Checa se foi passada uma mensagem flat ou se há opções.
			if (typeof options !== 'string') {
				$.extend(this.settings, options);
			} else {
				this.settings.message = options;
			}

			this.content = this.settings.content || this.settings.text || this.settings.message;

			// Define uma posição suportada para o .alert
			if (this.positionSupported[this.settings.position] === undefined) {
				// Tenta encontrar um sinônimo
				var positionCamel = $.camelCase(this.settings.position);

				if (this.positionSinonym[positionCamel] !== undefined) {
					this.settings.position = this.positionSinonym[positionCamel] || 'bottom-center';
				}
			}

			var position = this.settings.position.split('-'),
				positionSelector = '.' + position.join('.'),
				positionClass = position.join(' ');

			// Define se o novo .alert deve ser inserido por primeiro ou último no container.
			this.putTo = position[0] == 'bottom' ? 'appendTo' : 'prependTo';

			// Define o .glyphicon com base no .alert-<type>
			this.settings.icon = this.settings.icon || this.icons[this.settings.type];

			var containerClass = pluginName + '-container';

			// Checa se já tem container, se não cria um.
			if ($('body > .' + containerClass + positionSelector).length === 0) {
				$('<div class="' + containerClass + ' ' + positionClass + '"></div>').appendTo('body');
			}

			// Adiciona o .alert ao .container conforme seu posicionamento.
			this.$el = $('<div class="alert alert-' + this.settings.type + ' ' + pluginName + '"><span class="glyphicon glyphicon-' + this.settings.icon + '"></span><span class="bootoast-alert-container"><span class="bootoast-alert-content">' + this.content + '</span></span></div>')[this.putTo]('.' + containerClass + positionSelector);

            var plugin = this;

			if (this.settings.dismissable === true) {
				this.$el
                    .addClass('alert-dismissable')
					.prepend('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
                    .on('click', 'button.close', function (e) {
                        e.preventDefault();
                        plugin.hide();
                    });
			}

			// Exibe o .alert
			this.$el.animate({
				opacity: 1,
			}, this.settings.animationDuration);

			// Se o .alert tem tempo de expiração
			if (this.settings.timeout !== false) {
				var secondsTimeout = parseInt(this.settings.timeout * 1000),
					timer = this.hide(secondsTimeout),
					plugin = this;

                if (this.settings.timeoutProgress) {
                    this.timeoutProgress = this.insertTimeoutProgress(this.settings.timeoutProgress);
                }

				// Pausa o timeout baseado no hover
				this.$el.hover(
					clearTimeout.bind(window, timer),
					function() {
						timer = plugin.hide(secondsTimeout);
					}
                );
			}
		}
	};

	$.extend(Bootoast.prototype, {
		/*
		 * Default options
		 * @type {Object} defaults
		 */
		defaults: {
			message: 'Helo!', // String: HTML
			type: 'info', // String: ['warning', 'success', 'danger', 'info']
			position: 'bottom-center', // String: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
			icon: undefined, // String: name
			timeout: 3, // seconds, use null to disable timeout hidin'
            timeoutProgress: false, // [false, 'top', 'bottom', 'background']
			animationDuration: 300, // Int: animation duration in miliseconds
			dismissable: true,
		},
		/*
		 * Default icons
		 * @type {Object} icons
		 */
		icons: {
			warning: 'exclamation-sign',
			success: 'ok-sign',
			danger: 'remove-sign',
			info: 'info-sign'
		},
		/*
		 * Position Sinonymus
		 * @type {Object} positionSinonym
		 */
		positionSinonym: {
			bottom: 'bottom-center',
			leftBottom: 'bottom-left',
			rightBottom: 'bottom-right',
			top: 'top-center',
			rightTop: 'top-right',
			leftTop: 'top-left'
		},
		/*
		 * Position Supported
		 * @type {array} positionSupported
		 */
		positionSupported: [
			'top-left',
			'top-center',
			'top-right',
			'bottom-left',
			'bottom-center',
			'bottom-right'
		],
		/**
		 * @type {method} hide
		 * @param {int} timeout
		 * @return {int} setTimeoutID The setTimeout ID.
		 **/
		hide: function(timeout) {
			var plugin = this;
			return setTimeout(function() {
				plugin.$el.animate({
					opacity: 0,
				}, plugin.settings.animationDuration, function() {
					plugin.$el.remove();
				});
			}, timeout || 0);
		},
        /**
         * @param {string} progressPosition
         */
        insertTimeoutProgress: function(progressPosition) {

                var progressPutToAllowed = {
                    'top': 'prepend',
                    'bottom': 'append',
                };
                var $progress = $('div', {
                    class: 'progress',
                    html: $('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuenow="0" aria-valuemax="100">')
                });
                var progressPutTo = progressPutToAllowed[progressPosition];
                var progressPositionClass = typeof progressPutTo === 'string' ? progressPosition : 'background';

                return $progress.addClass(progressPositionClass)[progressPut + 'To'](this.$el);
        }
	});

    function moveProgressbar(elem, qty) {
        var width = 100;
        return setInterval(function () {
            if (width <= 0) {
                clearInterval(id);
            } else {
                width--;
                elem.style.width = width + '%';
            }
        }, 100/qty);
    }

	// attach properties to the exports object to define
	// the exported module properties.
	exports.toast = function(options) {
		return new Bootoast(options);
	};;

	return exports;
}));
