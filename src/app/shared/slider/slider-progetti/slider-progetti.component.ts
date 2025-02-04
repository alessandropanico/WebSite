import {
  Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, Inject, PLATFORM_ID
} from '@angular/core';
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
  selector: 'app-slider-progetti',
  templateUrl: './slider-progetti.component.html',
  styleUrl: './slider-progetti.component.css'
})
export class SliderProgettiComponent implements OnInit, OnDestroy, AfterViewInit {
  slides: Slide[] = [];
  slidesPerView = 1;
  spaceBetween = 15;
  loop = true;
  autoplay = {
    delay: 3000,
    disableOnInteraction: false
  };
  breakpoints = {
    400: { slidesPerView: 1 },
    601: { slidesPerView: 1 }
  };

  isSwiperActive = false;
  private navigationSubscription?: Subscription; // ✅ Preveniamo possibili errori di `undefined`

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const originalSlides: Slide[] = [
        { imgSrc: 'assets/immaginiSliderHome/programmazione.jpg', altText: 'Profilo 1', title: 'Card 1', description: 'Descrizione della prima card' },
        { imgSrc: 'assets/immaginiSliderHome/youtube.jpg', altText: 'Profilo 2', title: 'Card 2', description: 'Descrizione della seconda card' },
        { imgSrc: 'assets/immaginiSliderHome/justice.jpg', altText: 'Profilo 3', title: 'Card 3', description: 'Descrizione della terza card' },
      ];

      // Duplichiamo le card per avere più elementi nello slider
      this.slides = [...originalSlides];

      // Sottoscrizione a NavigationEnd per ri-inizializzare Swiper solo su /home
      this.navigationSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && event.urlAfterRedirects === '/home') {
          this.reloadSwiper();
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

  reloadSwiper() {
    this.isSwiperActive = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isSwiperActive = true;
      this.cdr.detectChanges();
    }, 100);
  }

  ngOnDestroy() {
    this.navigationSubscription?.unsubscribe(); // ✅ Evitiamo memory leaks con `?.`
  }
}
