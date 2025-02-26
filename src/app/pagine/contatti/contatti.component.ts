import { Component, AfterViewInit, Renderer2, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css'] // Corretto il nome della proprietà da styleUrl a styleUrls
})
export class ContattiComponent implements AfterViewInit {

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    this.animationTop();
  }

  animationTop() {
    // Verifica se il codice è eseguito nel browser
    if (isPlatformBrowser(this.platformId)) {
      const elements = this.document.querySelectorAll('.animate-top');
      // Controllo se IntersectionObserver è supportato
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        }, {
          root: null,
          rootMargin: '0px 0px -100px 0px',
          threshold: 0.1
        });

        elements.forEach(element => observer.observe(element));
      } else {
        // Fallback per i browser che non supportano IntersectionObserver
        elements.forEach(element => {
          element.classList.add('active');
        });
      }
    }
  }
}
