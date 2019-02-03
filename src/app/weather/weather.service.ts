import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  currentWeather = new BehaviorSubject<ICurrentWeather>({
    'city': '--',
    'country': '--',
    'date': Date.now(),
    'image': '',
    temperature: 0,
    description: ''
  });

  constructor(private httpClient: HttpClient) { }

  getCurrentWeather(cityNameOrZip: string | number, country?: string): Observable<ICurrentWeather> {
    let uriParams = '';
    if (typeof cityNameOrZip === 'string')
      uriParams = `q=${cityNameOrZip}`;
    else
      uriParams = `zip=${cityNameOrZip}`;

    if (country)
      uriParams = `${uriParams},${country}`;

    return this.getCurrentWeatherHelper(uriParams);
  }

  getCurrentWeatherByCoords(coords: Coordinates): Observable<ICurrentWeather> {
    const uriParams = `lat=${coords.latitude}&lon=${coords.longitude}`;
    return this.getCurrentWeatherHelper(uriParams);
  }

  private getCurrentWeatherHelper(uriParams: string): Observable<ICurrentWeather> {
    return this.httpClient.get<ICurrentWeatherData>(
      `${environment.baseUrl}api.openweathermap.org/data/2.5/weather?` +
      `${uriParams}&appid=${environment.appId}`
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

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ longitude: resp.coords.longitude, latitude: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });
  }
}
