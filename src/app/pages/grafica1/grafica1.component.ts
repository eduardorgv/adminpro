import { Component } from '@angular/core';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  type: ChartType = 'doughnut';
  data: any = [{  data: [ 350, 450, 100, 400 ],
                  backgroundColor: ['#6857E6', '#009FEE', '#F02059','#009FEE']
              }];
  
  label: string[] = ['Nuevo label 1','Nuevo label 2','Nuevo label 3','Nuevo label 4'];

}
