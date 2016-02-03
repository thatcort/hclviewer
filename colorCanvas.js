function buildColorCanvas() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	// L : 0..100
		// C : 0..128
		// H : 0..360

	function drawHL() {
		var img = ctx.createImageData(canvas.width, canvas.height);
		var pix = img.data;

		// draw HxL cylinder
		var C = hclController.c();
		for (var i=0; i < height; i++) {
			var L = ((height - i) / height) * 100;
			for (var j=0; j < width; j++) {
				var H = (j / width) * 360;					
				var rgb = lch2rgb(L, C, H);
				if (!rgb.clipped) {
					var p = ((i * width) + j) * 4;
					pix[p] = rgb[0];
					pix[p+1] = rgb[1];
					pix[p+2] = rgb[2];
					pix[p+3] = 255;
				}
			}
		}
		ctx.putImageData(img, 0, 0);
	}

	function drawCL() {
		var img = ctx.createImageData(canvas.width, canvas.height);
		var pix = img.data;

		// draw HxL cylinder
		var H = hclController.h();
		for (var i=0; i < height; i++) {
			var L = ((height - i) / height) * 100;
			for (var j=0; j < width; j++) {
				var C = (j / width) * 140;					
				var rgb = lch2rgb(L, C, H);
				if (!rgb.clipped) {
					var p = ((i * width) + j) * 4;
					pix[p] = rgb[0];
					pix[p+1] = rgb[1];
					pix[p+2] = rgb[2];
					pix[p+3] = 255;
				}
			}
		}
		ctx.putImageData(img, 0, 0);
	}

	function drawHC() {
		var img = ctx.createImageData(canvas.width, canvas.height);
		var pix = img.data;

		var h2 = height * 0.5;
		var w2 = width * 0.5;
		var TWO_PI = Math.PI + Math.PI;

		// draw HxL cylinder
		var L = hclController.l();
		for (var i=0; i < height; i++) {
			var ry = h2 - i;
			var pctY = ry / h2;
			for (var j=0; j < width; j++) {
				var rx = j - w2;
				var pctX = rx / w2;
				var C = Math.sqrt(pctX*pctX + pctY*pctY) * 140;
				var H = Math.atan2(ry, rx);
				// if (H < 0) {
				// 	H += Math.PI + Math.PI;
				// }
				H = H / TWO_PI * 360;
				var rgb = lch2rgb(L, C, H);
				if (!rgb.clipped) {
					var p = ((i * width) + j) * 4;
					pix[p] = rgb[0];
					pix[p+1] = rgb[1];
					pix[p+2] = rgb[2];
					pix[p+3] = 255;
				}
			}
		}
		ctx.putImageData(img, 0, 0);
	}


	function redraw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		switch (hclController.mode()) {
			case 'hl':
				drawHL();
				break;
			case 'cl':
				drawCL();
				break;
			case 'hc':
				drawHC();
				break;
		}
	}
	redraw();

	hclController.addListener(function() {
		redraw();
	});

}