import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-student_info_edit',
    templateUrl: 'student_info_edit.html'
})
export class StudentInfoEditPage {

    data: {
        student_id: string,
        name: string,
        department: string,
        roll_number: number,
        cgpa: number
    };

    apiUrl:String = "http://nagarroplacement.eu-3.evennode.com/";
  
    constructor(public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
        this.data = navParams.get("data");
    }

    saveStudent() {
        var validate = true;
        if (this.data.name === undefined) {
            validate = false;
        }
        if (this.data.cgpa == undefined || this.data.cgpa < 0 || this.data.cgpa > 10) {
            validate = false;
        }
        if (this.data.roll_number == undefined) {
            validate = false;
        }
        if (this.data.department == undefined) {
            validate = false;
        }
        if (!validate) {
            console.log("ERROR");
        } else {   
            var header = new Headers();
            header.append("content-type", "application/json")
            let data = {
                "name": this.data.name,
                "department": this.data.department,
                "rollno": this.data.roll_number,
                "cgpa": this.data.cgpa
            };
            console.log(JSON.stringify(data));
            this.http.post(this.apiUrl + "api/students/update?id=" + this.data.student_id, JSON.stringify(data), { headers: header }).subscribe(res => {
                if (res.status == 200) {
                    this.viewCtrl.dismiss(this.data);
                }
            });
        }
    }
}