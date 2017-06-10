import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-company_add',
    templateUrl: 'company_add.html'
})
export class CompanyAddPage {
    name: String;
    placement_date: String = new Date().toISOString();
    apiUrl:String = "http://placement-placement.7e14.starter-us-west-2.openshiftapps.com/";
    hasValidName: boolean = true;
    hasValidDate: boolean = true;
    constructor(public viewCtrl: ViewController, public http: Http) {
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


    saveCompany() { //Saves company to mongodb
        var validate = this.hasValidDate = this.hasValidName = true;
        if (this.name === undefined || this.name === null || this.name.length == 0) {
            this.hasValidName = false;
            validate = false;
        }
        if (this.placement_date === undefined || this.placement_date === null || ) {
            this.hasValidDate = false;
            validate = false;
        }
        if (!validate) return;
        var header = new Headers();
        header.append("content-type", "application/json")
        var dateArray = this.placement_date.split('-');
        dateArray[2] = (dateArray[2].split('T'))[0];
        let data = {
            "name": this.name,
            "placement_date": dateArray[1] + "-" + dateArray[2] + "-" + dateArray[0]
        };
    
        this.http.post(this.apiUrl + "api/companies/register", JSON.stringify(data), { headers: header }).subscribe(res => {
            console.log(res);
            if (res.status == 200) { //If saved successfully, dismiss the current view.
                this.viewCtrl.dismiss({});
            }
        });
    }
}