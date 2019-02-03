import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css']
})
export class CitySearchComponent implements OnInit {

  search: FormControl;
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.search = new FormControl(null, [Validators.minLength(2)]);

    this.search.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(
        (searchString: string) => {
          if (searchString && !this.search.invalid) {
            this.searchEvent.emit(searchString);
          }
        }
      );
  }

}
