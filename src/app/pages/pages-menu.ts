import { NbMenuItem } from '@nebular/theme';


export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'la la-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Vehículos',
    icon: 'la la-truck',
    link: '/pages/vehiculos/ver',
  },
  {
    title: 'Horómetro',
    icon: 'la la-compass'
  },
  {
    title: 'ADMINISTRAR',
    group: true,
  },
  {
    title: 'Vehículos',
    icon: 'la la-bus',
    link: '/pages/vehiculos/listar',
  },
  {
    title: 'Usuarios',
    icon: 'la la-book',
    children: [
      {
        title: 'Listar Usuarios',
        icon: 'la la-users',
        link: '',
      },
      {
        title: 'Crear Usuario',
        icon: 'la la-user-plus',
        link: '/auth/register',
      }
    ]
  },
];
