import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NbAuthResult } from '@nebular/auth';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  redirectDelay: number = 1500;
  ok: boolean = false;

  constructor(private authS: AuthService, private router: Router) { }

  ngOnInit() {
    this.logout();
  }

  logout() {
    this.ok = this.authS.logout();
    setTimeout(() => {
      this.router.navigate(['auth/login']);
    }, this.redirectDelay);
  }

}
