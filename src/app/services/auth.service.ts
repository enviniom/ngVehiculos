import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable, Subscription, from, of as observableOf } from "rxjs";
import { map, switchMap, tap, flatMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public user$: Observable<firebase.User>;
  public user: firebase.User = null;
  public userDetails: User;
  private userSub: Subscription;
  private userDoc: AngularFirestoreDocument<User>;

  constructor(
    private afa: AngularFireAuth,
    private db: AngularFirestore
  ) {

    this.user$ = this.afa.authState;
    this.subscribeUser();
  }

  // Para subscribir el usuario
  subscribeUser() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    this.userSub = this.user$.pipe(
      tap(u => {
        this.user = u;
        console.log('this.user ', this.user);
      }),
      flatMap(u => this.db.doc<User>(`users/${u.uid}`).valueChanges())
    ).subscribe(ud => {
      if (ud) {
        this.userDetails = ud;
        console.log('this.userDetails ', this.userDetails);
      } else {
        this.userDetails = null;
        console.log('this.userDetails null', ud);
      }
    });
  }

  // Para registro de usuarios
  getUsers() {
    return this.db.collection<User>('users').valueChanges();
  }

  registerUser(email, pass) {
    return this.afa.auth.createUserWithEmailAndPassword(email, pass)
  }

  createUserDetails(user: User) {
    return this.db.doc<User>(`users/${user.uid}`).set(user)
  }

  updateUser(user: User) {
    this.userDoc = this.db.doc(`users/${user.uid}`);
    this.userDoc.update(user);
  }

  getRol() {
    return this.db.collection('/roles').valueChanges();
  }

  // Para iniciar sesión
  signInWithEmail(email, pass) {
    return this.afa.auth.signInWithEmailAndPassword(email, pass)
  }

  // Para recuperar contraseña
  requestPass(email, actionCodeSettings) {
    return this.afa.auth.sendPasswordResetEmail(email, actionCodeSettings);
  }

  confirmPasswordReset(code, newPassword) {
    // param: oobCode=<code>
    return this.afa.auth.confirmPasswordReset(code, newPassword);
  }

  verifyPasswordResetCode(code){
    return this.afa.auth.verifyPasswordResetCode(code);
  }


  // metodos transversales
  logout() {
    this.afa.auth.signOut();
    if(this.userSub) {
      this.userSub.unsubscribe()
    }
    console.log('usersub unsubscribed', this.userSub);
  }

  isLoggedIn() {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }

  // Autorización según roles
  canRead(user: User): boolean {
    const allowed = ['admin', 'horometro', 'mantenimiento', 'lavado', 'taller'];
    return this.checkAutorization(user, allowed);
  }

  canEditTaller(user: User): boolean {
    const allowed = ['admin', 'taller'];
    return this.checkAutorization(user, allowed);
  }

  canDeleteTaller(user: User): boolean {
    const allowed = ['admin', 'taller'];
    return this.checkAutorization(user, allowed);
  }

  canEditLavado(user: User): boolean {
    const allowed = ['admin', 'lavado'];
    return this.checkAutorization(user, allowed);
  }

  canDeleteLavado(user: User): boolean {
    const allowed = ['admin', 'lavado'];
    return this.checkAutorization(user, allowed);
  }

  canEditHoro(user: User): boolean {
    const allowed = ['admin', 'horometro'];
    return this.checkAutorization(user, allowed);
  }

  canDeleteHoro(user: User): boolean {
    const allowed = ['admin', 'horometro'];
    return this.checkAutorization(user, allowed);
  }

  canEditManto(user: User): boolean {
    const allowed = ['admin', 'mantenimiento'];
    return this.checkAutorization(user, allowed);
  }

  canDeleteManto(user: User): boolean {
    const allowed = ['admin', 'mantenimiento'];
    return this.checkAutorization(user, allowed);
  }

  private checkAutorization(user:User, allowedRoles: string[]): boolean {
    if(!user) return false;
    for (const role of allowedRoles) {
      if (user.rol == role) {
        return true;
      }
      return false;
    }
  }

}

export interface User {
  id?:string;
  uid?: string;
  email: string;
  rol: string;
  company: string;
  name?: string;
  lastname?: string;
  photoUrl?: string;
}

// OnInit =
/* this.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        console.log('user ', this.user);
        if(this.userSub) {
          this.userSub.unsubscribe()
        }
        this.userSub = db.doc<User>(`users/${user.uid}`).valueChanges().subscribe(
          (details: User) => {
            this.userDetails = details;
            setTimeout(() => {
              console.log('userDetails ', this.userDetails);
            }, 5000);
          }
        );
      } else {
        console.log('Usuario null');
        this.user = null;
        this.userDetails = null;
      }
    }); */
