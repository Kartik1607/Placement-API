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
    apiUrl:String = "http://nagarroplacement.eu-3.evennode.com/";
  
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
        dateArray[2] = (dateArray[2].split('T'))[0];
       // console.log(this.placement_date);
       // console.log(dateArray);
        let data = {
            "name": this.name,
            "placement_date": dateArray[1] + "-" + dateArray[2] + "-" + dateArray[0]
        };

     //   console.log(JSON.stringify(data));
        
        this.http.post(this.apiUrl + "api/companies/register", JSON.stringify(data), { headers: header }).subscribe(res => {
            console.log(res);
            if (res.status == 200) {
                this.viewCtrl.dismiss({});
            }
        });
    }
}