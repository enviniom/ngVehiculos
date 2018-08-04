import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

import { MENU_ITEMS } from './pages-menu';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit, OnDestroy {

  // TODO: Pasar a observables los userDetails

  ngOnInit() {
    if (window['dataLayer']) {
      window['dataLayer'].push({'event': 'optimize.activate'});
    }
    this.authS.getUserDetails().then((ud) => {
      this.updateMenu(ud);
    }).catch((err) => {
      console.log(err);
    })
  }

  ngOnDestroy() {
  }

  updateMenu(ud) {
    if (ud.rol.localeCompare('admin') === 0) {
      this.menu = MENU_ITEMS;
    }
  }

  constructor(private authS: AuthService) {
    this.menu = this.menu2;
  }

  menu: NbMenuItem[];
  menu2: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'fa fa-home fa-xs',
      link: '/pages/dashboard',
      home: true,
    },
    {
      title: 'Vehículos',
      icon: 'fa fa-truck fa-xs',
      link: '/pages/vehiculos/ver',
    },
  ];
}
