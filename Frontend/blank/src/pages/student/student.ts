import { Component } from '@angular/core';
import { NavController, PopoverController, ModalController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import { Network } from "@ionic-native/network";
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

  apiUrl:String = "http://nagarroplacement.eu-3.evennode.com/"; //URL of Backend server host
  isForRegister: boolean = false; 
  currentPageClass = this;
  alphaScrollItemTemplate: string = ``;
  triggerAlphaScrollChange: number = 0;
  totalSelected: number = 0;
  isLoading;

  //Student data structure
  students: {
    student_id: string,
    name: string,
    department: string,
    roll_number: number,
    cgpa: number,
    selected: boolean
  }[] = [];

  //Current Filter(based on department) data set
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
    public alertCtrl: AlertController, public platform: Platform, public network: Network) {
    this.searchBarVisibility = false; //By default searchbar is hidden
    this.getStudents(); //Get list of students from server
   // this.createFakeStudents();
    this.isForRegister = navParms.get("isRegister"); //Is page opened by a company to register student?
    this.alphaScrollItemTemplate = navParms.get("listTemplate"); //Update item template
    this.triggerAlphaScrollChange++; 
    this.connectionStatus = this.network.type;
    this.checkNetwork(); //Check network conenction
  }
 
  connectionStatus; 
  checkNetwork() {
        this.network.onConnect().subscribe(data=>{
          this.connectionStatus = this.network.type;
        });

        this.network.onDisconnect().subscribe(data=>{
          this.connectionStatus = this.network.type;
        })
    }

  onBackPressed() {
    if (this.isForRegister) { //Register is opened as a modalcontroller
      this.viewCtrl.dismiss({});
    } else { //Normal student list is opened as a push to NavigationContoller
      this.navCtrl.pop();
    }
  }

  onSearchPressed() {
    this.searchBarVisibility = true; //Shows searchbar
  }

  onSearchCancel(event) {
    this.students = this.getCurrentFilteredStudents(); //Reset filter 
    this.searchBarVisibility = false; //Hide searchbar
  }

  onMenuPressed(event) {
    let popover = this.popoverCtrl.create(PopOverPage, { filter: this.filterData }); //Show department filter menu
    popover.present({ ev: event });

    popover.onDidDismiss(data => {
      if (data === null) return; //If popup canceled
      this.filterData = data; //If popup Apply clicked
      this.onFilterChange();
    });
  }

  onFilterChange() {
    this.students = this.getCurrentFilteredStudents();
    this.triggerAlphaScrollChange++; //Update list
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
    let student_add = this.popoverCtrl.create(StudentAddPage); //Show popup to add new student
    student_add.present();
    student_add.onDidDismiss(data => {
      if (data === null) return; //If popup was cancelled
      this.getStudents(); //Retreive new list otherwise
    });
  }

  onSearchInput(event) { 
    let val = event.target.value; //Student name to search for
    this.students = this.getCurrentFilteredStudents();
    if (val && val.trim() != '') {
      this.students = this.students.filter((item) => { //Filter students based on current department filter
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1); //Additional filter based on search value
      });
      this.triggerAlphaScrollChange++; //Update list
    }
  }

  getStudents() {
    this.isLoading = true; //Show loading indicator
    this.dataOriginal = [];
    this.http.get(this.apiUrl + 'api/students')
      .map(res => res.json())  //Converts result to JSON
      .subscribe(res => { 
        for (var i = 0; i < res.length; ++i) {
          this.dataOriginal.push({ //Push data 
            student_id: res[i]._id,
            name: res[i].name,
            department: res[i].department,
            roll_number: res[i].rollno,
            cgpa: res[i].cgpa,
            selected: false
          });
        }
        this.dataOriginal.sort((a, b) => { //Sort data based on name [Alphabatically]
          if (a.name < b.name) return -1;
          else if (a.name > b.name) return 1;
          else return 0;
        })
        this.students = this.getCurrentFilteredStudents() //Aply filter based on department
        this.triggerAlphaScrollChange++; 
        this.isLoading = false; //Hide loading indicator
    });
  }

  onItemClick(item) {
    if (!this.isForRegister) { //If student was for list of students, open student info page
      let itemPage = this.modCtrl.create(StudentInfoPage, { data: item });
      itemPage.present();
      itemPage.onDidDismiss(data => {
        if (data === undefined || data === null) return; 
        this.getStudents(); //Update list
      });
    } else {
      if(item.selected) ++this.totalSelected; //If page was for student registration, add 1 to total selected
      else --this.totalSelected;
    }
  }

  onRegister() { //Only called if for ifForRegister == true
    let alert = this.alertCtrl.create({ //Shows alert Prompt to register selected students
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
          handler: () => { //Get new list of students who were selected
            var result =  this.dataOriginal.filter((item) => { //is Student was selected
              return item.selected;
            });
            this.viewCtrl.dismiss(result); //Send back result to company_info page
          }
        }
      ]
    });
    alert.present();
  }


//Generates a ranom integer >= min and <= max
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
  //     this.http.post(this.apiUrl + "api/students/add", JSON.stringify(data) , {headers : header}).subscribe(res => {
  //     });
  //   }
  // }
}
