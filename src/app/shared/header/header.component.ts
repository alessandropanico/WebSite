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

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Imposta il canvas context per il menu evidenziato
    const canvas = this.elRef.nativeElement.querySelector('#menu-highlight') as HTMLCanvasElement;
    this.canvasContext = canvas.getContext('2d');
    this.initParticles();
    this.playBackgroundAudio();
  }

  // Inizializza l'audio di sfondo
  playBackgroundAudio() {
    const theme = new Audio('https://cdn.discordapp.com/attachments/303406782104207362/315769344972029952/main.ogg');
    theme.volume = 0.1;
    theme.play();
  }

  // Inizializza le particelle per l'animazione
  initParticles() {
    for (let i = 0; i < 10; i++) {
      this.particles.push(new Particle());
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
      // Aggiunge il messaggio dell'utente
      const message = this.renderer.createElement('div');
      this.renderer.setProperty(message, 'innerHTML', `[SureFourteen]: ${this.chatMessage}`);
      this.renderer.appendChild(chatLog, message);

      // Risposta automatica se il messaggio è "no u"
      if (this.chatMessage.trim().toLowerCase() === 'no u') {
        const genjiMessage = this.renderer.createElement('div');
        this.renderer.setProperty(genjiMessage, 'innerHTML', '[Genji]: Understandable, have a nice day');
        this.renderer.setStyle(genjiMessage, 'color', 'rgb(255, 66, 66)');
        this.renderer.appendChild(chatLog, genjiMessage);
      }
    }
    this.chatMessage = '';
    this.isChatActive = false;

    // Ripristina lo stato di visualizzazione della chat
    this.renderer.removeClass(this.elRef.nativeElement.querySelector('#chat-log'), 'active');
    this.renderer.removeClass(this.elRef.nativeElement.querySelector('#chat-input'), 'active');
    this.renderer.setStyle(this.elRef.nativeElement.querySelector('#enter'), 'display', 'flex');
  }

  highlight(event: MouseEvent) {
    const target = event.target as HTMLElement;
    this.offsetTop = target.offsetTop + 25;
    this.gradients = [1, 1, 0.9, 0.7, 0.6, 0.5, 0.5, 0.4, 0.3, 0];

    if (!this.isHighlightActive) {
      this.isHighlightActive = true;
      this.drawHighlight();
    }
  }

  // Disegna l'animazione di evidenziazione
  drawHighlight() {
    if (!this.canvasContext) return;

    this.canvasContext.clearRect(0, 0, 800, 600);

    // Crea il gradiente per l'effetto di evidenziazione
    const grH = this.canvasContext.createLinearGradient(0, 0, 600, 0);
    for (let i = 0; i < this.gradients.length; i++) {
      grH.addColorStop(i / 10, `rgba(255,255,255,${this.gradients[i]})`);
      if (this.gradients[i] > 0.1) this.gradients[i] -= 0.01;
    }

    this.canvasContext.fillStyle = grH;
    this.canvasContext.fillRect(0, this.offsetTop, 600, 10);

    // Disegna le particelle
    this.particles.forEach((particle, index) => {
      this.canvasContext.beginPath();
      this.canvasContext.arc(particle.left, this.offsetTop + 15 + particle.top, particle.radius, 0, 2 * Math.PI);
      this.canvasContext.fillStyle = `rgba(255,255,255,${particle.opacity})`;
      this.canvasContext.fill();

      particle.left += particle.speed;
      particle.opacity -= particle.disintegrateRate;

      if (particle.opacity < 0 || particle.left > 700) {
        this.particles[index] = new Particle();
      }
    });

    if (this.isHighlightActive) requestAnimationFrame(() => this.drawHighlight());
  }
}

// Definizione della classe Particle
class Particle {
  radius: number;
  top: number;
  left: number;
  speed: number;
  opacity: number;
  disintegrateRate: number;

  constructor() {
    this.radius = Math.random() * 1 + 0.5;
    this.top = Math.random() * 20 - 20;
    this.left = Math.random() * 100;
    this.speed = 1 / this.radius;
    this.opacity = 1;
    this.disintegrateRate = Math.random() * 0.005 + 0.001;
  }
}
