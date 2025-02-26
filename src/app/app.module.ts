import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pagine/home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ChisonoComponent } from './pagine/chisono/chisono.component';
import { ProgettiComponent } from './pagine/progetti/progetti.component';
import { ContattiComponent } from './pagine/contatti/contatti.component';
import { SliderHomeComponent } from './shared/slider/slider-home/slider-home.component';
import { SliderProgettiComponent } from './shared/slider/slider-progetti/slider-progetti.component';
import { CodingComponent } from './pagine/progetti/coding/coding/coding.component';
import { YoutubeComponent } from './pagine/progetti/coding/youtube/youtube.component';
import { JusticeComponent } from './pagine/progetti/coding/justice/justice.component';
import { ErrorPageComponent } from './pagine/error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ChisonoComponent,
    ProgettiComponent,
    ContattiComponent,
    SliderHomeComponent,
    SliderProgettiComponent,
    CodingComponent,
    YoutubeComponent,
    JusticeComponent,
    ErrorPageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    provideClientHydration()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Aggiungi questa riga

  bootstrap: [AppComponent],

})
export class AppModule { }
