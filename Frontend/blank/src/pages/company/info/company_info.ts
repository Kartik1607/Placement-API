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

    students: {
        id: String,
        name: String,
        selected: boolean
    }[] = [];

    constructor(public viewCtrl: ViewController, public navParams: NavParams, public modalCtrl: ModalController, public http: Http,
        public alertCtrl: AlertController) {
        this.data = navParams.get("data");
        this.loadStudents();
    }

    onEditPressed() {
        this.isInEditMode = !this.isInEditMode;
    }

    onCancelPressed() {
        this.isInEditMode = false;
    }

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

    deleteStudents() {
        let stu = this.students.filter(item => {
            return item.selected;
        });
        for (var i = 0; i < stu.length; ++i) {
            this.http.delete("http://localhost:3456/api/students/register?cid=" + this.data.id + "&sid=" + stu[i].id)
                .subscribe(res => {
                    console.log(res);
                });
        }
        this.loadStudents();
        this.isInEditMode = false;
    }
    loadStudents() {
        this.students = [];
        this.http.get("http://localhost:3456/api/students/register?cid=" + this.data.id)
            .map(res => res.json()).subscribe(res => {
                for (var i = 0; i < res.length; ++i) {
                    let sid = res[i].student_Id;
                    this.http.get("http://localhost:3456/api/students?id=" + sid)
                        .map(result => result.json())
                        .subscribe(result => {
                            //console.log(result);
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
        let student_page = this.modalCtrl.create(StudentPage, {
            isRegister: true, listTemplate: `
        <ion-item >
            <ion-label>{{item.name}}</ion-label>
            <ion-checkbox [(ngModel)]="item.selected" (click)="currentPageClass.onItemClick(item)"></ion-checkbox>
        </ion-item>`});
        student_page.onDidDismiss(res => {
            if (res === undefined || res === null) return;
            for (var i = 0; i < res.length; ++i) {
                this.http.post("http://localhost:3456/api/students/register?cid=" + this.data.id + "&sid=" + res[i].student_id, "").subscribe(res => {
                    //console.log(res);
                });
            }
            this.loadStudents();
        });
        student_page.present();
    }


    deleteCompany() {
        this.http.delete("http://localhost:3456/api/companies/register?cid=" + this.data.id).subscribe(res => {
            if (res.status == 200) {
                this.viewCtrl.dismiss({});
            }
        });
    }

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