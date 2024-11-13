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

    canvas.width = target.offsetWidth;
    canvas.height = target.offsetHeight;
    canvas.style.left = `${target.offsetLeft}px`;
    canvas.style.top = `${target.offsetTop}px`;

    this.gradients = [1, 1, 0.9, 0.7, 0.6, 0.5, 0.5, 0.4, 0.3, 0];
    if (!this.isHighlightActive) {
      this.isHighlightActive = true;
      this.initParticles(target.offsetLeft, target.offsetTop); // Passa anche startY
      this.drawHighlight(target);  // Passa il target per il disegno della luce
    }
  }

  drawHighlight(target: HTMLElement) {
    if (!this.canvasContext) return;

    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);

    // Creazione di un gradiente radiale da centro verso l'esterno
    const gradient = this.canvasContext.createRadialGradient(
      target.offsetWidth / 2, target.offsetHeight / 2, 0,
      target.offsetWidth / 2, target.offsetHeight / 2, target.offsetWidth / 2
    );

    for (let i = 0; i < this.gradients.length; i++) {
      gradient.addColorStop(i / 10, `rgba(0,191,255,${this.gradients[i]})`);
      // if (this.gradients[i] > 0.1) this.gradients[i] -= 0.01;
    }

    this.canvasContext.fillStyle = gradient;
    this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);

    this.particles.forEach((particle, index) => {
      particle.update(this.canvasContext.canvas.width, this.canvasContext.canvas.height);

      const x = particle.left;
      const y = particle.top;
      const size = particle.radius * 2;
      const cornerRadius = 3;

      this.canvasContext.beginPath();
      this.canvasContext.moveTo(x + cornerRadius, y);
      this.canvasContext.lineTo(x + size - cornerRadius, y);
      this.canvasContext.quadraticCurveTo(x + size, y, x + size, y + cornerRadius);
      this.canvasContext.lineTo(x + size, y + size - cornerRadius);
      this.canvasContext.quadraticCurveTo(x + size, y + size, x + size - cornerRadius, y + size);
      this.canvasContext.lineTo(x + cornerRadius, y + size);
      this.canvasContext.quadraticCurveTo(x, y + size, x, y + size - cornerRadius);
      this.canvasContext.lineTo(x, y + cornerRadius);
      this.canvasContext.quadraticCurveTo(x, y, x + cornerRadius, y);
      this.canvasContext.fillStyle = `rgba(0, 191, 255, ${particle.opacity})`;
      this.canvasContext.fill();

      if (particle.opacity <= 0 || particle.top > this.canvasContext.canvas.height) {
        this.particles[index] = new Particle(this.canvasContext.canvas.width / 2, this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);  // Nuova particella centrata
      }
    });

    if (this.isHighlightActive) requestAnimationFrame(() => this.drawHighlight(target));
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

  update(canvasWidth: number, canvasHeight: number) {
    this.top += this.speedY;
    this.left += this.speedX;

    if (this.left < 0 || this.left > canvasWidth) {
      this.speedX *= -1;
    }

    this.opacity -= this.disintegrateRate;

    if (this.opacity <= 0) {
      this.top = Math.random() * 20 - 10;
      this.left = canvasWidth / 2;
      this.opacity = 1;
    }
  }
}
