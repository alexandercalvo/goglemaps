let map;
let marker;
let infoWindow;

//importamos las librerias de la api de google mediante destructurin y les damos un alias

const { Map: Mapa } = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement: Marcador, PinElement: Punto } =
  await google.maps.importLibrary("marker");
const { PlaceAutocompleteElement: Autocompletado } =
  await google.maps.importLibrary("places");

//coordenada donde se cargara el mapa
function puntoDeOrigen() {
  
  map = new Mapa(document.getElementById("map"), {
    center: { lat:  2.8976942, lng: -82.1101564 },
    zoom: 4,
    mapId: "4504f8b37365c3d0",
    mapTypeControl: false,
  });
}

function ponerMarcador() {
  const $contenedorInput = document.querySelector("#place-autocomplete-card");
  const controlAutocompletado = new Autocompletado();

  controlAutocompletado.setAttribute("id", "place-autocomplete-input");
  $contenedorInput.appendChild(controlAutocompletado);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push($contenedorInput);

  marker = new Marcador({
    map,
  });

  infoWindow = new google.maps.InfoWindow({});
  agregarEventoPlace(controlAutocompletado);
}

function agregarEventoPlace(controlAutocompletado) {
  controlAutocompletado.addEventListener(
    "gmp-placeselect",
    async ({ place }) => {
      let $contenedor = document.createElement("div");
      let $spanTitulo = document.querySelector("#place-displayname");
      let $spanDirecion = document.querySelector("#place-address");

      let $templateModal = document.querySelector("#template-modal").content;

      await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location"],
      });

      if (place.viewport) {
        map.fitBounds(place.viewport);
      } else {
        map.setCenter(place.location);
        map.setZoom(17);
      }

      if ($spanTitulo || $spanDirecion) {
        $spanTitulo.textContent = place.displayName;
        $spanDirecion.textContent = place.formattedAddress;
      } else {
        let $nodoModal = document.importNode($templateModal, true);
        $nodoModal.querySelector("#place-displayname").textContent =
          place.displayName;
        $nodoModal.querySelector("#place-address").textContent =
          place.formattedAddress;
        $contenedor.appendChild($nodoModal);
        updateInfoWindow($contenedor, place.location);
      }

      marker.position = place.location;
    }
  );
}

//funcion para inicializar el mapa
async function inicializarMapa() {
  await puntoDeOrigen();
  await ponerMarcador();
}

function updateInfoWindow(content, center) {
  infoWindow.setContent(content);
  infoWindow.setPosition(center);
  infoWindow.open({
    map,
    anchor: marker,
    shouldFocus: false,
  });
  let $prueba = document.querySelector(".prueba");
  $prueba.appendChild(content);
}

async function obtenerData() {
  try {
    const respuesta = await fetch("../servicio/marcadores.json");
    const json = await respuesta.json();
    console.log(json);

    json.properties.forEach((property) => {
      crearMarcadorPersonalizado(property);

    });
  } catch (err) {
    console.log("Ocurrio el siguiente error", err);
  }
}

obtenerData();
function crearMarcador() {}

function construirElemento(property) {

  const $contentenedorMarcador = document.createElement("div");
  $contentenedorMarcador.classList.add("property");
  const $templateMarcador =
    document.querySelector("#template-marcador").content;
    let $nodoMarcador = document.importNode($templateMarcador, true);
    let $title = $nodoMarcador.querySelector(".marcador-title");

  $title.classList.add(`fa-${property.type}`);
  console.log("las clases son", $title.classList);
  $title.setAttribute("title", property.type);
  $nodoMarcador.querySelector(".fa-sr-only").textContent = property.type;
  $nodoMarcador.querySelector(".price").textContent = property.price;
  $nodoMarcador.querySelector(".address").textContent = property.address;
  $nodoMarcador.querySelector(".span-bedroom").textContent = property.bed;
  $nodoMarcador.querySelector(".span-bathroom").textContent = property.bath;
  $nodoMarcador.querySelector('.link-emprendimiento').setAttribute("href", property.link);

  $contentenedorMarcador.appendChild($nodoMarcador);

  return $contentenedorMarcador;
}


function toggleHighlight(markerView, property) {
  debugger;
  if (markerView.content.classList.contains("highlight")) {
    markerView.content.classList.remove("highlight");
    markerView.zIndex = null;
  } else {
    markerView.content.classList.add("highlight");
    markerView.zIndex = 1;
  }
}


function crearMarcadorPersonalizado(property) {
  const MarcadorPersonalizado = new Marcador({
    map,
    content: construirElemento(property),
    position: property.position,
    title: property.description,
  });

  MarcadorPersonalizado.addListener("click", () => {
    toggleHighlight(MarcadorPersonalizado, property);
  });
}

inicializarMapa();
