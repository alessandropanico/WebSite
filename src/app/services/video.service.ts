import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  initializeVideos(): void {
    if (!isPlatformBrowser(this.platformId)) return; // Evita errori su SSR

    const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video');

    videos.forEach(video => {
      video.load(); // Ricarica il video per forzare il corretto avvio
      video.muted = true; // Muto per evitare restrizioni del browser

      // Tentativo di avviare il video solo se è pronto
      video.play().catch(err => {
        console.warn(`Errore nel riprodurre il video (${video.src}):`, err);
      });
    });
  }
}
