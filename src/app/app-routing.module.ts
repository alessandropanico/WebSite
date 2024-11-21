import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pagine/home/home.component';
import { ContattiComponent } from './pagine/contatti/contatti.component';
import { ChisonoComponent } from './pagine/chisono/chisono.component';
import { ProgettiComponent } from './pagine/progetti/progetti.component';

const routes: Routes = [

{path:'home',component:HomeComponent},
{ path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirige la root a "home"
{path:'contatti',component:ContattiComponent},
{path:'chisono',component:ChisonoComponent},
{path:'progetti',component:ProgettiComponent}




];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
