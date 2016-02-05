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

	var mode = MODE_HL;




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
		responsive();

		$('#hcBtn').click(function() { ctrl.mode(MODE_HC); });
		$('#clBtn').click(function() { ctrl.mode(MODE_CL); });
		$('#hlBtn').click(function() { ctrl.mode(MODE_HL); });
		setMode(mode);
		updateHandleLabels();
	});

	function responsive() {
		if (window.innerWidth < 768) {
			$('#topContainer').css('height', 'auto');
			$('#hSlider').slider("option", "orientation", "horizontal");
			$('#cSlider').slider("option", "orientation", "horizontal");
			$('#lSlider').slider("option", "orientation", "horizontal");
		} else {
			$('#topContainer').css('height', canvasHeight + 'px');
			$('#hSlider').slider("option", "orientation", "vertical");
			$('#cSlider').slider("option", "orientation", "vertical");
			$('#lSlider').slider("option", "orientation", "vertical");
		}
	}
	addResponsiveListener(responsive);


	function fireEvent() {
		listeners.forEach(function(list) {
			list();
		});
	}

	function updateHandleLabels() {
		$('#hvalue').text(h);
		$('#cvalue').text(c);
		$('#lvalue').text(l);
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
		$('#hvalue').addClass('disabled');
		$('#cvalue').addClass('disabled');
		$('#lvalue').addClass('disabled');
		$('#hcBtn').removeClass('active');
		$('#clBtn').removeClass('active');
		$('#hlBtn').removeClass('active');
		switch (mode) {
			case MODE_HC:
				$('#lSlider').slider('enable');
				$('#lvalue').removeClass('disabled');
				$('#hcBtn').addClass('active');
				break;
			case MODE_CL:
				$('#hSlider').slider('enable');
				$('#hvalue').removeClass('disabled');
				$('#clBtn').addClass('active');
				break;
			case MODE_HL:
				$('#cSlider').slider('enable');
				$('#cvalue').removeClass('disabled');
				$('#hlBtn').addClass('active');
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