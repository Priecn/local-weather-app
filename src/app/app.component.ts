import { Component, OnInit } from '@angular/core';
import { ICurrentWeather } from './interfaces';
import { WeatherService } from './weather/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'local-weather-app';
  currentWeather: ICurrentWeather;
  heading: string;
  weatherFound: boolean;

  ngOnInit(): void {
    this.heading = 'Loding';
    this.weatherFound = false;
    this.weatherService.getPosition()
      .then(res => {
        this.weatherService.getCurrentWeatherByCoords(res)
          .subscribe(res => {
            this.weatherService.currentWeather.next(res);
            this.heading = 'Current Weather';
            this.weatherFound = true;
          });
      });
  }

  constructor(private weatherService: WeatherService) { }

  doSearch(searchString: string) {
    const userInput = searchString.split(',')
      .map(s => s.trim());
    this.weatherService.getCurrentWeather(userInput[0], userInput[1] ? userInput[1] : undefined)
      .subscribe(data => this.weatherService.currentWeather.next(data));
  }
}
