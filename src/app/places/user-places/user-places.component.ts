import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  isFetching = signal(false);
  error = signal('');
  userPlaces = signal<Place[] | undefined>(undefined);

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.isFetching.set(true);
    this.subscriptions.push(
      this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places').subscribe({
        next: (response) => {
          this.userPlaces.set(response.places);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      })

    );


  }
  ngOnDestroy() {
    throw new Error('Method not implemented.');
  }




}
