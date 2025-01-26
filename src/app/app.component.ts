import { AfterViewInit, Component } from '@angular/core';
import { VideoService } from './services/video.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{
  title = 'webSite';

  constructor(private videoService: VideoService) {}

  ngAfterViewInit(): void {
    this.videoService.initializeVideos();
  }

}
