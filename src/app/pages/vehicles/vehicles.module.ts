import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule, routedComponents } from './vehicles-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
// Smart table
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    VehiclesRoutingModule,
    Ng2SmartTableModule,
  ],
  declarations: [ ...routedComponents,],
})
export class VehiclesModule { }
