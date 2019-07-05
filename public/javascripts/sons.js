
class ControleSom{
	constructor(letras){
		var self = this;
		letras.forEach(letra=>{
			self.loadSound({
				path: `sons/${letra.letraUp}.mp3`,
				soundID: `som_${letra.code}`
			});
		});
		this.pathErr = "sons_app/err.mp3";
		this.pathSuccess = "sons_app/success.mp3";

		self.loadSound({path: this.pathErr, soundID: "__error"});
		self.loadSound({path: this.pathSuccess, soundID: "__success"});
	}

	loadSound(som) {
		  createjs.Sound.registerSound(som.path, som.soundID);
	}
	play(letra){
		this.stop()
		createjs.Sound.play(`som_${letra.code}`, {interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1});
	}
	stop(){
		createjs.Sound.stop();
	}

	playError(){
		createjs.Sound.play("__error");
	}
	playSuccess(){
		createjs.Sound.play("__success");
	}
}