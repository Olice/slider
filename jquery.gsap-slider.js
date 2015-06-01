$.fn.gsapSlider = function(opts) {

	var defaults = {

		// Callback allows you to add custom content to markers
		addMarker : function($marker, value) {

		},

		// Callback when a particular value is shown
		showValue : function(value) {

		},

		// Callback to hide a content panel 
		hidePanel : function($panel) {
			$panel.hide();
		},

		// Callback to show a content panel 
	    showPanel : function($panel) {
	    	$panel.fadeIn();
	    }

	};

	var self = this, options = $.extend(defaults, opts);

	var init = function() {
     	
     	// Get the jQuery objects for the track and handle
     	var $track     = $(this).find('[data-slider=track]')
     	var $handle    = $(this).find('[data-slider=handle]');
     	var $container = $(this);

     	// Reset handle position in case we're resizing
     	TweenLite.to($handle, {left : 0});

     	// Remove any existing markers
     	$container.find('.slider-marker').remove();

     	// Hide all content panels
     	$container.find('[data-slider-content]').hide();

     	// Get the min and max values
     	var min        = options.snap[0];
     	var max		   = options.snap[options.snap.length-1];
     	var range      = max-min;

     	// Get track width 
     	var width      = $track.width();

		// Get slider x position from value
		// @param value the real-world value to mark 
		// @return the position in the slider container in pixels
		var getX = function(value) {
			return width * (value - min)/range;
		}

		// Add marker from value 
		// @param value the real-world value to mark
		var addMarker = function(value) {
			var $marker = $('<div class="slider-marker"></div>').addClass('slider-marker-' + value);
			$track.append($marker);

			// Set position
			$marker.css({left : getX(value)});

			// Add marker Callback
			options.addMarker($marker, value);
		}

		// Find closest snap value
		// @param x the x position of the slider handle 
		// @return integer the index of the closest snap value
		var closestSnap = function(x) {
			var diffX = 0, snapIndex;
			$.each(options.snap, function(i, snapValue) {
				var selfDiffX = Math.abs(getX(snapValue) - x);
				if( i ==0 || diffX > selfDiffX ) {
					diffX     = selfDiffX;
					snapIndex = i;
				}
			});
			return snapIndex;
		}

		// Show panel
		// @param integer snapIndex
		var showPanel = function(snapIndex) {
			var val    = options.snap[snapIndex];
			var $panel = $container.find('[data-slider-content=' + val + ']');
			options.showPanel($panel);
			options.hidePanel($panel.siblings('[data-slider-content]'));
		}

		$.each(options.snap, function(i, snapValue) {
			addMarker(snapValue);
		});

		self.draggable = Draggable.create($handle, {
		    type:"left",
		    edgeResistance:0.65,
		    bounds: $track,
		    throwProps:true,
		    snap: {
		        x: function(endValue) {
		        	var i = closestSnap(endValue);
		        	showPanel(i);
		        	options.showValue(options.snap[i]);
		        	return getX(options.snap[i]);
		        },
		        y: function(endValue) {
		        	var i = closestSnap(endValue);
		        	showPanel(i);
		        	options.showValue(options.snap[i]);
		        	return getX(options.snap[i]);
		        }
		    }
		});

    };

    // When window resizes, re-initialise so that markers remain
    // in correct relative position
    $(window).resize(function() {
    	self.each(init);
    });

    return self.each(init);

};
