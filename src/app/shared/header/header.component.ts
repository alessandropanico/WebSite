import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  chatMessage: string = '';
  isChatActive: boolean = false;
  private canvasContext: CanvasRenderingContext2D | any = null;
  private offsetTop = -100;
  private gradients: number[] = [-1];
  private isHighlightActive = false;
  private particles: Particle[] = [];

  constructor(private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    // Imposta il canvas context per il menu evidenziato
    const canvas = this.elRef.nativeElement.querySelector('#menu-highlight') as HTMLCanvasElement;
    this.canvasContext = canvas.getContext('2d');
    this.initParticles(0, 0); // inizializza le particelle con una posizione di partenza
    this.playBackgroundAudio();
  }

  // Inizializza l'audio di sfondo
  playBackgroundAudio() {
    const theme = new Audio('https://cdn.discordapp.com/attachments/303406782104207362/315769344972029952/main.ogg');
    theme.volume = 0.1;
    theme.play();
  }

  // Inizializza le particelle per l'animazione
  initParticles(startX: number, startY: number) {
    const canvas = this.elRef.nativeElement.querySelector('#menu-highlight') as HTMLCanvasElement;
    const canvasWidth = canvas ? canvas.width : 0;
    const canvasHeight = canvas ? canvas.height : 0;

    // Crea le particelle con la posizione passata
    for (let i = 0; i < 10; i++) {
      // Centriamo le particelle nel canvas e aumentiamo la loro dimensione
      this.particles.push(new Particle(canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight));
    }
  }

  // Attiva/disattiva la modalità chat con l'Enter
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    if (this.isChatActive) {
      this.sendMessage();
    } else {
      this.activateChat();
    }
  }

  activateChat() {
    this.isChatActive = true;
    this.renderer.addClass(this.elRef.nativeElement.querySelector('#chat-log'), 'active');
    this.renderer.addClass(this.elRef.nativeElement.querySelector('#chat-input'), 'active');
    this.renderer.setStyle(this.elRef.nativeElement.querySelector('#enter'), 'display', 'none');
    setTimeout(() => {
      const chatInput = this.elRef.nativeElement.querySelector('#text') as HTMLInputElement;
      chatInput.focus();
    });
  }

  sendMessage() {
    const chatLog = this.elRef.nativeElement.querySelector('#chat-log');
    if (this.chatMessage.trim()) {
      const message = this.renderer.createElement('div');
      this.renderer.setProperty(message, 'innerHTML', `[SureFourteen]: ${this.chatMessage}`);
      this.renderer.appendChild(chatLog, message);

      if (this.chatMessage.trim().toLowerCase() === 'no u') {
        const genjiMessage = this.renderer.createElement('div');
        this.renderer.setProperty(genjiMessage, 'innerHTML', '[Genji]: Understandable, have a nice day');
        this.renderer.setStyle(genjiMessage, 'color', 'rgb(255, 66, 66)');
        this.renderer.appendChild(chatLog, genjiMessage);
      }
    }
    this.chatMessage = '';
    this.isChatActive = false;

    this.renderer.removeClass(this.elRef.nativeElement.querySelector('#chat-log'), 'active');
    this.renderer.removeClass(this.elRef.nativeElement.querySelector('#chat-input'), 'active');
    this.renderer.setStyle(this.elRef.nativeElement.querySelector('#enter'), 'display', 'flex');
  }

  highlight(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const canvas = this.elRef.nativeElement.querySelector('#menu-highlight') as HTMLCanvasElement;

    // Imposta la dimensione fissa per il canvas (la luce)
    const fixedSize = 150; // Dimensione fissa della luce (puoi modificarla come preferisci)

    // Usa una dimensione fissa per il canvas
    canvas.width = fixedSize;
    canvas.height = fixedSize;

    // Centra il canvas rispetto alla voce del menù
    canvas.style.left = `${target.offsetLeft + target.offsetWidth / 2 - fixedSize / 2}px`;
    canvas.style.top = `${target.offsetTop + target.offsetHeight / 2 - fixedSize / 2}px`;

    this.gradients = [1, 1, 0.9, 0.7, 0.6, 0.5, 0.5, 0.4, 0.3, 0];

    if (!this.isHighlightActive) {
      this.isHighlightActive = true;
      this.initParticles(target.offsetLeft + target.offsetWidth / 2, target.offsetTop + target.offsetHeight / 2); // Centra le particelle
      this.drawHighlight(target);  // Passa il target per il disegno della luce
    }
  }


  drawHighlight(target: HTMLElement) {
    if (!this.canvasContext) return;

    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);

    const canvasWidth = this.canvasContext.canvas.width;
    const canvasHeight = this.canvasContext.canvas.height;

    // Creazione di un gradiente radiale con dimensione fissa e centrato
    const gradient = this.canvasContext.createRadialGradient(
      canvasWidth / 2, canvasHeight / 2, 0,  // Centro del gradiente
      canvasWidth / 2, canvasHeight / 2, canvasWidth / 2 // Raggio del gradiente fisso
    );

    // Gestione della dissolvenza (solo una volta)
    for (let i = 0; i < this.gradients.length; i++) {
      gradient.addColorStop(i / 10, `rgba(0,191,255,${this.gradients[i]})`);
    }

    this.canvasContext.fillStyle = gradient;
    this.canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

    // Disegno delle particelle
    this.updateParticles(canvasWidth, canvasHeight);

    if (this.isHighlightActive) requestAnimationFrame(() => this.drawHighlight(target));
  }

  // Funzione per aggiornare le particelle
  updateParticles(canvasWidth: number, canvasHeight: number) {
    this.particles.forEach((particle, index) => {
      // Aggiorna la posizione della particella
      particle.update(canvasWidth, canvasHeight);

      const x = particle.left;
      const y = particle.top;
      const size = particle.radius * 2;

      // Disegna la particella con una forma personalizzata
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(x + 3, y); // angoli arrotondati
      this.canvasContext.lineTo(x + size - 3, y);
      this.canvasContext.quadraticCurveTo(x + size, y, x + size, y + 3);
      this.canvasContext.lineTo(x + size, y + size - 3);
      this.canvasContext.quadraticCurveTo(x + size, y + size, x + size - 3, y + size);
      this.canvasContext.lineTo(x + 3, y + size);
      this.canvasContext.quadraticCurveTo(x, y + size, x, y + size - 3);
      this.canvasContext.lineTo(x, y + 3);
      this.canvasContext.quadraticCurveTo(x, y, x + 3, y);

      this.canvasContext.fillStyle = `rgba(0, 191, 255, ${particle.opacity})`;
      this.canvasContext.fill();

      // Se la particella è fuori dai confini, la rimettiamo al centro
      if (particle.opacity <= 0 || particle.top > canvasHeight || particle.left < 0 || particle.left > canvasWidth) {
        this.particles[index] = new Particle(canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight);  // Nuova particella centrata
      }
    });
  }

}

// Classe Particle
class Particle {
  radius: number;
  top: number;
  left: number;
  speedY: number;
  speedX: number;
  opacity: number;
  disintegrateRate: number;

  constructor(startX: number, startY: number, canvasWidth: number, canvasHeight: number) {
    this.radius = Math.random() * 3 + 2;  // Aumentato il raggio per renderle più grandi
    this.left = startX;
    this.top = startY;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = 1;
    this.disintegrateRate = Math.random() * 0.005 + 0.001;
  }

  // Funzione per aggiornare la particella
  update(canvasWidth: number, canvasHeight: number) {
    this.top += this.speedY;
    this.left += this.speedX;

    // Gestisce il rimbalzo dai bordi
    if (this.left < 0 || this.left > canvasWidth) {
      this.speedX *= -1; // Inverti la direzione
    }

    if (this.top < 0 || this.top > canvasHeight) {
      this.speedY *= -1; // Inverti la direzione
    }

    // Gestisce la dissolvenza
    this.opacity -= this.disintegrateRate;
  }
}
