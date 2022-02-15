// import { MapsAPILoader } from '@agm/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacePredictionService {
  // private autocompleteService!: google.maps.places.AutocompleteService;
  // constructor(private mapsAPILoader: MapsAPILoader) {
  //   this.mapsAPILoader.load().then(() => {
  //     this.autocompleteService = new google.maps.places.AutocompleteService();
  //   });
  // }
  // getPlacePredictions(term: string): Observable<any[]> {
  //   return Observable.create(
  //     (observer: {
  //       next: (
  //         arg0: google.maps.places.AutocompletePrediction[] | any[][]
  //       ) => void;
  //       complete: () => void;
  //       error: (arg0: string) => void;
  //     }) => {
  //       // API Call
  //       this.autocompleteService.getPlacePredictions(
  //         { input: term },
  //         (data) => {
  //           let previousData: Array<google.maps.places.AutocompletePrediction>;
  //           // Data validation
  //           if (data) {
  //             // console.log(data);
  //             previousData = data;
  //             observer.next(data);
  //             observer.complete();
  //           }
  //           // If no data, emit previous data
  //           if (!data) {
  //             console.log('PreviousData: ');
  //             observer.next(previousData!);
  //             observer.complete();
  //             // Error Handling
  //           } else {
  //             observer.error(status);
  //           }
  //         }
  //       );
  //     }
  //   );
  // }
}
