import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehiclesComponent } from './vehicles.component';
import { VehListComponent } from './veh-list/veh-list.component';
import { VehViewComponent } from './veh-view/veh-view.component';

const routes: Routes = [{
  path:'',
  component: VehiclesComponent,
  children: [{
    path: 'listar',
    component: VehListComponent,
  },
  {
    path: 'ver',
    component: VehViewComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }

export const routedComponents = [
  VehiclesComponent,
  VehListComponent,
  VehViewComponent,
];
