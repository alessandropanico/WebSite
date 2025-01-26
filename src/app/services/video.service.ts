// video.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  initializeVideos(): void {
    const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video');
    videos.forEach(video => {
      video.load(); // Ricarica il video per forzare il corretto avvio
      video.muted = true; // Muto per evitare restrizioni del browser
      video.play().catch(err => {
        console.warn('Errore nel riprodurre il video:', err);
      });
    });
  }
}
