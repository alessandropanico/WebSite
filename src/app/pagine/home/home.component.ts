import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    this.initializeVideos();
  }

  initializeVideos(): void {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.load(); // Ricarica il video per forzare il corretto avvio
      video.play().catch(err => {
        console.error('Errore nel riprodurre il video:', err);
      });
    });
  }
}
