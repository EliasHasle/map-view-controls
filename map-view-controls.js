//By Elias Hasle. Adapted from a vessel.js demo (also by Elias Hasle)

//The argument is a THREE.OrthographicCamera
function MapViewControls(oCamera, domElement, preset) {
	Object.assign(this, {
		HMAX: 600,
		minX: -800,
		maxX: 800,
		minY: -600,
		maxY: 600,
	}, preset || {});
	
	this.mouseX = 0;
	this.mouseY = 0;
	this.scale = 1.0;
	
	this.oCamera = oCamera;
	this.domElement = domElement;
	
	oCamera.position.z = Math.max(oCamera.position.z, this.HMAX);
	Object.assign(oCamera, {
		left: minX!==undefined ? minX : oCamera.left,
		right: maxX!==undefined ? maxX : oCamera.right,
		top: maxY!==undefined ? maxY : oCamera.top,
		bottom: minY!==undefined ? minY : oCamera.bottom,
		near: 0,
		far: oCamera.position.z
	});
	oCamera.updateProjectionMatrix();
	
	let scope = this;

	//Read mouse wheel input:	
	this.onWheel = function(e) {
		e.preventDefault();
		//console.log("Wheel event.");
		scope.mouseX = e.offsetX;//e.clientX;
		scope.mouseY = e.offsetY;//e.clientY;
		scope.update.call(scope, e.deltaY>0 ? 1 : e.deltaY<0 ? -1 : 0);
	}
	
	this.enable();
}
MapViewControls.prototype = Object.create(Object.prototype);

Object.assign(MapViewControls.prototype, {
	constructor: MapViewControls,
	//This function updates the orthographic camera
	//wheel is wheel rotation direction, -1,0 or 1.
	update: function(wheel=0) {
		if (!wheel) return;
		
		let width = this.domElement.clientWidth;
		let height = this.domElement.clientHeight;
		
		let aspect = width/height;
		
		//apply wheel scroll
		let base = 1.1;
		let factor = Math.min(10/this.scale, Math.max(0.001/this.scale,base**wheel));
		let oScale = this.scale;
		this.scale *= factor;
		let convFactor = Math.min(
			(this.maxX-this.minX)/width,
			(this.maxY-this.minY)/height
		);
		let relMouseX = convFactor*(this.mouseX-0.5*width);
		let relMouseY = convFactor*(this.mouseY-0.5*height);
		
		this.oCamera.position.x += relMouseX*oScale*(1-factor);
		this.oCamera.position.y -= relMouseY*oScale*(1-factor);
		this.oCamera.position.x = Math.min(this.maxX, Math.max(this.minX, this.oCamera.position.x));
		this.oCamera.position.y = Math.min(this.maxY, Math.max(this.minY, this.oCamera.position.y));
	
		//Configures camera
		let maxWidth = (this.maxX-this.minX);
		Object.assign(this.oCamera, {
			left: -0.5*maxWidth*this.scale,
			right: 0.5*maxWidth*this.scale,
			top: (0.5*maxWidth/aspect)*this.scale,
			bottom: (-0.5*maxWidth/aspect)*this.scale
		});
		
		this.oCamera.updateProjectionMatrix();
	},
	enable() {
		this.domElement.addEventListener("wheel", this.onWheel);
		// this.domElement.addEventListener("mousedown", this.onMousedown);
		// this.domElement.addEventListener("mouseup", this.onMouseup);
		this.update();
	},
	disable() {
		this.domElement.removeEventListener("wheel", this.onWheel);
		// this.domElement.removeEventListener("mousedown", this.onMousedown);
		// this.domElement.removeEventListener("mouseup", this.onMouseup);
	}
});

export {MapViewControls};
