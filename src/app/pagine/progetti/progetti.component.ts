import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-progetti',
  templateUrl: './progetti.component.html',
  styleUrl: './progetti.component.css'
})
export class ProgettiComponent implements AfterViewInit {

  ngAfterViewInit(): void {

    this.animationTop();
    this.animationLeft();
    this.animationRight();

  }


  animationTop() {
    // Seleziona tutti gli elementi con la classe 'animate-top'
    const elements = document.querySelectorAll('.animate-top');

    // Crea una funzione di callback per l'observer
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Aggiungi la classe 'active' solo quando l'elemento è visibile con un offset
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Interrompe l'osservazione dopo l'attivazione
        }
      });
    }, {
      root: null, // L'elemento di riferimento è il viewport
      rootMargin: '0px 0px -100px 0px', // Offset: -100px sul fondo, in modo che l'elemento inizi a essere animato un po' prima di entrare completamente nel viewport
      threshold: 0.1 // L'elemento deve essere visibile almeno per il 10%
    });

    // Osserva ogni elemento con la classe 'animate-top'
    elements.forEach(element => {
      observer.observe(element);
    });
  }


  animationLeft() {
    // Seleziona tutti gli elementi con la classe 'animate-left'
    const elementsleft = document.querySelectorAll('.animate-left');

    // Crea una funzione di callback per l'observer
    const observerleft = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Aggiungi la classe 'active' solo quando l'elemento è visibile con un offset
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Interrompe l'osservazione dopo l'attivazione
        }
      });
    }, {
      root: null, // L'elemento di riferimento è il viewport
      rootMargin: '0px 0px -100px 0px', // Offset: -100px sul fondo, in modo che l'elemento inizi a essere animato un po' prima di entrare completamente nel viewport
      threshold: 0.1 // L'elemento deve essere visibile almeno per il 10%
    });

    // Osserva ogni elemento con la classe 'animate-left'
    elementsleft.forEach(elementleft => {
      observerleft.observe(elementleft);
    });
  }

  animationRight() {
    // Seleziona tutti gli elementi con la classe 'animate-right'
    const elementsRight = document.querySelectorAll('.animate-right');

    // Crea una funzione di callback per l'observer
    const observerRight = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Aggiungi la classe 'active' solo quando l'elemento è visibile con un offset
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Interrompe l'osservazione dopo l'attivazione
        }
      });
    }, {
      root: null, // L'elemento di riferimento è il viewport
      rootMargin: '0px 0px -100px 0px', // Offset: -100px sul fondo, in modo che l'elemento inizi a essere animato un po' prima di entrare completamente nel viewport
      threshold: 0.1 // L'elemento deve essere visibile almeno per il 10%
    });

    // Osserva ogni elemento con la classe 'animate-right'
    elementsRight.forEach(elementRight => {
      observerRight.observe(elementRight);
    });
  }

//-----------------------------------------------------














}
