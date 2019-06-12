
class KeysControl{

	constructor(){
		this.keyPressed = undefined;
		this.onPress = ()=>{};
	}

	stop(){
		document.onkeypress = function () {}
		this.keyPressed = undefined;
	}
	
	run(){
		var self = this;
		document.onkeypress = function (e) {
			self.keyPressed = e.keyCode;
			self.onPress(e.keyCode);
		};
	}
}