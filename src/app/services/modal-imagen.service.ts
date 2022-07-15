import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  type!: 'usuarios'|'medicos'|'hospitales';
  id!: string;
  img!: string;

  nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarModal;
  }

  constructor() { }

  abrirModal(type: 'usuarios'|'medicos'|'hospitales', id: string, img: string = 'no-img') {
    this._ocultarModal = false;
    this.type = type;
    this.id = id;

    if(img.includes('http')) {
      this.img = img;
    }else {
      this.img = `${base_url}/upload/${type}/${img}`;
    }
  }

  cerrarModal() {
    this._ocultarModal = true;
  }
}
