import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
declare var google;

@Component({
  selector: 'app-pet-location',
  templateUrl: './pet-location.page.html',
  styleUrls: ['./pet-location.page.scss'],
})
export class PetLocationPage implements AfterViewInit {

  map;

  @ViewChild('mapElement', {static: false }) mapElement;

  mapOptions = {
    center: { lat: -34.397, lng: 150.644},
    zoom: 8,
  };

  address;
  cityName;
  stateName;


  constructor(private geolocation: Geolocation ) {}

  loadMap(){

    this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
    const marker = new google.maps.Marker({
      position: this.mapOptions.center,
      map: this.map,
      title: 'Current Location',
    });

    this.geocodeLatLng(this.mapOptions.center);
  }

  geocodeLatLng(currentPosition){
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({location: currentPosition}, (results, status) =>{
    if (status === 'OK'){
      if (results[1]){
        console.log(results);
        this.address = results[1].formatted_address;
        if (results[1].address_components.length > 0){
        results[1].address_components.forEach(item =>{
          if (item.types.indexOf('locality') !== -1){
            this.cityName = item.short_name;
          }
        if (item.types.indexOf('administrative_area_level_1') !== -1){
          this.stateName = item.short_name;
        }
        });
      }
        this.map.setZoom(11);
        const marker = new google.maps.Marker({
          position: currentPosition,
          map: this.map,
        });

      } else {
        window.alert('No result found');
      }
    } else{
      window.alert('Geocoder failed due to:' + status);
    }
    });
  }

  ngAfterViewInit(): void{
    this.geolocation.getCurrentPosition().then((resp :Geoposition) => {
      this.mapOptions.center.lat = resp.coords.latitude;
      this.mapOptions.center.lng = resp.coords.longitude;
      this.loadMap();
      }).catch((error) => {
        console.log('Error getting location', error);
      });
  }

}
