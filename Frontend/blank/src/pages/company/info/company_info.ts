import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, AlertController, ViewController, ModalController } from 'ionic-angular';
import { StudentPage } from '../../student/student'
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-company_info',
    templateUrl: 'company_info.html'
})
export class CompanyInfoPage {
    monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    data: {
        id: String,
        name: String,
        placement_date: Date,
    };

    isInEditMode: boolean = false;
    apiUrl:String = "http://placement-placement.7e14.starter-us-west-2.openshiftapps.com/";
  
    students: {
        id: String,
        name: String,
        selected: boolean
    }[] = [];

    isPast:boolean;

    constructor(public viewCtrl: ViewController, public navParams: NavParams, public modalCtrl: ModalController, public http: Http,
        public alertCtrl: AlertController) {
        this.data = navParams.get("data");
        let today = new Date();
        if(this.data.placement_date < today)  //Is placement for current company past today? If past, then edit,add button are hidden
            this.isPast = true;
        else 
            this.isPast = false;
        this.loadStudents();
    }

    onEditPressed() {
        this.isInEditMode = !this.isInEditMode;
    }

    onCancelPressed() {
        this.isInEditMode = false;
    }

//Unregisters selected students from company placement
    onUnregisterPressed() {
        let alert = this.alertCtrl.create({
            title: 'Confirm Unregistration',
            message: 'This will unregister selected students from placement.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel Clicked');
                    }
                },
                {
                    text: 'Unregister',
                    handler: () => {
                        this.deleteStudents();
                    }
                }
            ]
        });
        alert.present();

    }

//Remove student/s from company placement event
    deleteStudents() {
        let stu = this.students.filter(item =>  {//Gets list of selected students to remove
            return item.selected;
        });
        var deleted = 0;
        for (var i = 0; i < stu.length; ++i) {
            this.http.delete(this.apiUrl + "api/students/register?cid=" + this.data.id + "&sid=" + stu[i].id)
                .subscribe(res => {   
                    ++deleted;
                    if(deleted == stu.length){
                         this.loadStudents(); //Synchronize after deleting
                         this.isInEditMode = false;
                    }
             });
        }
       
    }

    loadStudents() { //Gets list of students registered
        this.students = [];
        this.http.get(this.apiUrl + "api/students/register?cid=" + this.data.id)
            .map(res => res.json()).subscribe(res => {
                for (var i = 0; i < res.length; ++i) {
                    let sid = res[i].student_Id;
                    this.http.get(this.apiUrl + "api/students?id=" + sid) //Gets name of all students
                        .map(result => result.json())
                        .subscribe(result => {
                            this.students.push({
                                id: sid,
                                name: result[0].name,
                                selected: false
                            });
                        });
                }
            });
    }

    getDateString(date: Date): String {
        return date.getDate() + " " + this.monthNames[date.getMonth()] + " " + date.getFullYear();
    }

    onBackPressed() {
        this.viewCtrl.dismiss(null);
    }

    onRegisterPressed() {
        let student_page = this.modalCtrl.create(StudentPage, { //Unlike student list , ion-checkbox is added as additional component for multi-select
            isRegister: true, listTemplate: `
        <ion-item >
            <ion-label>{{item.name}}</ion-label>
            <ion-checkbox [(ngModel)]="item.selected" (click)="currentPageClass.onItemClick(item)"></ion-checkbox>
        </ion-item>`});
        student_page.onDidDismiss(res => {
            if (res === undefined || res === null) return;
            for (var i = 0; i < res.length; ++i) {
                this.http.post(this.apiUrl + "api/students/register?cid=" + this.data.id + "&sid=" + res[i].student_id, "").subscribe(res => {
                    //console.log(res);
                });
            }
            this.loadStudents();
        });
        student_page.present();
    }

//Unregisters company from placement event.
    deleteCompany() {
        this.http.delete(this.apiUrl + "api/companies/register?cid=" + this.data.id).subscribe(res => {
            if (res.status == 200) {
                this.viewCtrl.dismiss({});
            }
        });
    }

//Shows alert to confirm deletion.
    onDeletePressed() {
        let alert = this.alertCtrl.create({
            title: 'Confirm Unregistration',
            message: 'Do you want to unregister ' + this.data.name + ' from placement ?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel Clicked');
                    }
                },
                {
                    text: 'Unregister',
                    handler: () => {
                        this.deleteCompany();
                    }
                }
            ]
        });
        alert.present();
    }
}