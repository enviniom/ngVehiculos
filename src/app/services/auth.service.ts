import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable, Subscription, from, of as observableOf } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
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
    private router: Router,
    private db: AngularFirestore
  ) {
    this.user$ = afa.authState;
    this.user$.subscribe((user) => {
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

  // metodos transversales
  logout() {
    this.afa.auth.signOut();
    if(this.userSub) {
      this.userSub.unsubscribe()
    }
    console.log('usersub unsubscribed', this.userSub);
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


/*
createToken(value: any): NbAuthToken {
  return nbAuthCreateToken(NbAuthSimpleToken, value);
}

authenticate(email, password): Observable<NbAuthResult> {
  console.log("Entra a servicio y Llama metodo interno para autenticar");
  return this.signInWithEmail(email, password).pipe(
    switchMap((result: NbAuthResult) => {
      console.log("NbAuthResult retornado se solicita guardar token");
      return this.processResulToken(result);
    })
  );
}

signInWithEmail(email, password): Observable<NbAuthResult> {
  console.log(
    "Entra en metod interno de autenticacion y solicita login a firebase"
  );
  return from(
    this.afa.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(
          "Procedimiento satisfactorio, crea el NbAuthResult y lo retorna"
        );
        var a = this.processSuccess(res, "pages/dashboard", [
          "Último ingreso: ",
          res.user.metadata.lastSignInTime
        ]);
        console.log("nbAuthresulh", a);
        return a;
      })
      .catch(err => {
        console.log("err", err);
        return this.processFailure(err, null, err.code);
      })
  );
}

logout(): Observable<NbAuthResult> {
  console.log("LLama servicio para desloguear");
  return from(
    this.afa.auth
      .signOut()
      .then(res => {
        console.log("logout satisfactorio, devuelve NbAuthResult");
        return this.processSuccess(res, "auth/login", []);
      })
      .catch(err => {
        return this.processFailure(err, null, err.code);
      })
  ).pipe(
    switchMap((result: NbAuthResult) => {
      console.log("Entra al switchmap del logout");
      if (result.isSuccess()) {
        console.log("Entra al if del switchmap");
        this.ts.clear().pipe(map(() => result));
      }
      return observableOf(result);
    })
  );
}

clearToken() {
  this.ts.clear();
}

createUser(email, password) {
  this.afa.auth.createUserWithEmailAndPassword(email, password);
}

requestPass(email, actionCodeSettings) {
  return this.afa.auth.sendPasswordResetEmail(email, actionCodeSettings);
}

requestPassword(email: string, actionCodeSettings): Observable<NbAuthResult> {
  return from(
    this.afa.auth
      .sendPasswordResetEmail(email, actionCodeSettings)
      .then(res => {
        return this.processSuccess(res, "auth/login", []);
      })
      .catch(err => {
        return this.processFailure(err, null, err.code);
      })
  );
}

resetPassword(password: string): Observable<NbAuthResult> {
  if (this.afa.auth.currentUser) {
    return from(
      this.afa.auth.currentUser
        .updatePassword(password)
        .then(res => {
          return this.processSuccess(res, "auth/login", []);
        })
        .catch(err => {
          return this.processFailure(err, "auth/request-password", err.code);
        })
    );
  }

  return observableOf(
    this.processFailure([], "auth/request-password", [
      "Por favor, inicie sesión para cambiar la contraseña"
    ])
  );
}

confirmPasswordReset(code, newPassword) {
  // param: oobCode=<code>
  return this.afa.auth.confirmPasswordReset(code, newPassword);
}

getToken(): Observable<NbAuthToken> {
  return this.ts.get();
}

isAuthenticated(): Observable<boolean> {
  return this.getToken().pipe(map((token: NbAuthToken) => token.isValid()));
}

isLogged(): Observable<boolean> {
  var res;
  if (this.userDetails == null) {
    res = false;
  } else {
    res = true;
  }
  return observableOf(res);
}

onTokenChange(): Observable<NbAuthToken> {
  return this.ts.tokenChange();
}

onAuthenticationChange(): Observable<boolean> {
  return this.onTokenChange().pipe(
    map((token: NbAuthToken) => token.isValid())
  );
}
 */
/*
// TODO: refreshToken
* Desde el servicio =
*
refreshToken(strategyName: string, data?: any): Observable<NbAuthResult> {
  return this.getStrategy(strategyName).refreshToken()
    .pipe(
      switchMap((result: NbAuthResult) => {
        return this.processResultToken(result);
      }),
    );
}

*Desde el provider =
refreshToken(data?: any): Observable<NbAuthResult> {

  const method = this.getOption('refreshToken.method');
  const url = this.getActionEndpoint('refreshToken');

  return this.http.request(method, url, {body: data, observe: 'response'})
    .pipe(
      map((res) => {
        if (this.getOption('refreshToken.alwaysFail')) {
          throw this.createFailResponse(data);
        }

        return res;
      }),
      this.validateToken('refreshToken'),
      map((res) => {
        return new NbAuthResult(
          true,
          res,
          this.getOption('refreshToken.redirect.success'),
          [],
          this.getOption('messages.getter')('refreshToken', res, this.options),
          this.createToken(this.getOption('token.getter')('login', res, this.options)));
      }),
      catchError((res) => {
        let errors = [];
        if (res instanceof HttpErrorResponse) {
          errors = this.getOption('errors.getter')('refreshToken', res, this.options);
        } else {
          errors.push('Something went wrong.');
        }

        return observableOf(
          new NbAuthResult(
            false,
            res,
            this.getOption('refreshToken.redirect.failure'),
            errors,
          ));
      }),
    );
}
*/

/*
*Métodos privados
*/
/*
private processSuccess(
  response?: any,
  redirect?: any,
  messages?: any
): NbAuthResult {
  console.log("response", response);
  return new NbAuthResult(true, response, redirect, [], messages);
}

private processFailure(
  response?: any,
  redirect?: any,
  errors?: any
): NbAuthResult {
  return new NbAuthResult(false, response, redirect, errors, []);
}

private processResulToken(result: NbAuthResult) {
  console.log("Inicia proceso de guardado de token");
  if (result.isSuccess() && result.getToken()) {
    console.log("Entra el if para el guardado del token");
    console.log("token a guardar", result.getToken());
    return this.ts.set(result.getToken()).pipe(
      map((token: NbAuthToken) => {
        console.log(
          "Token guardado y se proceso se devuelve al matodo principal"
        );
        return result;
      })
    );
  }
  console.log("Sale del if crea un observable vacio");
  return observableOf(result);
} */
