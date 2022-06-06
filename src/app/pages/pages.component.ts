import { AfterViewChecked, Component } from '@angular/core';
import { SettingsService } from '../services/settings.service';

declare function customInitFuncionts(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements AfterViewChecked {


  constructor(private settingService: SettingsService) { }

  ngAfterViewChecked(): void {
    customInitFuncionts();
  }

}
