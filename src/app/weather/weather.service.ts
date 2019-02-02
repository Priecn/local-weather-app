import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICurrentWeather } from '../interfaces';


interface ICurrentWeatherData {
  weather: [{
    description: string,
    icon: string
  }],
  main: {
    temp: number
  },
  sys: {
    country: string
  },
  dt: number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private httpClient: HttpClient) { }

  getCurrentWeather(city: string, country: string): Observable<ICurrentWeather> {
    return this.httpClient.get<ICurrentWeatherData>(
      `${environment.baseUrl}api.openweathermap.org/data/2.5/weather?` +
      `q=${city},${country}&appid=${environment.appId}`
    ).pipe(
      map(wd => this.transferToICurrentWeather(wd))
    );
  }

  private transferToICurrentWeather(currentWeatherData: ICurrentWeatherData): ICurrentWeather {
    return {
      'city': currentWeatherData.name,
      'country': currentWeatherData.sys.country,
      'date': currentWeatherData.dt * 1000,
      'image': `http://openweathermap.org/img/w/${currentWeatherData.weather[0].icon}.png`,
      'temperature': this.convertKelvinToFahrenheit(currentWeatherData.main.temp),
      'description': currentWeatherData.weather[0].description
    };
  }

  private convertKelvinToFahrenheit(temp: number): number {
    return temp * 9 / 5 - 459.67;
  }
}
