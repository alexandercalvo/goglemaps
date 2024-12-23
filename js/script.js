
let placeInput = document.querySelector("#place-input");
let mapa;
let autocomplete;


async function inicializarMapa() {

  const { Map } = await google.maps.importLibrary("maps");
  const $mapaGoogle = document.querySelector(".googleMaps");

  mapa = new Map($mapaGoogle, {
    center: { lat:4.607895, lng: -75.818673 },
    zoom: 16,
  });

   buscarGoogleMaps();
}

const buscarGoogleMaps = () =>{
  autocomplete = new google.maps.places.Autocomplete(placeInput);
  autocomplete.addListener("place_changed", ()=>{
    const place = autocomplete.getPlace();
    mapa.setCenter(place.geometry.location);
    mapa.setZoom(13);
  })
}

inicializarMapa();
