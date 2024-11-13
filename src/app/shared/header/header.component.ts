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
    const canvas = this.elRef.nativeElement.querySelector('#menu-highlight') as HTMLCanvasElement;

    // Imposta la larghezza e altezza del canvas esattamente uguale alla voce
    canvas.width = target.offsetWidth;
    canvas.height = target.offsetHeight;

    // Posiziona il canvas sopra la voce di menu, mantenendo la luce sotto il testo
    canvas.style.left = `${target.offsetLeft}px`;
    canvas.style.top = `${target.offsetTop}px`;

    // Reimposta le sfumature e attiva l'animazione
    this.gradients = [1, 1, 0.9, 0.7, 0.6, 0.5, 0.5, 0.4, 0.3, 0];
    if (!this.isHighlightActive) {
      this.isHighlightActive = true;
      this.drawHighlight();
    }
  }



  // Disegna l'animazione di evidenziazione
  drawHighlight() {
    if (!this.canvasContext) return;

    // Pulisci il canvas
    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);

    // Crea il gradiente per l'effetto di evidenziazione
    const gradient = this.canvasContext.createLinearGradient(0, 0, this.canvasContext.canvas.width, 0);
    for (let i = 0; i < this.gradients.length; i++) {
      gradient.addColorStop(i / 10, `rgba(0,191,255,${this.gradients[i]})`);
      if (this.gradients[i] > 0.1) this.gradients[i] -= 0.01;
    }

    // Disegna la linea di evidenziazione sopra lo sfondo della voce di menu
    this.canvasContext.fillStyle = gradient;
    this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);

    // Disegna le particelle
    this.particles.forEach((particle, index) => {
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

      // Aggiorna le proprietà della particella
      particle.left += particle.speed;
      particle.opacity -= particle.disintegrateRate;

      // Reset delle particelle
      if (particle.opacity < 0 || particle.left > this.canvasContext.canvas.width) {
        this.particles[index] = new Particle();
      }
    });

    // Continua l'animazione
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
