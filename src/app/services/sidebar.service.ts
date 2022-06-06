import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [
    {
      title: 'Dasboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        {title: 'Main', url: ''},
        {title: 'ProgressBar', url: 'progress'},
        {title: 'Gráficas', url: 'grafica1'},
        {title: 'Promesas', url:'promises'},
        {title: 'Rxjs', url: 'rxjs'}
      ]
    }
  ]

  constructor() { }
}
