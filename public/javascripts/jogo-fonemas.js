const alfabeto = () => {
	return "abcdefgijklmnopqrstuvz".split("").map(alpha => {
		return {
			letra: alpha,
			letraUp: alpha.toUpperCase(),
			code: alpha.charCodeAt(0),
			codeUp: alpha.toUpperCase().charCodeAt(0)
		}
	});
}

class Fonema {
	constructor(id, base, opts) {
		this.block = document.getElementById(id);
		this.location = base;
		this.valocidade = opts.velocidade || 5;
		this.alturaBloco = opts.alturaBloco || 200;
		this.stop = false;
	}
	__random(min, max) {
		min = Math.ceil(min || 0);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	run() {
		this.top = 0;
		this.block.style.left = this.__random(0, this.location.offsetHeight - 50) + "px";
		this.interval = setInterval(() => {
			var alturaAteChao = this.location.offsetHeight - (this.block.offsetTop - this.location.offsetTop + this.block.offsetHeight);
			if (this.block.offsetHeight >= this.alturaBloco) {
				this.top++;
			}

			if (alturaAteChao > 0 && this.top <= 0) {
				this.block.style.height = (this.block.offsetHeight + 1) + "px"; // soma a altura
			} else {
				this.block.style.top = this.top + "px";
			}

			this.onReadBoard(this.block.dataset.code, this.block, this.block.offsetHeight);

			if ((alturaAteChao + this.block.offsetHeight - this.alturaBloco) < 0 && this.block.offsetHeight > 0) {
				this.block.style.height = (this.block.offsetHeight - 1) + "px"; // diminui a altura
				this.top++;
				if (this.block.offsetHeight == 0) {
					this.stop = true;
				}
			}
			if (this.stop) {
				this.__stop();
			}
		}, this.valocidade);
	}

	onComplete() {};
	onReadBoard() {};

	__stop() {
		clearInterval(this.interval); // destoi evento
		this.block.parentNode.removeChild(this.block);
		this.onComplete();
	}
}

class Fonemas {

	constructor(locationId) {
		this.location = document.getElementById(locationId);
		this.velocidade = 10;
		this.alturaBloco = 200;
		this.pare = false;
		this.mostrarLetra = false;
		this.keysControl = {
			run: () => {},
			stop: () => {}
		};
		this.loadSons();
	}

	loadSons() {
		this.controleSom = new ControleSom(alfabeto());
	}

	sortearLetra() {
		var alfab = alfabeto();
		var sorteado = Math.floor(Math.random() * (Math.floor(alfab.length) - Math.ceil(0) + 1)) + Math.ceil(0);
		return alfab[sorteado];
	}

	start() {
		this.insert(this.sortearLetra());
	}
	stop() {
		this.keysControl.stop();
		this.controleSom.stop();
		var elems = document.querySelector(".bloco-letra");
		if (elems) {
			elems.remove();
		}
	}

	createId() {
		return Math.random().toString(32).replace("0.", "");
	}

	createBlock(letra, id) {
		return `<div class="bloco-letra" data-code="${letra.code}" id="${id}"><span>${this.mostrarLetra ? letra.letraUp : ''}</span></div>`;
	}

	getLetraPressionada() {
		return 0;
	}
	acerto(){
		var atual = Number(document.querySelector(".acertos .acerto").innerText);
		document.querySelector(".acertos .acerto").innerText = atual+1;
	}
	erro(){
		var atual = Number(document.querySelector(".acertos .erro").innerText);
		document.querySelector(".acertos .erro").innerText = atual+1;
	}

	insert(letra) {
		let id = this.createId();
		this.location.innerHTML = this.location.innerHTML + this.createBlock(letra, id);
		var fon = new Fonema(id, this.location, {
			velocidade: this.velocidade,
			alturaBloco: this.alturaBloco
		});
		this.controleSom.play(letra);

		fon.onComplete = () => {
			if (!this.pare) {
				this.insert(this.sortearLetra());
			}
			this.keysControl.stop();
		};

		fon.onReadBoard = (code, bloco) => {
			this.keysControl.run();
			var letra = this.getLetraPressionada();
			if (this.__ultimaLetraLida && this.__ultimaLetraLida == letra) {
				return;
			}
			if (code == letra) {
				bloco.style.backgroundColor = "green";
				this.controleSom.playSuccess();
				this.acerto();
			} else if (letra) {
				bloco.style.backgroundColor = "red";
				this.controleSom.playError();
				this.erro();
			}
			this.__ultimaLetraLida = letra||0;
		};

		fon.run();
	}
}