import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Http, HttpModule } from '@angular/http'

import { StudentPage } from '../pages/student/student';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { PopOverPage } from '../pages/student/popover'
import { StudentAddPage } from '../pages/student/student_add'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonAlphaScrollModule } from 'ionic2-alpha-scroll';

@NgModule({
  declarations: [
    MyApp,
    StudentPage,
    ContactPage,
    PopOverPage,
    StudentAddPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonAlphaScrollModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StudentPage,
    ContactPage,
    PopOverPage,
    StudentAddPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
