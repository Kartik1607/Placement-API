import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController  } from 'ionic-angular';
import { StudentInfoEditPage } from '../info/student_edit'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-student_info',
    templateUrl: 'student_info.html'
})
export class StudentInfoPage {
    
    student_data: {
        student_id: string,
        name: string,
        department: string,
        roll_number: number,
        cgpa: number
    };
    department_string: string = "";
    constructor(public navCtrl: NavController, public navParams: NavParams, public popCtrl : PopoverController) {
        this.student_data = navParams.get("data");
        this.setDepartmentString();
    }
    onBackPressed() {
        this.navCtrl.pop();
    }

    setDepartmentString() {
        switch (this.student_data.department) {
            case "CSE": this.department_string = "CSE - Computer Science Engineer"; break;
            case "IT": this.department_string = "IT - Inforation and Technology"; break;
            case "BBA": this.department_string = "BBA - Bachelor of Business Administration"; break;
            case "BCOM": this.department_string = "BCom - Bachelor of Commerce"; break;
            case "ME": this.department_string = "ME - Mechanical Engineer"; break;
            case "CV": this.department_string = "CV - Civil Engineer"; break;
            case "EEE": this.department_string = "EEE - Electronic and Electrical Engineer"; break;
            case "ECE": this.department_string = "ECE - Electronics and Communications Engineer"; break;
        }
    }

    onEditPressed() {
        let temp_data = Object.assign({},this.student_data);
        let edit_page = this.popCtrl.create(StudentInfoEditPage,{data : temp_data});
        edit_page.present();
        edit_page.onDidDismiss(data=>{
            if(data === null) return;
            this.student_data = data;
            this.setDepartmentString();    
        });
    }
}