import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Vehiculo {
  id?: string;
  placa: string;
  tipo: string;
  color: string;
  anio: string;
  marca: string;
  modelo?: string;
  an8?: string;
  proveedor?: string;
  contrato?: string;
  factura?: string;
  estado?: string;
  soat?: string;
  rtm?: string;
  horometro?: string;
  horasMant?: string;
  notas?: string;
  responsable?: string;
  eHidraulico?: string;
  fotoUrl?: string;
  fechaCreacion?: Date;
  fechaEdicion?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  private vehiculosCol: AngularFirestoreCollection<Vehiculo>;
  private vehiculoDoc: AngularFirestoreDocument<Vehiculo>;
  private vehiculos: Observable<Vehiculo[]>;


  constructor(private afs: AngularFirestore) {
    this.vehiculosCol = afs.collection('vehiculos');
    this.vehiculos = this.vehiculosCol.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Vehiculo;
          const id = a.payload.doc.id;
          return {id, ...data}
        })
      })
    );
  }

  addVehiculo(data: Vehiculo): Promise<DocumentReference> {
    return this.vehiculosCol.add(data);
  }

  updateVehiculo(id: string, data: Partial<Vehiculo>) {
    return this.vehiculosCol.doc(id).update(data);
  }

  getVehiculos(): Observable<Vehiculo[]> {
    return this.vehiculos;
  }

  deleteVehiculo(id: string) {
    return this.vehiculosCol.doc(id).delete();
  }

}
