import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-student_add',
  templateUrl: 'student_add.html'
})
export class StudentAddPage {
  apiUrl:String = "http://placement-placement.7e14.starter-us-west-2.openshiftapps.com/";
  department: String ;
  name: String;
  roll_number: Number ;
  cgpa: Number;
  
  hasValidName: boolean = true;
  hasValidDepartment: boolean = true;
  hasValidCGPA: boolean = true;
  hasValidRollNo: boolean = true;

  constructor(public viewCtrl: ViewController,  public http: Http) {
  }

  dismiss() { //Back button
    this.viewCtrl.dismiss();
  }


  saveStudent(){
    this.hasValidName = this.hasValidDepartment = this.hasValidRollNo = this.hasValidCGPA = true;
    var validate = true;
    if(this.name === undefined || this.name.length == 0){
      this.hasValidName = false;
      validate = false;
    }
    if(this.cgpa == undefined || this.cgpa == null || this.cgpa < 0 || this.cgpa > 10){
      this.hasValidCGPA = false;
      validate = false;
    }
    if(this.roll_number == undefined || this.roll_number == null){
      this.hasValidRollNo = false;
      validate = false;
    }
    if(this.department == undefined || this.department == null || this.department.length == 0){
      this.hasValidDepartment = false;
      validate = false;
    }
    if(!validate){
      console.log("ERROR");
    }else{
      console.log("Time to push");
      var header = new Headers();
      header.append("content-type", "application/json");
      let data = {
        "name" : this.name,
        "department" : this.department,
        "rollno" : this.roll_number,
        "cgpa" : this.cgpa
      };
      console.log(JSON.stringify(data));
      this.http.post(this.apiUrl + "api/students/add", JSON.stringify(data) , {headers : header}).subscribe(res => {
        if(res.status == 200){
          this.viewCtrl.dismiss({});
        }
      });
    }
  }
}