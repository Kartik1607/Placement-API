import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentPage } from '../student/student';
import { CompanyPage } from '../company/company';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController) {
  }

  //Open List of Students
  openStudent() {
    //isRegister : List of Students opened to register for a company?
    //listTemplate : Template for a single item of listView.
    this.navCtrl.push(StudentPage,{isRegister : false, listTemplate : `
        <ion-item (click)="currentPageClass.onItemClick(item)">
            <ion-label>{{item.name}}</ion-label>
        </ion-item>`});
  }

  //Open List of Companies
  openCompany(){
    this.navCtrl.push(CompanyPage)
  }

}
