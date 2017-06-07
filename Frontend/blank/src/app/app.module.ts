import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Http, HttpModule } from '@angular/http'
import { Network } from "@ionic-native/network";
import { StudentPage } from '../pages/student/student';
import { HomePage } from '../pages/home/home';
import { PopOverPage } from '../pages/student/popover'
import { StudentAddPage } from '../pages/student/student_add'
import { StudentInfoEditPage } from '../pages/student/info/student_edit'
import { StudentInfoPage } from '../pages/student/info/student_info'
import { CompanyPage} from '../pages/company/company'
import { CompanyAddPage } from '../pages/company/company_add'
import { CompanyInfoPage } from '../pages/company/info/company_info'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonAlphaScrollModule } from 'ionic2-alpha-scroll';

@NgModule({
  declarations: [
    MyApp,
    StudentPage,
    PopOverPage,
    StudentAddPage,
    StudentInfoPage,
    StudentInfoEditPage,
    CompanyPage,
    CompanyAddPage,
    CompanyInfoPage,
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
    PopOverPage,
    StudentAddPage,
    StudentInfoPage,
    StudentInfoEditPage,
    CompanyPage,
    CompanyAddPage,
    CompanyInfoPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
