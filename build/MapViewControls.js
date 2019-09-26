(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global['map-view-controls'] = {}));
}(this, function (exports) { 'use strict';

	//By Elias Hasle. Adapted from a vessel.js demo (also by Elias Hasle). Refined for a project under CPS lab in Ålesund.

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
		oCamera.far = oCamera.position.z;

		//Read mouse wheel input:	
		this.onWheel = e => {
			e.preventDefault();
			//console.log("Wheel event.");
			this.mouseX = e.offsetX;//e.clientX;
			this.mouseY = e.offsetY;//e.clientY;
			if (e.deltaY) {
				this.update(e.deltaY>0 ? 1 : e.deltaY<0 ? -1 : 0);
			}
		};
		
		this.onMouseDown = e => {
			if (e.button === 0) {
				this.mouseDown = true;
			}
		};
		this.onMouseUp = e => {
			if (e.button === 0) {
				this.mouseDown = false;
			}
		};
		this.onMouseMove = e => {
			if (this.mouseDown) {
				e.preventDefault();
				
				let width = this.domElement.clientWidth;
				let height = this.domElement.clientHeight;
				
				let convFactor = Math.min(
					(this.maxX-this.minX)/width,
					(this.maxY-this.minY)/height
				);
				
				this.oCamera.position.x -= e.movementX*convFactor*this.scale;
				this.oCamera.position.y += e.movementY*convFactor*this.scale;
			}
		};
		
		this.enable();
	}
	MapViewControls.prototype = Object.create(Object.prototype);

	Object.assign(MapViewControls.prototype, {
		constructor: MapViewControls,
		//This function updates the orthographic camera
		//wheel is wheel rotation direction, -1,0 or 1.
		update: function(wheel=0) {
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
			this.domElement.addEventListener("mousedown", this.onMouseDown);
			window.addEventListener("mouseup", this.onMouseUp);
			this.domElement.addEventListener("mousemove", this.onMouseMove);
			this.update();
		},
		disable() {
			this.domElement.removeEventListener("wheel", this.onWheel);
			this.domElement.removeEventListener("mousedown", this.onMouseDown);
			window.removeEventListener("mouseup", this.onMouseUp);
			this.domElement.removeEventListener("mousemove", this.onMousemove);
		}
	});

	exports.MapViewControls = MapViewControls;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
