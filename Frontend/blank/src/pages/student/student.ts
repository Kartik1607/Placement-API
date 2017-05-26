import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { PopOverPage } from '../student/popover'
import { StudentAddPage } from '../student/student_add'
import { StudentInfoPage } from '../student/info/student_info'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-student',
  templateUrl: 'student.html'
})
export class StudentPage {

  currentPageClass = this;
  alphaScrollItemTemplate: string = `
    <ion-item (click)="currentPageClass.onItemClick(item)">
      {{item.name}}
    </ion-item>
  `;
  triggerAlphaScrollChange: number = 0;

  students: {
    student_id: string,
    name: string,
    department: string,
    roll_number: number,
    cgpa: number
  }[] = [];

  filterData: {
    checkedCSE: boolean,
    checkedIT: boolean,
    checkedME: boolean,
    checkedCV: boolean,
    checkedBBA: boolean,
    checkedBCOM: boolean,
    checkedEEE: boolean,
    checkedECE: boolean,
  } = { checkedCSE: true, checkedIT: true, checkedME: true, checkedCV: true, checkedBBA: true, checkedBCOM: true, checkedEEE: true, checkedECE: true };


  dataOriginal = this.students;

  searchBarVisibility: boolean;

  constructor(public navCtrl: NavController, public http: Http, public popoverCtrl: PopoverController) {
    this.searchBarVisibility = false;
    this.getStudents();
  }

  onBackPressed() {
    this.navCtrl.pop();
  }

  onSearchPressed() {
    this.searchBarVisibility = true;
  }

  onSearchCancel(event) {
    this.students = this.getCurrentFilteredStudents();
    this.searchBarVisibility = false;
  }

  onMenuPressed(event) {
    let popover = this.popoverCtrl.create(PopOverPage, { filter: this.filterData });
    popover.present({ ev: event });

    popover.onDidDismiss(data => {
      if (data === null) return;
      this.filterData = data;
      this.onFilterChange();
      // console.log("CSE : " + this.filterData.checkedCSE);
      // console.log("IT : " + this.filterData.checkedIT);
      // console.log("ME : " + this.filterData.checkedME);
      // console.log("CV : " + this.filterData.checkedCV);
      // console.log("BBA : " + this.filterData.checkedBBA);
      // console.log("BCOM : " + this.filterData.checkedBCOM);
      // console.log("EEE : " + this.filterData.checkedEEE);
      // console.log("ECE : " + this.filterData.checkedECE);
    });
  }

  onFilterChange() {
    this.students = this.getCurrentFilteredStudents();
    this.triggerAlphaScrollChange++;
  }

  getCurrentFilteredStudents() {
    let currentData = [];
    for (var i = 0; i < this.dataOriginal.length; ++i) {
      if ((this.filterData.checkedCSE && this.dataOriginal[i].department == "CSE") ||
        (this.filterData.checkedIT && this.dataOriginal[i].department == "IT") ||
        (this.filterData.checkedME && this.dataOriginal[i].department == "ME") ||
        (this.filterData.checkedCV && this.dataOriginal[i].department == "CV") ||
        (this.filterData.checkedBBA && this.dataOriginal[i].department == "BBA") ||
        (this.filterData.checkedBCOM && this.dataOriginal[i].department == "BCOM") ||
        (this.filterData.checkedECE && this.dataOriginal[i].department == "ECE") ||
        (this.filterData.checkedEEE && this.dataOriginal[i].department == "EEE")) {
        currentData.push(this.dataOriginal[i]);
      }
    }
    return currentData;
  }

  onAddPressed() {
    let student_add = this.popoverCtrl.create(StudentAddPage);
    student_add.present();
    student_add.onDidDismiss(data => {
      console.log(data);
      if (data === null) return;
      this.getStudents();
    });
  }

  onSearchInput(event) {
    let val = event.target.value;
    this.students = this.getCurrentFilteredStudents();
    if (val && val.trim() != '') {
      this.students = this.students.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.triggerAlphaScrollChange++;
    }
  }

  getStudents() {
    this.dataOriginal = [];
    this.http.get('http://127.0.0.1:3456/api/students')
      .map(res => res.json())
      .subscribe(res => {
        for (var i = 0; i < res.length; ++i) {
          this.dataOriginal.push({
            student_id: res[i]._id,
            name: res[i].name,
            department: res[i].department,
            roll_number: res[i].rollno,
            cgpa: res[i].cgpa
          });
        }
        this.dataOriginal.sort((a, b) => {
          if (a.name < b.name) return -1;
          else if (a.name > b.name) return 1;
          else return 0;
        })
        this.students = this.getCurrentFilteredStudents()
        this.triggerAlphaScrollChange++;
      });
  }

  onItemClick(item) {
    this.navCtrl.push(StudentInfoPage, { data: item });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
