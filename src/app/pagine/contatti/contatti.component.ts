import { Component, AfterViewInit, Renderer2, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrl: './contatti.component.css'
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
    const elements = this.document.querySelectorAll('.animate-top');
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
  }

}
