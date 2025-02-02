import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chisono',
  templateUrl: './chisono.component.html',
  styleUrls: ['./chisono.component.css']
})
export class ChisonoComponent implements AfterViewInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) { // Verifica se siamo in un ambiente browser
      this.initAnimation('.animate-top');
      this.initAnimation('.animate-left');
      this.initAnimation('.animate-right');
    }
  }

  private initAnimation(className: string) {
    const elements = this.document.querySelectorAll(className);

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Interrompe l'osservazione dopo l'attivazione
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
  }
}
