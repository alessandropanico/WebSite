import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-progetti',
  templateUrl: './progetti.component.html',
  styleUrls: ['./progetti.component.css']
})
export class ProgettiComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.animationTop();
      this.animationLeft();
      this.animationRight();
    }
  }

  animationTop() {
    if (isPlatformBrowser(this.platformId)) {
      const elements = document.querySelectorAll('.animate-top');

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

  animationLeft() {
    if (isPlatformBrowser(this.platformId)) {
      const elementsleft = document.querySelectorAll('.animate-left');

      const observerleft = new IntersectionObserver((entries, observer) => {
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

      elementsleft.forEach(elementleft => observerleft.observe(elementleft));
    }
  }

  animationRight() {
    if (isPlatformBrowser(this.platformId)) {
      const elementsRight = document.querySelectorAll('.animate-right');

      const observerRight = new IntersectionObserver((entries, observer) => {
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

      elementsRight.forEach(elementRight => observerRight.observe(elementRight));
    }
  }
}
