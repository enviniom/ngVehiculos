import { NbMenuItem } from '@nebular/theme';


export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'fa fa-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Vehículos',
    icon: 'fa fa-truck',
    link: '/pages/vehiculos/ver',
  },
  {
    title: 'Horómetro',
    icon: 'fa fa-compass'
  },
  {
    title: 'ADMINISTRAR',
    group: true,
  },
  {
    title: 'Vehículos',
    icon: 'fa fa-bus',
    link: '/pages/vehiculos/listar',
  },
  {
    title: 'Usuarios',
    icon: 'fa fa-address-book',
    children: [
      {
        title: 'Listar Usuarios',
        icon: 'fa fa-users',
        link: '',
      },
      {
        title: 'Crear Usuario',
        icon: 'fa fa-user-plus',
        link: '/auth/register',
      }
    ]
  },
];
