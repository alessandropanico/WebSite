import { Component, OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    // Logica o inizializzazioni generali possono essere messe qui
  }

  ngAfterViewInit(): void {
    this.initializeVideos();
    this.animationTop();

  }

  animationTop() {
    // Seleziona tutti gli elementi con la classe 'animate-top'
    const elements = document.querySelectorAll('.animate-top');

    // Crea una funzione di callback per l'observer
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Aggiungi la classe 'active' solo quando l'elemento è visibile con un offset
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Interrompe l'osservazione dopo l'attivazione
        }
      });
    }, {
      root: null, // L'elemento di riferimento è il viewport
      rootMargin: '0px 0px -100px 0px', // Offset: -100px sul fondo, in modo che l'elemento inizi a essere animato un po' prima di entrare completamente nel viewport
      threshold: 0.1 // L'elemento deve essere visibile almeno per il 10%
    });

    // Osserva ogni elemento con la classe 'animate-top'
    elements.forEach(element => {
      observer.observe(element);
    });
  }

  initializeVideos(): void {
    const videos: NodeListOf<HTMLVideoElement> = this.el.nativeElement.querySelectorAll('video');
    videos.forEach(video => {
      video.load(); // Ricarica il video per forzare il corretto avvio
      video.muted = true; // Mute per evitare restrizioni del browser
      video.play().catch(err => {
        console.warn('Errore nel riprodurre il video:', err);
      });
    });
  }
}
