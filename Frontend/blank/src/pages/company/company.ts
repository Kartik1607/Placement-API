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
    
    apiUrl:String = "http://placement-placement.7e14.starter-us-west-2.openshiftapps.com/";
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

    getCompanies() { //Gets list of all companies and assigns them to proper list
        this.isLoading = true;
        this.dataOriginal = [];
        this.upcoming_list = [];
        this.past_list = [];
        this.upcoming_sorted = this.past_sorted = false;
        this.http.get(this.apiUrl + 'api/companies') //Gets list of all companies
            .map(res => res.json()) //Converts to JSON
            .subscribe(res => {
                for (var i = 0; i < res.length; ++i) {
                    this.dataOriginal.push({
                        id: res[i]._id,
                        name: res[i].name,
                        placement_date: this.getDate(res[i].placement_date)
                    });
                    if (this.dataOriginal[i].placement_date < this.today) { //Adds company to correct list based on today date
                        this.past_list.push(this.dataOriginal[i]);
                    } else {
                        this.upcoming_list.push(this.dataOriginal[i]);
                    }
                }
                this.past_list.sort((a, b) => { //Sorts by date
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

    getDate(date: String): Date { //Converts string to date
        var d_Array = date.split("-");
        var d = new Date(+d_Array[2], +d_Array[0] - 1, +d_Array[1]);
        return d;
    }

    itemSelected(item) { 
        let c_info = this.modCtrl.create(CompanyInfoPage, {data : item}); //Shows company info page
        c_info.onDidDismiss(data=>{
            if(data === undefined || data === null) return; 
            this.getCompanies(); //Synchronize companies list again
        });
        c_info.present();
    }

    getDateString(date: Date): String { //Formats date for readability
        return date.getDate() + " " + this.monthNames[date.getMonth()] + " " + date.getFullYear();
    }

    onAddPressed(){
        let companyaddpage = this.popoverCtrl.create(CompanyAddPage); //Shows popup to register company
        companyaddpage.present();
        companyaddpage.onDidDismiss(data => {
            if(data === undefined || data === null) return;
            this.getCompanies();
        });
    }
  
}