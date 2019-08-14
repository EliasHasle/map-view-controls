//By Elias Hasle. Adapted from a vessel.js demo (also by Elias Hasle)

//import {Vector2} from "three/src/math/Vector2.js";
//const _v = new Vector2();

//The argument is a THREE.OrthographicCamera
function MapViewControls(oCamera, domElement, /*renderer, */preset) {
	Object.assign(this, {
		HMAX: 600,
		minX: -800,
		maxX: 800,
		minY: -600,
		maxY: 600,
		//offsetX: 0,
		//offsetY: 0,
	}, preset || {});
	
	this.mouseX = 0;
	this.mouseY = 0;
	this.scale = 1.0;
	
	this.oCamera = oCamera;
	this.domElement = domElement;
	//this.renderer = renderer;
	
	// oCamera.position.set(0,0,this.HMAX);
	oCamera.position.z = this.HMAX;
	
	let scope = this;
	
	/*this.updateFun = function(e) {
		scope.update.call(scope);
	}*/

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
						//optional parameters
						//wheel is wheel rotation direction, -1,0 or 1.
	update: function(wheel=0) {
		if (wheel === 0) return;
		
		let width = this.domElement.clientWidth;
		let height = this.domElement.clientHeight;
		//this.renderer.setSize(width,height);
		
		let aspect = width/height;
		
		//apply wheel scroll
		let base = 1.1;
		let factor = Math.min(2/this.scale, Math.max(0.001/this.scale,base**wheel));
		let oScale = this.scale;
		this.scale *= factor;
		let convFactor = (this.maxX-this.minX)/width;
		let relMouseX = convFactor*(this.mouseX-0.5*width);
		let relMouseY = convFactor*(this.mouseY-0.5*height);
		
		this.oCamera.position.x += relMouseX*oScale*(1-factor);
		this.oCamera.position.y -= relMouseY*oScale*(1-factor);
		this.oCamera.position.x = Math.min(this.maxX, Math.max(this.minX, this.oCamera.position.x));
		this.oCamera.position.y = Math.min(this.maxY, Math.max(this.minY, this.oCamera.position.y));
	
		//Configures camera
		let maxWidth = (this.maxX-this.minX);
		Object.assign(this.oCamera, {
			// left: this.offsetX,
			left: -0.5*maxWidth*this.scale,
			// right: maxWidth*this.scale +this.offsetX,
			right: 0.5*maxWidth*this.scale,
			// top: (0.5*maxWidth/aspect)*this.scale +this.offsetY,
			top: (0.5*maxWidth/aspect)*this.scale,
			// bottom: (-0.5*maxWidth/aspect)*this.scale +this.offsetY
			bottom: (-0.5*maxWidth/aspect)*this.scale
		});
		
		this.oCamera.updateProjectionMatrix();
	},
	enable() {
		//window.addEventListener("resize", this.updateFun);
		this.domElement.addEventListener("wheel", this.onWheel);
		// this.domElement.addEventListener("mousedown", this.onMousedown);
		// this.domElement.addEventListener("mouseup", this.onMouseup);
		this.update();
	},
	disable() {
		//window.removeEventListener("resize", this.updateFun);
		this.domElement.removeEventListener("wheel", this.onWheel);
		// this.domElement.removeEventListener("mousedown", this.onMousedown);
		// this.domElement.removeEventListener("mouseup", this.onMouseup);
	}
});

export {MapViewControls};
