/*
 * Online Timeplanner with Lectures
 * 2009 Spring CS408 Capstone Project
 *
 * OTL Javascript Common Library
 * depends on: jQuery 1.4
 */

var suppress_ajax_errors = false;

(function($) {
	$.fn.highlight = function(color, options) {
		// jQuery's default highlight effect makes the background transparent,
		// so we make our own effect.
		var defaults = {
			duration: 500,
			easing: 'swing'
		};
		var theOptions = $.extend({}, defaults, options);
		this.each(function() {
			var j = $(this);
			j.stop(true,true);
			var originalBackColor = j.css('background-color');
			j.css('background-color', color)
			.animate({'background-color':originalBackColor}, theOptions); // TODO: jquery 1.7.2 has bug of animating background Color. Have to update jquery version.
			// Temporal color change
			window.setTimeout($.proxy(function() {
				j.css('background-color',originalBackColor);
			}, this), 500);

		});
		return this;
	};
	$.extend({
		proxyWithArgs: function(fun, context) {
			// Implements Mootools-style bind/bindWithEvent functions to pass extra arguments
			var extra_arguments = Array.prototype.slice.apply(arguments, [2]);
			var proxy = function() {
				var args = [];
				Array.prototype.push.apply(args, arguments);
				Array.prototype.push.apply(args, extra_arguments);
				return fun.apply(context, args);
			};
			return proxy;
		}
	});
})(jQuery);

$(window).bind('beforeunload', function() {
	suppress_ajax_errors = true;
});

var Notifier = {
	/*
	 * Requires at least 3 elements in this structure:
	 * <div id="indicator"></div>
	 * <div id="message-wrap">
	 *   <div id="message"></div>
	 * </div>
	 */
	initialize: function(options)
	{
		var my_options = {
			indicator: $('#indicator'),
			indicator_semester: $('#indicator_semester'),
			message: $('#message'),
			wrapper: $('#message-wrap'),
			clear_timeout: 10000
		};
		$.extend({}, my_options, options);
		this.indicator = my_options.indicator;
		this.indicator_semester = my_options.indicator_semester;
		this.message = my_options.message;
		this.wrapper = my_options.wrapper;
		this.clear_timeout = my_options.clear_timeout;
	},
	showIndicator: function()
	{
		this.indicator.addClass('waiting');
	},
	showIndicatorSemester: function()
	{
		this.indicator_semester.addClass('waiting');
	},
	setLoadingMsg: function(msg)
	{
		if (this.timeout)
			window.clearTimeout(this.timeout);
		this.indicator.addClass('waiting');
		this.message.html(msg);
		this.wrapper.fadeIn();
	},
	setMsg: function(msg)
	{
		this.clearIndicator();
		this.message.html(msg);
		this.wrapper.fadeIn().highlight('#FAD163');
		if (this.timeout)
			window.clearTimeout(this.timeout);
		if (this.clear_timeout > 0)
			this.timeout = window.setTimeout($.proxy(function() {
				this.wrapper.fadeOut();
			}, this), this.clear_timeout);
	},
	setErrorMsg: function(msg)
	{
		this.clearIndicator();
		this.message.html(msg);
		this.wrapper.fadeIn().highlight('#E55');
		if (this.timeout)
			window.clearTimeout(this.timeout);
		if (this.clear_timeout > 0)
			this.timeout = window.setTimeout($.proxy(function() {
				this.wrapper.fadeOut();
			}, this), this.clear_timeout);
	},
	clearIndicator: function()
	{
		this.indicator.removeClass('waiting');
	},
	clearIndicatorSemester: function()
	{
		this.indicator_semester.removeClass('waiting');
	},
	clear: function()
	{
		if (this.timeout)
			window.clearTimeout(this.timeout);
		this.clearIndicator();
		this.wrapper.fadeOut().hide();
	}
};

var MyFavorites = {
	initialize: function() {
		this.button = $('#myfavorites');
		this.menu = $('#myfavorites-menu');
		this.button.click(function(ev) {
			ev.preventDefault();
			return false;
		});
		this.button.mouseover($.proxy(function(ev) {
			var mypos = this.button.position();
			var ppos = $(this.button.parent()).position();
			this.menu.css({
				'left': (mypos.left - ppos.left) + 'px',
				'top': (mypos.top - ppos.top) + 'px'
			})
			.stop(true).css('opacity', 1);
		}, this));
		this.menu.mouseout($.proxy(function(ev) {
			var rel = (ev.relatedTarget) ? ev.relatedTarget : ev.toElement;
			while (rel != ev.target && rel.nodeName != 'BODY') {
				if (rel.id == this.menu.id)
					return;
				rel = rel.parentNode;
			}
			if (rel == ev.target)
				return;
			this.menu.animate({'opacity':0}, 300);
		}, this));
	}
};
