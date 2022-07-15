import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [];

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')!) || [];
  }

  // menu: any = [
  //   {
  //     title: 'Dasboard',
  //     icon: 'mdi mdi-gauge',
  //     submenu: [
  //       {title: 'Main', url: ''},
  //       {title: 'ProgressBar', url: 'progress'},
  //       {title: 'Gráficas', url: 'grafica1'},
  //       {title: 'Promesas', url:'promises'},
  //       {title: 'Rxjs', url: 'rxjs'}
  //     ]
  //   },
  //   {
  //     title: 'Mantenimiento',
  //     icon: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       {title: 'Usuarios', url: 'usuarios'},
  //       {title: 'Hospitales', url: 'hospitales'},
  //       {title: 'Médicos', url: 'medicos'},
  //     ]
  //   }
  // ]
}
