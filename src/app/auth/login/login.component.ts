import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { NbAuthResult } from "@nebular/auth";
import { tap } from "rxjs/operators";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  redirectDelay: number = 1000;
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  errorCodes: Object = {
    "auth/wrong-password": "Contraseña errada o el usuario no tiene contraseña",
    "auth/user-disabled": "Usuario deshabilitado",
    "auth/invalid-email": "El email no es válido",
    "auth/user-not-found": "El usuario no existe"
  };

  constructor(
    private fb: FormBuilder,
    protected as: AuthService,
    protected router: Router
  ) {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      pass: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(25)
        ])
      ]
    });
  }

  ngOnInit() { }

  /* submitLogin(): void {
    const email = this.loginForm.get("email").value;
    const pass = this.loginForm.get("pass").value;
    this.errors = this.messages = [];
    this.submitted = true;

    this.as.authenticate(email, pass).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        if (this.errorCodes.hasOwnProperty(result.getErrors()[0])) {
          this.errors = [this.errorCodes[result.getErrors()[0]]];
        } else {
          this.errors = result.getErrors();
        }
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  } */

  get email() {
    return this.loginForm.get("email");
  }

  get pass() {
    return this.loginForm.get("pass");
  }

  redirectToDashboard() {
    console.log("Usuario loggeado inicia timer");
    setTimeout(() => {
      console.log("Inicia la redirección");
      this.router.navigate(["/pages/dashboard"]);
    }, this.redirectDelay);
  }
}
