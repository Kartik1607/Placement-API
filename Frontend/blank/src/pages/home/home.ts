import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { StudentPage } from '../student/student'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {
  }

  openStudent() {
    this.navCtrl.push(StudentPage);
  }

  openCompany(){

  }

}
