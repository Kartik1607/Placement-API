import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-student_add',
  templateUrl: 'student_add.html'
})
export class StudentAddPage {
  department: String ;
  name: String;
  roll_number: Number ;
  cgpa: Number;

  constructor(public viewCtrl: ViewController,  public http: Http) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  saveStudent(){
    
    var validate = true;
    if(this.name === undefined){
      //Show department error
      validate = false;
    }
    if(this.cgpa == undefined || this.cgpa < 0 || this.cgpa > 10){
      validate = false;
    }
    if(this.roll_number == undefined){
      validate = false;
    }
    if(this.department == undefined){
      validate = false;
    }
    if(!validate){
      console.log("ERROR");
    }else{
      console.log("Time to push");
      var header = new Headers();
      header.append("content-type", "application/json")
      let data = {
        "name" : this.name,
        "department" : this.department,
        "rollno" : this.roll_number,
        "cgpa" : this.cgpa
      };
      console.log(JSON.stringify(data));
      this.http.post("http://localhost:3456/api/students/add", JSON.stringify(data) , {headers : header}).subscribe(res => {
        if(res.status == 200){
          this.viewCtrl.dismiss({});
        }
      });
    }
  }
}