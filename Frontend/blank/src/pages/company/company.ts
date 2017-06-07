import { Component } from '@angular/core';
import { NavController, PopoverController, ModalController } from 'ionic-angular';
import { PopOverPage } from '../student/popover'
import { StudentAddPage } from '../student/student_add'
import { StudentInfoPage } from '../student/info/student_info'
import { CompanyAddPage } from '../company/company_add'
import { CompanyInfoPage } from '../company/info/company_info'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-company',
    templateUrl: 'company.html'
})
export class CompanyPage {
    monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    companys: {
        id: String,
        name: String,
        placement_date: Date,
    }[] = [];
    
    apiUrl:String = "http://nagarroplacement.eu-3.evennode.com/";
    dataOriginal = this.companys;
    upcoming_list = this.companys;
    past_list = this.companys;
    today: Date;
    upcoming_sorted: boolean = false;
    past_sorted: boolean = false;
    isLoading: boolean = true;

    constructor(public navCtrl: NavController, public http: Http,  public popoverCtrl: PopoverController, public modCtrl : ModalController) {
        this.today = new Date();
        this.upcoming_list = [];
        this.past_list = [];
        this.getCompanies();
    }

    onBackPressed() {
        this.navCtrl.pop();
    }

    getCompanies() {
        this.isLoading = true;
        this.dataOriginal = [];
        this.upcoming_list = [];
        this.past_list = [];
        this.upcoming_sorted = this.past_sorted = false;
        this.http.get(this.apiUrl + 'api/companies')
            .map(res => res.json())
            .subscribe(res => {
                for (var i = 0; i < res.length; ++i) {
                    this.dataOriginal.push({
                        id: res[i]._id,
                        name: res[i].name,
                        placement_date: this.getDate(res[i].placement_date)
                    });
                    if (this.dataOriginal[i].placement_date < this.today) {
                        this.past_list.push(this.dataOriginal[i]);
                    } else {
                        this.upcoming_list.push(this.dataOriginal[i]);
                    }
                }
                this.past_list.sort((a, b) => {
                    if (a.placement_date < b.placement_date) return -1;
                    else if (a.placement_date > b.placement_date) return 1;
                    else return 0;
                });
                this.past_sorted = true;
                this.upcoming_list.sort((a, b) => {
                    if (a.placement_date < b.placement_date) return -1;
                    else if (a.placement_date > b.placement_date) return 1;
                    else return 0;
                });
                this.upcoming_sorted = true;
                this.isLoading = false;
            });
    }

    getDate(date: String): Date {
        var d_Array = date.split("-");
        var d = new Date(+d_Array[2], +d_Array[0] - 1, +d_Array[1]);
        return d;
    }

    itemSelected(item) {
        let c_info = this.modCtrl.create(CompanyInfoPage, {data : item});
        c_info.onDidDismiss(data=>{
            if(data === undefined || data === null) return;
            this.getCompanies();
        });
        c_info.present();
    }

    getDateString(date: Date): String {
        return date.getDate() + " " + this.monthNames[date.getMonth()] + " " + date.getFullYear();
    }

    onAddPressed(){
        let companyaddpage = this.popoverCtrl.create(CompanyAddPage);
        companyaddpage.present();
        companyaddpage.onDidDismiss(data => {
            if(data === undefined || data === null) return;
            this.getCompanies();
        });
    }
  
}