import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

//env
import { environment } from '../environments/environment';

//forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//services
import { AuthService } from './services/auth/auth.service';

//guards
import { AuthGuard } from '../app/guards/auth.guard';

// plugins
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SplashScreen} from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Ng2SearchPipeModule  } from 'ng2-search-filter';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
            AngularFireModule.initializeApp(environment.firebaseConfig),
            AngularFireAuthModule,
            AngularFireDatabaseModule,
            AngularFireStorageModule,
            AngularFirestoreModule,
            FormsModule,
            ReactiveFormsModule,
            Ng2SearchPipeModule,
            QRCodeModule,
            IonicModule.forRoot(),
            AppRoutingModule],
  providers: [AuthService,
              SplashScreen,
              StatusBar,
              Geolocation,
              CallNumber,
              AuthGuard, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
