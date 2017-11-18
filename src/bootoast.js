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

;
(function (root, factory) {

	if (typeof define === 'function' && define.amd) {

		// AMD. Register as an anonymous module.
		define(['exports', 'jquery'], function (exports, jquery) {
			factory((root.bootoast = exports), jquery);
		});

	} else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {

		// CommonJS
		factory(exports, require('jquery'));

	} else {

		// Browser globals
		factory((root.bootoast = {}), root.jQuery);

	}

}(this, function (exports, $, undefined) {
	// Use bootoast, bootbox in some fashion.

	'use strict';

	if (!$) {
		console.error('jQuery não encontrado, seu plugin jQuery não irá funcionar.');
		return false;
	}

	/**
	 * Store the plugin name in a variable. It helps you if later decide to change the plugin's name
	 * @var {string} pluginName
	 */
	var pluginName = 'bootoast';

	/**
	 * The plugin constructor.
	 */
	function Bootoast(options) {

		if (typeof options === 'undefined') return;

		if (typeof options === 'string') {
			options = {
				message: options
			};
		}

		// define as opções interpretadas
		this.settings = $.extend({}, this.defaults, options);
		// define o conteúdo
		this.content = this.settings.content || this.settings.text || this.settings.message;
		// define o elemento de progress como nulo
		this.timeoutProgress = null;
		// define uma posição aceitável pro elemento
		this.position = this.positionFor(this.settings.position).split('-');
		// Define o .glyphicon com base no .alert-<type>
		this.settings.icon = this.settings.icon || this.icons[this.settings.type];

		var containerClass = pluginName + '-container';

		this.containerSelector = '.' + containerClass + '.' + this.position.join('.');

		// Checa se já tem container, se não cria um.
		if ($('body > ' + this.containerSelector).length === 0) {
			$('<div>', {
				class: containerClass + ' ' + this.position.join(' ')
			}).appendTo('body');
		}

		// Adiciona o .alert ao .container conforme seu posicionamento.
		this.$el = $('<div class="' + pluginName + ' alert alert-' + this.typeFor(this.settings.type) + '"><span class="glyphicon glyphicon-' + this.settings.icon + '"></span><span class="bootoast-alert-container"><span class="bootoast-alert-content">' + this.content + '</span></span></div>');

		this.init();
	}

	$.extend(Bootoast.prototype, {
		/**
		 * Default options
		 *
		 * @var {Object} defaults
		 */
		defaults: {
			/**
			 * Any HTML string.
			 * @var {string}
			 */
			message: 'Bootoast!',
			/**
			 * ['warning', 'success', 'danger', 'info']
			 * @var {string}
			 */
			type: 'info',
			/**
			 * ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
			 * @var {string}
			 */
			position: 'bottom-center',
			/**
			 * @var {string}
			 */
			icon: undefined,
			/**
			 * Seconds, use null to disable timeout hiding.
			 * @var {int}
			 */
			timeout: 3,
			/** 
			 * [false, 'top', 'bottom', 'background']
			 * 
			 * @var {string|bool}
			 */
			timeoutProgress: false,
			/**
			 * Animation duration in miliseconds.
			 * 
			 * @var {int}
			 */
			animationDuration: 300,
			/**
			 * @var {bool}
			 */
			dismissible: true,
		},
		/**
		 * Default icons
		 *
		 * @var {Object} icons
		 */
		icons: {
			warning: 'exclamation-sign',
			success: 'ok-sign',
			danger: 'remove-sign',
			info: 'info-sign'
		},
		/**
		 * Types
		 *
		 * @var {Object} types
		 */
		types: [
			'primary',
			'secondary',
			'info',
			'success',
			'warning',
			'danger'
		],
		/**
		 * Type Sinonymus
		 *
		 * @var {Object} typeSinonym
		 */
		typeSinonym: {
			warn: 'warning',
			error: 'danger',
		},
		/**
		 * Position Supported
		 *
		 * @var {array} positions
		 */
		positions: [
			'top-left',
			'top-center',
			'top-right',
			'bottom-left',
			'bottom-center',
			'bottom-right'
		],
		/**
		 * Position Sinonymus
		 *
		 * @var {Object} positionSinonym
		 */
		positionSinonym: {
			bottom: 'bottom-center',
			leftBottom: 'bottom-left',
			rightBottom: 'bottom-right',
			top: 'top-center',
			rightTop: 'top-right',
			leftTop: 'top-left'
		},
		/**
		 * Initializes the plugin functionality
		 */
		init: function () {

			// Define se o novo .alert deve ser inserido por primeiro ou último no container.
			this.$el[(this.position[0] == 'bottom' ? 'append' : 'prepend') + 'To'](this.containerSelector);

			var plugin = this;

			if (this.settings.dismissible === true) {
				this.$el
					.addClass('alert-dismissible')
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
			if (!!this.settings.timeout) {

				var secondsTimeout = parseInt(this.settings.timeout * 1000);

				this.hide(secondsTimeout);
			}
		},
		/**
		 * @method hide
		 *
		 * @param {int} timeout
		 *
		 * @return {int} The setTimeout ID.
		 */
		hide: function (timeout) {
			var plugin = this;

			if (this.settings.timeoutProgress) {
				this.setTimeoutProgress(this.settings.timeoutProgress);
			}

			var timer = setTimeout(function () {
				plugin.$el.animate({
					opacity: 0,
				}, plugin.settings.animationDuration, function () {
					plugin.$el.remove();
				});
			}, timeout || 0);

			// Pausa o timeout baseado no hover
			this.$el.hover(
				clearTimeout.bind(window, timer),
				function () {
					timer = plugin.hide(timeout);
				}
			);
		},
		/**
		 * @param {string} progressPosition
		 */
		setTimeoutProgress: function (progressPosition) {

			if (this.timeoutProgress !== null) {
				this.timeoutProgress.remove();
			}

			var positionOptions = {
				top: 'prepend',
				bottom: 'append',
			};

			var $progress = $('<div>', {
				class: 'progress',
				html: $('<div>', {
					class: 'progress-bar progress-bar-striped active',
					role: 'progressbar',
					'aria-valuemin': 0,
					'aria-valuenow': 0,
					'aria-valuemax': 100,
				})
			});

			var putMethod = positionOptions[progressPosition] || 'append';
			var position = typeof positionOptions[progressPosition] === 'string' ? progressPosition : 'background';

			this.timeoutProgress = $progress.addClass('progress-' + position)[putMethod + 'To'](this.$el)

			return this.timeoutProgress;
		},
		/**
		 * @param {string} type
		 *
		 * @return Gets the correct type-name for the given value or null.
		 */
		typeFor: function (type) {

			// se esta type é padrão
			if (this.types[type] !== undefined) return type;

			if (!type) return 'default';

			return this.typeSinonym[type] || type;
		},
		/**
		 * @param {string} position
		 *
		 * @return Gets the correct position-name for the given value or ''.
		 */
		positionFor: function (position) {

			// se esta posição é padrão
			if (this.positions[position] !== undefined) return position;

			var positionCamel = $.camelCase(position);

			// Tenta encontrar um sinônimo
			return this.positionSinonym[positionCamel] || 'bottom-center';
		},
	});

	/**
	 *
	 * @param {HTMLElement} elem
	 * @param {int} qty
	 */
	function moveProgressbar(elem, qty) {
		var width = 100;
		return setInterval(function () {
			if (width <= 0) {
				clearInterval(id);
			} else {
				width--;
				elem.style.width = width + '%';
			}
		}, 100 / qty);
	}

	// attach properties to the exports object to define
	// the exported module properties.
	exports.toast = function (options) {
		return new Bootoast(options);
	};

	return exports;
}));