import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { ControlsComponent } from './controls/controls.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameboardService } from './gameboard.service';
import { PhaserModule } from 'phaser-component-library';

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    DashboardComponent
  ],
  imports: [
    PhaserModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [GameboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
