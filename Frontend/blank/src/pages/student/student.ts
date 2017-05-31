import { Component } from '@angular/core';
import { NavController, PopoverController, ModalController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { PopOverPage } from '../student/popover'
import { StudentAddPage } from '../student/student_add'
import { StudentInfoPage } from '../student/info/student_info'
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-student',
  templateUrl: 'student.html'
})
export class StudentPage {

  isForRegister: boolean = false;
  currentPageClass = this;
  alphaScrollItemTemplate: string = ``;
  triggerAlphaScrollChange: number = 0;
  totalSelected: number = 0;

  students: {
    student_id: string,
    name: string,
    department: string,
    roll_number: number,
    cgpa: number,
    selected: boolean
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

  constructor(public navCtrl: NavController, public http: Http,
    public popoverCtrl: PopoverController, public modCtrl: ModalController,
    public navParms: NavParams, public viewCtrl: ViewController,
    public alertCtrl: AlertController) {
    this.searchBarVisibility = false;
    this.getStudents();
   // this.createFakeStudents();
    this.isForRegister = navParms.get("isRegister");
    this.alphaScrollItemTemplate = navParms.get("listTemplate");
    this.triggerAlphaScrollChange++;
  }

  onBackPressed() {
    if (this.isForRegister) {
      this.viewCtrl.dismiss({});
    } else {
      this.navCtrl.pop();
    }
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
      });
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
            cgpa: res[i].cgpa,
            selected: false
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
    if (!this.isForRegister) {
      let itemPage = this.modCtrl.create(StudentInfoPage, { data: item });
      itemPage.present();
      itemPage.onDidDismiss(data => {
        if (data === undefined || data === null) return;
        this.getStudents();
      });
    } else {
      if(item.selected) ++this.totalSelected;
      else --this.totalSelected;
    }
  }

  onRegister() {
    let alert = this.alertCtrl.create({
      title: 'Register Student',
      message: "Register " + this.totalSelected + (this.totalSelected == 1 ? " student ? " : " students ?"),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel Clicked');
          }
        },
        {
          text: 'Register',
          handler: () => {
            var result =  this.dataOriginal.filter((item) => {
              return item.selected;
            });
            this.viewCtrl.dismiss(result);
          }
        }
      ]
    });
    alert.present();
  }


  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // createFakeStudents(){
  //   let names = ["Aahna","Aarzoo","Akriti","Ananya","Anmol","Avani","Babita","Bhaagyasree","Bhanu","Bharati","Bhoomi","Chahat","Charu","Chetna","Chhavi","Chhaya","Damini","Darpana","Deepal","Dipti","Divya","Ekaja","Ekanshi","Ekta","Ena","Esha","Falguni","Gargi","Garima","Garvita","Gehna","Gunjan","Heena","Hema","Hetal","Himani","Indira","Ira","Isha","Ishika","Ishita","Jagriti","Janhavi","Jhalak","Jiya","Juhi","Kaajal","Kaavya","Kanak","Kanika","Karishma","Kashish","Khushi","Kinjal","Kirti","Komal","Koyal","Kshipra","Latika","Laveena","Lavleen","Lipi","Lipika","Madhuri","Mallika","Mansi","Mayuari","Mehar","Mridul","Naina","Nandini","Neeta","Neharika","Nidhi","Niyati","Nupur","Ojaswini","Palak","Pallavi","Pari","Prajakta","Pratibha","Praveen","Preeti","Prerena","Priya","Raakhi","Raashi","Radha","Ragini","Rajni","Riya","Ruhi","Sachi","Saloni","Sejal","Shagun","Shefali","Shilpa","Vasudha","Aaditya","Aarya","Abhay","Abhijeet","Abhinandan","Abhinay","Abhishek","Abimanyu","Aditya","Akhil","Akshat","Anil","Avi","Balaraam","Bharat","Bhaskar","Bhaumik","Bijay","Brijesh","Chandan","Chetan","Chirag","Chiranjeeve","Daksh","Daman","Depen","Dev","Dhruv","Divyanshu","Ekambar","Ekansh","Ekaraj","Eklavya","Elilarasan","Falak","Gagan","Gajendra","Garv","Gaurav","Gautam","Hardik","Harsh","Hemant","Hridaya","Indivar","Indra","Indraneel","Ishaan","Ishwar","Jai","Jaideep","Jatindra","Jayant","Kabir","Kamal","Kanha","Kartik","Kush","Lakhan","Lakshya","Lingam","Madhu","Manas","Manav","Mayank","Mihir","Milind","Nakul","Nikhil","Nischay","Nitish","Ojas","Om","Palash","Paras","Piyush","Pushkal","Rachit","Rahul","Rajan","Rajesh","Ranganathan","Ravi","Rohit","Sachin","Sahil","Sajan","Sameer","Satya","Saumil","Saurav","Tanish","Tanmay","Tejas","Tushar","Ujjwal","Vasu","Vidit","Vijay","Vishvas"];
  //   let departments = ["CSE","IT","ME","CV","BBA","BCOM","EEE","ECE"];
  //   var header = new Headers();
  //   header.append("content-type", "application/json");
  //   for(var i = 0; i < names.length; ++i){
  //     let data = {
  //       "name" : names[i],
  //       "department" : departments[this.getRandomInt(0,7)],
  //       "rollno" : this.getRandomInt(0,100) + '',
  //       "cgpa" : this.getRandomInt(0,100)/10 + ''
  //     };
  //     this.http.post("http://localhost:3456/api/students/add", JSON.stringify(data) , {headers : header}).subscribe(res => {
  //     });
  //   }
  // }
}
