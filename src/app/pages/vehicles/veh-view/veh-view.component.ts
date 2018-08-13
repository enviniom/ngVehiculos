import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vehiculo, VehiclesService } from '../../../services/vehicles.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'veh-view',
  templateUrl: './veh-view.component.html',
  styleUrls: ['./veh-view.component.scss']
})
export class VehViewComponent implements OnInit, OnDestroy {

  // vehiculos: Vehiculo[];
  vehiculosOb$: Observable<Vehiculo[]>;
  // vehiculosSub: Subscription;

  constructor(private vehS: VehiclesService) {

    }

  ngOnInit() {
    this.vehiculosOb$ = this.vehS.getVehiculos();
    // this.vehiculosSub = this.vehS.getVehiculos().subscribe((data: Vehiculo[]) => {
    //   this.vehiculos = [];
    //   let vehs: Vehiculo;
    //   for (let index = 0; index < data.length; index++) {
    //     const vehs = data[index];
    //     if (vehs.fotoUrl.startsWith('vehiculos')) {

    //     }
    //   }
    // });
  }

  ngOnDestroy(): void {
    // if (this.vehiculosSub) {
    //   this.vehiculosSub.unsubscribe();
    // }
  }

}
