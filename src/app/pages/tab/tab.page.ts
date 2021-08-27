import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
})
export class TabPage implements OnInit {

  selectTab: any;
  @ViewChild('tabs') tabs: IonTabs;

  constructor() { }

  ngOnInit() {
  }

  setCurrentTab(event){
    console.log(event);
    this.selectTab = this.tabs.getSelected();
  }

}
