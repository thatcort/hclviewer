function hcl_controller() {
	var ctrl = {};

	var listeners = [];

	var H_MIN = 0,
		H_MAX = 360,
		C_MIN = 0,
		C_MAX = 140, //???
		L_MIN = 0,
		L_MAX = 100,
		MODE_HC = 'hc',
		MODE_CL = 'cl',
		MODE_HL = 'hl';

	var h = 0;
	var c = 40;
	var l = 50;

	var mode = MODE_HC;




	function constrain(val, min, max) {
		if (val < min) {
			val = min;
		}
		if (val > max) {
			val = max;
		}
		return val;
	}

	$(function() {
		$('#hSlider').slider({
			min: H_MIN,
			max: H_MAX,
			value: h,
			orientation: 'vertical',
			slide: function(ui, event) {
				ctrl.h(event.value);
			}
		});
		$('#cSlider').slider({
			min: C_MIN,
			max: C_MAX,
			value: c,
			orientation: 'vertical',
			slide: function(ui, event) {
				ctrl.c(event.value);
			}
		});
		$('#lSlider').slider({
			min: L_MIN,
			max: L_MAX,
			value: l,
			orientation: 'vertical',
			slide: function(ui, event) {
				ctrl.l(event.value);
			}
		});
		setMode(mode);
		updateHandleLabels();
	});


	function fireEvent() {
		listeners.forEach(function(list) {
			list();
		});
	}

	function updateHandleLabels() {
		$('#hSlider .ui-slider-handle').text(h);
		$('#cSlider .ui-slider-handle').text(c);
		$('#lSlider .ui-slider-handle').text(l);
	}

	ctrl.addListener = function(list) {
		listeners.push(list);
	}

	ctrl.h = function(x) {
		if (arguments.length) {
			h = constrain(x, H_MIN, H_MAX);
			updateHandleLabels();
			fireEvent();
		} else {
			return h;
		}
	}
	ctrl.c = function(x) {
		if (arguments.length) {
			c = constrain(x, C_MIN, C_MAX);
			updateHandleLabels();
			fireEvent();
		} else {
			return c;
		}
	}
	ctrl.l = function(x) {
		if (arguments.length) {
			l = constrain(x, L_MIN, L_MAX);
			updateHandleLabels();
			fireEvent();
		} else {
			return l;
		}
	}

	function setMode(m) {
		mode = m;
		$('#hSlider').slider('disable');
		$('#cSlider').slider('disable');
		$('#lSlider').slider('disable');
		switch (mode) {
			case MODE_HC:
				$('#lSlider').slider('enable');
				break;
			case MODE_CL:
				$('#hSlider').slider('enable');
				break;
			case MODE_HL:
				$('#cSlider').slider('enable');
				break;
		}
	}

	ctrl.mode = function(m) {
		if (arguments.length) {
			setMode(m);
			fireEvent();
		} else {
			return mode;
		}
	}

	return ctrl;
};