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

    constructor(public viewCtrl: ViewController, public http: Http) {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


    saveStudent() {
        var validate = true;
        if (this.name === undefined || this.name === null || this.name.length == 0) {
            validate = false;
        }
        if (this.placement_date === undefined || this.placement_date === null) {
            validate = false;
        }
        if (!validate) return;
        var header = new Headers();
        header.append("content-type", "application/json")
        var dateArray = this.placement_date.split('-');
        let data = {
            "name": this.name,
            "placement_date": dateArray[1] + "-" + dateArray[2] + "-" + dateArray[0]
        };
        
        this.http.post("http://localhost:3456/api/companies/register", JSON.stringify(data), { headers: header }).subscribe(res => {
            console.log(res);
            if (res.status == 200) {
                this.viewCtrl.dismiss({});
            }
        });
    }
}