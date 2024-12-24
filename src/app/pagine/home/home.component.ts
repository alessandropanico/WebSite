import { Component, OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';

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
