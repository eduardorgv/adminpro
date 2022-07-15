import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string = '', type: 'usuarios'|'medicos'|'hospitales'): string {
    if(!img) {
      return `${base_url}/upload/${type}/no-img`;
    }else if(img.includes('https')) {
      return img;
    }else if(img){
      return `${base_url}/upload/${type}/${img}`;
    }else {
      return `${base_url}/upload/${type}/no-img`;
    }
  }

}
