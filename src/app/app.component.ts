/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';

import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-app',
  template: ` <toaster-container></toaster-container>
              <router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService) {
  }

  ngOnInit() {
    this.analytics.trackPageViews();
  }
}
