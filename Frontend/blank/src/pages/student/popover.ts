import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopOverPage {

  data: {
    checkedCSE : boolean,
    checkedIT : boolean,
    checkedME : boolean,
    checkedCV : boolean,
    checkedBBA : boolean,
    checkedBCOM : boolean,
    checkedEEE : boolean,
    checkedECE : boolean,
  } = { checkedCSE: true, checkedIT: true, checkedME: true, checkedCV: true, checkedBBA: true, checkedBCOM: true, checkedEEE: true, checkedECE: true};

  constructor(private viewCtrl: ViewController, private params: NavParams) {
    this.data = params.get("filter");
  }

  onApply(){
    this.viewCtrl.dismiss(this.data);
  }

  onCancel(){
    this.viewCtrl.dismiss(null);
  }

}
