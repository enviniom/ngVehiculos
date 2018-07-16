import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators/takeWhile' ;
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/auth.service';
import { Observable } from 'rxjs';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private arrayUsers: any;
  public valor: string;
  public mostrar: boolean = true;

  private alive = true;
  public userDetails: firebase.User = null;
  public user:any;
  public tokenId: string;
  public tokenIdResult: any;

  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'secondary',
      },
    ],
  };

  constructor(private themeService: NbThemeService, private as: AuthService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });
  }

  testing() {
    let users:Observable<User[]> = this.as.getUsers()
    users.subscribe((data) => {
      console.log('data', data);
      this.arrayUsers = data;
    });
  }

  testing2() {
    if (this.valor) {
      console.log('Inicia testing2');
      this.mostrar = this.buscarArray();
    }
  }

  buscarArray() {
    console.log('Inició búsqueda');
    let test: boolean = true;
    this.arrayUsers.forEach(element => {
      if (element.email.localeCompare(this.valor)===0) {
        console.log('entró en if');
        test = false;
      }
    });
    console.log('Terminó ciclo retorna test');
    return test;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
