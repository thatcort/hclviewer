function buildColorSurface() {

	var T = THREE;

	var hlCylinder,
		hcCircle,
		clRect;

	var DEG2RAD = PI / 180;

	function addVertex(geo, index) {
		var p = surfaceData[index];
		geo.vertices.push(new T.Vector3(p[0], p[1], p[2]));
		geo.colors.push(new T.Color('rgb(' + p[3] + ', ' + p[4] + ', ' + p[5] + ')'));
	}

	function addFace(geo, i0, i1, i2) {
		var f = new T.Face3(i0, i1, i2);
		f.vertexColors[0] = geo.colors[i0];
		f.vertexColors[1] = geo.colors[i1];
		f.vertexColors[2] = geo.colors[i2];
		geo.faces.push(f);
	}

	function createSurface() {
		var g = new T.Geometry();
		// var colors = [];
		// g.vertexColors = colors;
		var i;

		g.vertices.push(new T.Vector3(0, 0, 0));
		g.colors.push(new T.Color('black'));
		for (i=0; i < surfaceData.length; i++) {
			var p = surfaceData[i];
			addVertex(g, i);
		}
		g.vertices.push(new T.Vector3(0, 0, 100));
		g.colors.push(new T.Color('white'));

		// Add faces
		// 
		// First row
		for (i = 2; i <= ptsPerRow; i++) {
			addFace(g, 0, i-1, i);
		}
		addFace(g, 0, ptsPerRow+1, 1);

		// middle rows
		for (row=0; row < 99; row++) {
			var tl, tr, bl, br;
			for (i=1; i < ptsPerRow; i++) {
				tr = row * ptsPerRow + i + 1;
				tl = tr - 1;
				br = tr - ptsPerRow;
				bl = br - 1;
				addFace(g, tl, bl, tr);
				addFace(g, tr, bl, br);
			}
			// join the row start to the row end
			tr = row * ptsPerRow + 1;
			tl = tr + ptsPerRow - 1;
			br = tr - ptsPerRow;
			bl - tl - ptsPerRow;
			addFace(g, tl, bl, tr);
			addFace(g, tr, bl, br);
		}

		// Last row
		var last = surfaceData.length + 1;
		for (i = 1; i < ptsPerRow; i++) {
			var t = last - ptsPerRow + i;
			addFace(g, last, t-1, t);
		}
		addFace(g, last, last-1, last-ptsPerRow);

		return g;
	}

	function createAxisLine() {
		var lineMat = new THREE.LineBasicMaterial({
			color: 0x000000
		});

		var lineGeo = new THREE.Geometry();
		lineGeo.vertices.push(
			new THREE.Vector3( 0, 0, -10 ),
			new THREE.Vector3( 0, 0, 110 )
		);

		var line = new THREE.Line( lineGeo, lineMat );
		return line;
	}

	function createCylinder() {
		function cylgeo() {
			var chroma = hclController.c();
			var geo = new T.CylinderGeometry(chroma, chroma, 100, 36, 1, true);
			geo.translate(0, 50, 0);
			geo.rotateX(Math.PI * 0.5);
			return geo;
		}
		var geometry = cylgeo();
		if (!hlCylinder) {
			var material = new THREE.MeshPhongMaterial({color: 0xffffff, side:THREE.DoubleSide});
			hlCylinder = new T.Mesh( geometry, material );
		} else {
			hlCylinder.geometry = geometry;
		}
	}

	function createCircle() {
		if (!hcCircle) {
			var geometry = new T.CircleGeometry(120, 100);
			var material = new THREE.MeshPhongMaterial({color: 0xffffff, side:THREE.DoubleSide, transparent: true, opacity: 0.8});
			hcCircle = new T.Mesh(geometry, material);
		}
		hcCircle.position.set(0, 0, hclController.l());
	}

	function createRect() {
		if (!clRect) {
			var width = 120;
			var height = 120;
			var geometry = new T.PlaneGeometry(width, height, 1, 1);
			geometry.translate(width*0.5, height*0.5, 0);
			geometry.rotateX(Math.PI * 0.5);
			var material = new THREE.MeshPhongMaterial({color: 0xffffff, side:THREE.DoubleSide, transparent: true, opacity: 0.8});
			clRect = new T.Mesh(geometry, material);
			// clRect.rotationAutoUpdate = true;
		}
		clRect.rotation.set(0, 0, hclController.h() * DEG2RAD);
	}


	function updateMode() {
		switch (hclController.mode()) {
			case 'hl':
				createCylinder();
				scene.add(hlCylinder);
				if (hcCircle) scene.remove(hcCircle);
				if (clRect) scene.remove(clRect);
				break;
			case 'hc':
				createCircle();
				scene.add(hcCircle);
				if (hlCylinder) scene.remove(hlCylinder);
				if (clRect) scene.remove(clRect);
				break;
			case 'cl':
				createRect();
				scene.add(clRect);
				if (hcCircle) scene.remove(hcCircle);
				if (hlCylinder) scene.remove(hlCylinder);
				break;
		}
	}

	hclController.addListener(function() {
		updateMode();
		render();
	});


	var width = canvasWidth;
	var height = canvasHeight;

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( width, height ); // window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xcccccc);
	document.getElementById('threed').appendChild( renderer.domElement );

	var geometry = createSurface(); // new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors, wireframe: false } );

	var surface = new THREE.Mesh( geometry, material );
	scene.add( surface );

	var axisLine = createAxisLine();
	scene.add( axisLine );	

	updateMode();

    // Create a light.
    var light1 = new THREE.DirectionalLight(0xffffff);
    light1.position.set(1, 1, 1);
    scene.add(light1);
    var light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(-2, -2, -2);
    scene.add(light2);

    var camDx = 170;
    var camDz = 110;
    var camLA = new T.Vector3(0,0,50);
	camera.position.x = camDx;
	camera.position.z = camDz;
	camera.up.set(0,0,1);
	camera.lookAt(camLA);

	var camAngle = 0;
	var autoRotate = false;
	// document.getElementById('threed').onclick = function() { autoRotate = !autoRotate; if (autoRotate) { render(); } };
	// document.getElementById('threed').ondrag = function() { autoRotate = !autoRotate; if (autoRotate) { render(); } };

	var inDrag = false;
	var dragStartX, angleStart;
	function dragStart(evt) {
		dragStartX = evt.screenX;
		angleStart = camAngle;
		inDrag = true;
	}
	function dragMove(evt) {
		if (inDrag) {
			var dx = evt.screenX - dragStartX;
			camAngle = angleStart - dx * 0.03;
			render();
		}		
	}
	function dragEnd() {
		if (inDrag) {
			inDrag = false;
		}
	}
	$('#threed').mousedown(dragStart);
	$('html').mousemove(dragMove);
	$('html').mouseup(dragEnd);
	$('#threed').bind('touchstart', function(e) { dragStart(e.originalEvent.changedTouches[0]); });
	$('html').bind('touchmove', function(e) { dragMove(e.originalEvent.changedTouches[0]); });
	$('html').bind('touchend', dragEnd);

	function positionCamera() {
		camera.position.x = camDx * Math.cos(camAngle);
		camera.position.y = camDx * Math.sin(camAngle);
		camera.lookAt(camLA);
	}

	var render = function () {
		positionCamera();
		renderer.render(scene, camera);
	};

	function responsive() {
		renderer.setSize(canvasWidth, canvasHeight);
		camera.aspect = canvasWidth / canvasHeight;
		camera.updateProjectionMatrix();
	}
	addResponsiveListener(responsive);

	render();
}