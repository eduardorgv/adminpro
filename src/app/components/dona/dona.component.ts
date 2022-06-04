import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnChanges  {

  @Input() title: string = 'Sin título';
  @Input() data = [{  data: [ 350, 450, 100 ],
                      backgroundColor: ['#6857E6', '#009FEE', '#F02059']
                  }];

  @Input('label') doughnutChartLabels: string[] = [ 'Opción 1', 'Opción 2', 'Opción 3' ];

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: this.data
  };

  @Input() doughnutChartType: ChartType = 'doughnut';

  ngOnChanges(changes: SimpleChanges): void {
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: this.data
    }
  }
}
