import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlsComponent } from './controls/controls.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameboardService } from './gameboard.service';
import { HomepageComponent } from './homepage/homepage.component';
import { EntitytileComponent } from './entitytile/entitytile.component';


@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    DashboardComponent,
    HomepageComponent,
    EntitytileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [GameboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
