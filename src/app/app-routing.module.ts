import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pagine/home/home.component';
import { ContattiComponent } from './pagine/contatti/contatti.component';
import { ChisonoComponent } from './pagine/chisono/chisono.component';
import { ProgettiComponent } from './pagine/progetti/progetti.component';
import { CodingComponent } from './pagine/progetti/coding/coding/coding.component';
import { YoutubeComponent } from './pagine/progetti/coding/youtube/youtube.component';
import { JusticeComponent } from './pagine/progetti/coding/justice/justice.component';

const routes: Routes = [

  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'contatti', component: ContattiComponent },
  { path: 'chisono', component: ChisonoComponent },
  { path: 'progetti', component: ProgettiComponent },


  //progetti
  { path: 'coding', component:CodingComponent},
  { path: 'youtube', component:YoutubeComponent},
  { path: 'justice', component: JusticeComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
