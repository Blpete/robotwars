import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlsComponent } from './controls/controls.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameboardService } from './gameboard.service';
import { PhaserModule } from 'phaser-component-library';
import { HomepageComponent } from './homepage/homepage.component';
import { EntitytileComponent } from './entitytile/entitytile.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    DashboardComponent,
    HomepageComponent,
    EntitytileComponent
  ],
  imports: [
    PhaserModule,
    BrowserModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule
  ],
  providers: [GameboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
