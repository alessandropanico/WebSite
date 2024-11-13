import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(private elRef: ElementRef, private renderer: Renderer2, private router: Router,
    private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
      // Imposta il canvas context per il menu evidenziato
      const canvas = this.elRef.nativeElement.querySelector('#menu-highlight') as HTMLCanvasElement;
      this.canvasContext = canvas.getContext('2d');
      this.initParticles(0, 0); // inizializza le particelle con una posizione di partenza
      this.playBackgroundAudio();

      // Aggiungi sottoscrizione al router per aggiornare l'elemento 'highlight' quando cambia l'URL
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.updateMenuHighlight();
        });

      // Esegui la funzione iniziale per applicare il 'highlight' corretto
      this.updateMenuHighlight();
    }


  // Funzione per applicare l'evidenziazione al menu in base all'URL corrente
  private updateMenuHighlight(): void {
    const currentUrl = this.router.url;

    // Trova l'elemento che corrisponde all'URL attuale e applica 'highlight'
    const menuItems = this.elRef.nativeElement.querySelectorAll('li div');
    menuItems.forEach((item: HTMLElement) => {
      const routerLink = item.getAttribute('routerLink');
      if (routerLink && currentUrl.includes(routerLink)) {
        this.renderer.addClass(item, 'highlight');
      } else {
        this.renderer.removeClass(item, 'highlight');
      }
    });
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

    // Crea una singola particella ogni 100ms (modifica questo valore a seconda dell'effetto desiderato)
    const createParticleInterval = 100;

    let particleCreationInterval = setInterval(() => {
      if (this.particles.length < 20) { // Limita a 20 particelle per volta
        // Crea una particella centrata nel canvas
        this.particles.push(new Particle(canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight));
      } else {
        clearInterval(particleCreationInterval);  // Ferma la creazione delle particelle quando il limite è raggiunto
      }
    }, createParticleInterval);
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

    // Se non c'è un highlight attivo, attiviamo il fascio di luce
    if (!this.isHighlightActive) {
      this.isHighlightActive = true;
      this.initParticles(target.offsetLeft + target.offsetWidth / 2, target.offsetTop + target.offsetHeight / 2); // Centra le particelle
      this.drawHighlight(target);  // Passa il target per il disegno della luce
    }
  }

  // Aggiungi un evento per rimuovere il fascio di luce quando il mouse esce
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const menuItems = this.elRef.nativeElement.querySelectorAll('li div');

    let isMouseOverMenuItem = false;

    // Controlla se il mouse è sopra una voce del menu
    menuItems.forEach((item: HTMLElement) => {
      if (item.contains(target)) {
        isMouseOverMenuItem = true;
      }
    });

    // Se non c'è nessuna voce del menu su cui si sta passando, nascondi il fascio
    if (!isMouseOverMenuItem) {
      this.clearHighlight();  // Rimuovi il fascio di luce
    }
  }

  // Funzione per rimuovere il fascio di luce
  clearHighlight() {
    const canvas = this.elRef.nativeElement.querySelector('#menu-highlight') as HTMLCanvasElement;
    if (this.canvasContext) {
      this.canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Pulisce completamente il canvas
    }
    this.isHighlightActive = false;  // Disabilita il fascio di luce
  }



  drawHighlight(target: HTMLElement) {
    if (!this.canvasContext) return;

    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);

    const canvasWidth = this.canvasContext.canvas.width;
    const canvasHeight = this.canvasContext.canvas.height;

    // Creazione di un gradiente radiale con più bianco al centro
    const gradient = this.canvasContext.createRadialGradient(
      canvasWidth / 2, canvasHeight / 2, 0, // Centro del gradiente (bianco al centro)
      canvasWidth / 2, canvasHeight / 2, canvasWidth / 2 // Raggio del gradiente che si espande
    );

    // Aggiungi un gradiente con più bianco nel centro e azzurro all'esterno
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');  // Bianco al centro
    gradient.addColorStop(0.6, 'rgba(0, 191, 255, 0.5)'); // Azzurro al centro (meno intenso)
    gradient.addColorStop(1, 'rgba(0, 191, 255, 0)');    // Azzurro sfumato all'esterno

    this.canvasContext.fillStyle = gradient;

    // Parametri per controllare la forma del rombo
    const topHeight = canvasHeight / 4;  // Altezza della parte superiore
    const bottomHeight = canvasHeight * 0.75; // Altezza della parte inferiore (la distanza tra sopra e sotto)
    const width = canvasWidth * 0.5;  // Larghezza del rombo

    // Disegno del fascio di luce (rombo stretto in verticale e largo)
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(canvasWidth / 2, topHeight);  // Punto superiore
    this.canvasContext.quadraticCurveTo(canvasWidth + width, canvasHeight / 2, canvasWidth / 2, bottomHeight); // Lato destro arrotondato
    this.canvasContext.quadraticCurveTo(-width, canvasHeight / 2, canvasWidth / 2, topHeight); // Lato sinistro arrotondato
    this.canvasContext.closePath();
    this.canvasContext.fill();

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

      // Disegna la particella
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
