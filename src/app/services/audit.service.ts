import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
/**
 * acción = crear, editar y eliminar
 * coleccion = indica la colección a la que se realiza la acción
 * descripcion = detalles de lo realizado
 * fecha = fecha en que se realiza la accion citada
 * autor = persona que realiza la acción
 **/

 export interface Evento {
  accion: string,
  coleccion: string,
  descripcion: string,
  fecha: Date,
  autor: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor( private db: AngularFirestore) { }

  addEvent(event: Evento, col: string): Promise<DocumentReference> {
    return this.db.collection(col).add(event);
  }
}
