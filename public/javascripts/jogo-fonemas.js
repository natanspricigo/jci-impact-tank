const alfabeto = () => {
	return "abcdefghijklmnopqrstuvwxyz".split("").map(alpha => {
		return {
			letra: alpha,
			letraUp: alpha.toUpperCase(),
			codes: [alpha.charCodeAt(0), alpha.toUpperCase().charCodeAt(0)]
		}
	});
}


class Fonema{
	constructor(id, base, opts){
		this.block = document.getElementById(id);
		this.location = base;
		this.valocidade = opts.velocidade || 5;
		this.alturaBloco = opts.alturaBloco || 200;
		this.stop = false;
	}
	__random(min, max){
	    min = Math.ceil(min || 0);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	run(){
		this.top=0;
		this.block.style.left = this.__random(0, this.location.offsetHeight-50)+"px";
		this.interval = setInterval(()=>{
			var alturaAteChao = this.location.offsetHeight - (this.block.offsetTop - this.location.offsetTop + this.block.offsetHeight);
			if (this.block.offsetHeight >= this.alturaBloco) {
				this.top++;
			}

			if (alturaAteChao > 0 && this.top <= 0) {
				this.block.style.height = (this.block.offsetHeight+1)+"px"; // soma a altura
			}else{
				this.block.style.top = this.top+"px";
			}
			
			if ((alturaAteChao + this.block.offsetHeight - this.alturaBloco) < 0 && this.block.offsetHeight > 0){
				this.block.style.height = (this.block.offsetHeight - 1)+"px"; // diminui a altura
				this.top++;
				
				this.onReadBoard(this.block, this.block.offsetHeight);

				if (this.block.offsetHeight == 0) {
					this.stop = true;
				}
			}
			if (this.stop) {
				this.__stop();
			}
		},this.valocidade);
	}
	
	onComplete(){};
	onReadBoard(){};

	__stop(){
		clearInterval(this.interval); // destoi evento
		this.block.parentNode.removeChild(this.block);
		this.onComplete();
	}
}

class Fonemas{

	constructor(locationId){
		this.location = document.getElementById(locationId);
		this.velocidade = 10;
		this.alturaBloco = 200;
		this.pare= false;
	}
	sortearLetra(){
		var alfab = alfabeto();
		var sorteado = Math.floor(Math.random() * (Math.floor(alfab.length) -  Math.ceil(0) + 1)) +  Math.ceil(0);
		return alfab[sorteado];
	}

	start(){
		this.insert(this.sortearLetra());
	}

	createId(){
		return Math.random().toString(32).replace("0.","")
	}

	createBlock(letra, id){
		return `<div class="bloco-letra" id="${id}"><span>${letra}</span></div>`;
	}

	insert(letra){
		let id = this.createId();
		this.location.innerHTML= this.location.innerHTML + this.createBlock(letra.letraUp, id);
		var fon = new Fonema(id, this.location,{velocidade:this.velocidade, alturaBloco: this.alturaBloco});

		fon.onComplete = ()=>{
			if (!this.pare) {
				this.insert(this.sortearLetra());
			}
		};
		fon.onReadBoard = (bloco)=>{
			console.log("toucheable..."+bloco)
		};

		fon.run();
	}
}


