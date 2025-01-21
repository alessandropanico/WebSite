import { Component, AfterViewInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-chisono',
  templateUrl: './chisono.component.html',
  styleUrls: ['./chisono.component.css']
})
export class ChisonoComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Aggiungi la classe 'active' dopo un breve ritardo
    setTimeout(() => {
      $('.animate-top').addClass('active');
    }, 200); // Ritardo di 500ms
  }
}
