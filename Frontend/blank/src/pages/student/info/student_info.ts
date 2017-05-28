import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController,AlertController, ViewController  } from 'ionic-angular';
import { StudentInfoEditPage } from '../info/student_edit'
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-student_info',
    templateUrl: 'student_info.html'
})
export class StudentInfoPage {

    monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    student_data: {
        student_id: string,
        name: string,
        department: string,
        roll_number: number,
        cgpa: number
    };

    pastCompanies:{
        company_id:string,
        name:string
        placement_date:Date
    }[] = [];

    upcomingCompanies:{
        company_id:string,
        name:string,
        placement_date:Date
    }[] = [];


    today: Date;
    
    department_string: string = "";
    constructor(public navCtrl: NavController, public navParams: NavParams, public popCtrl : PopoverController, public alertCtrl: AlertController, public http: Http, public viewCtrl : ViewController) {
        this.today = new Date();
        this.student_data = navParams.get("data");
        this.setDepartmentString();
        this.getCompanies();
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

    onDeletePressed(){
        let alert = this.alertCtrl.create({
            title:'Confirm Deletion',
            message:'Do you want to remove this student?',
            buttons: [
                {
                    text:'Cancel',
                    role:'cancel',
                    handler: () => {
                        console.log('Cancel Clicked');
                    }
                },
                {
                    text: 'Delete',
                    handler: () =>{
                        this.deleteStudent();
                    }
                }
            ]
        });
        alert.present();
    }

    deleteStudent(){
        this.http.delete("http://localhost:3456/api/students/register?sid=" + this.student_data.student_id).subscribe(res => {
            if (res.status == 200) {
                this.http.delete("http://localhost:3456/api/students/remove?id=" + this.student_data.student_id).subscribe(res => {
                    this.viewCtrl.dismiss({});
                });
            }
        });
    }

    getCompanies(){
        console.log("called");
        this.pastCompanies = [];
        this.upcomingCompanies = [];
        this.http.get("http://localhost:3456/api/students/register?sid=" +this.student_data.student_id)
        .map(res=>res.json())
        .subscribe(res=>{
            for(var i = 0 ; i < res.length ; ++i){
                let cid = res[i].company_Id;
                this.http.get("http://localhost:3456/api/companies?id="+cid).map(result=>result.json())
                .subscribe(result=>{
                    console.log(result);
                    var company = result[0];
                    let iDate = this.getDate(company.placement_date);
                    if(iDate < this.today){
                        this.pastCompanies.push({
                            company_id : cid,
                            name : company.name,
                            placement_date: iDate
                        });
                    }else{
                        this.upcomingCompanies.push({
                             company_id : cid,
                            name : company.name,
                            placement_date: iDate
                        });
                    }
                });
            }
        });
    }

    getDate(date: String): Date {
        var d_Array = date.split("-");
        var d = new Date(+d_Array[2], +d_Array[0] - 1, +d_Array[1]);
        return d;
    }

     getDateString(date: Date): String {
        return date.getDate() + " " + this.monthNames[date.getMonth()] + " " + date.getFullYear();
    }
}