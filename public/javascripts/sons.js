
class ControleSom{
	constructor(letras){
		var self = this;
		letras.forEach(letra=>{
			self.loadSound({
				path: `sons/${letra.letraUp}.mp3`,
				soundID: `som_${letra.code}`
			})
		});
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
}