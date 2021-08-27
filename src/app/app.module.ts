import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// Firebase
import { environment } from 'src/environments/environment';

// forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
            // AngularFireModule.initializeApp(environment.firebaseConfig),
            // AngularFireAuthModule,
            // AngularFireDatabaseModule,
            // AngularFireStorageModule,
            // AngularFirestoreModule,
            FormsModule,
            ReactiveFormsModule,
            IonicModule.forRoot(),
            AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
