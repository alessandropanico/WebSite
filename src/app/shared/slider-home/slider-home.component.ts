import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface Slide {
  imgSrc: string;
  altText: string;
  title: string;
  description: string;
}
@Component({
  selector: 'app-slider-home',
  templateUrl: './slider-home.component.html',
  styleUrl: './slider-home.component.css'
})
export class SliderHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  slides: Slide[] = [];
  slidesPerView = 1;
  spaceBetween = 15;
  loop = true;
  autoplay = {
    delay: 1500,
    disableOnInteraction: false
  };
  breakpoints = {
    400: {
      slidesPerView: 1
    },
    601: {
      slidesPerView: 1
    }
  };

  isSwiperActive = false;
  private navigationSubscription!: Subscription;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const originalSlides: Slide[] = [
        { imgSrc: 'assets/immaginiSliderHome/youtube.jpg', altText: 'Slide 2', title: 'YouTube',
          description: 'Scopri il mio canale Youtube se sei un nerd! Iscriviti e aiutami! In futuro potrei aprirne anche altri!' },
        { imgSrc: 'assets/immaginiSliderHome/power.jpg', altText: 'Slide 2', title: "L'obbiettivo",
          description: 'Ciò che voglio è poter migliorare e portare/avere più argomenti possibili ed interessanti! Vieni a vedere!' },
        { imgSrc: 'assets/immaginiSliderHome/justice.jpg', altText: 'Slide 1', title: 'Justice',
           description: 'Justice è un opera che si basa su me stesso. Io, Dio, la intera vita. Una opera che racchiude tutta la mia vita, tutti i miei dolori, gioie, difficoltà e visione della vita stessa. Prenderà vita. Deve farlo' },
      ];


      // Inizializza gli slides
      this.slides = [...originalSlides, ...originalSlides, ...originalSlides];

      // Sottoscrizione a NavigationEnd per ri-inizializzare Swiper solo su /home
      this.navigationSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && event.urlAfterRedirects === '/home') {
          this.reloadSwiper(originalSlides);
        }
      });

      this.isSwiperActive = true;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isSwiperActive = true;
      this.cdr.detectChanges();
    }, 0);
  }

  reloadSwiper(originalSlides: Slide[]) {
    this.isSwiperActive = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.slides = [...originalSlides, ...originalSlides, ...originalSlides];
      this.isSwiperActive = true;
      this.cdr.detectChanges();
    }, 100);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
