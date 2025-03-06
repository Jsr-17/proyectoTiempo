const provincia = document.getElementById("provincia");
const municipio = document.getElementById("municipio");
const btnClima = document.getElementById("btnClima");
const contenedor = document.getElementById("container");
let provinciaBusqueda = "";
let municipioBusqueda = "";

provincia.addEventListener("change", (e) => {
  postProvincia(provincia.value);
});

btnClima.addEventListener("click", () => {
  const selectedOption = municipio.options[municipio.selectedIndex];
  municipioBusqueda = selectedOption.value;

  postDatos();
});

const getDataProvincias = async () => {
  const respuesta = await axios.get(
    "https://www.el-tiempo.net/api/json/v2/home"
  );
  const { provincias } = respuesta.data;

  Object.entries(provincias).forEach(([key, { CODPROV, NOMBRE_PROVINCIA }]) => {
    const option = document.createElement("option");
    option.value = CODPROV;
    option.textContent = NOMBRE_PROVINCIA;
    provincia.appendChild(option);
  });
};

const postProvincia = async (cd) => {
  try {
    const response = await axios.post("http://localhost:1024/idProvincia", {
      cd,
    });
    municipio.innerHTML = "";
    Object.entries(response.data).forEach(
      ([key, { CODIGOINE, NOMBRE, CODPROV }]) => {
        const option = document.createElement("option");
        option.value = CODIGOINE;
        option.textContent = NOMBRE;
        municipio.appendChild(option);
        provinciaBusqueda = CODPROV;
      }
    );
  } catch (error) {
    console.error("Error al enviar la provincia:", error);
  }
};
const postDatos = async () => {
  try {
    const response = await axios.post("http://localhost:1024/todosDatos", {
      provinciaBusqueda,
      municipioBusqueda,
    });
    const {
      municipio: {
        LATITUD_ETRS89_REGCAN95,
        LONGITUD_ETRS89_REGCAN95,
        NOMBRE,
        NOMBRE_PROVINCIA,
        SUPERFICIE,
        POBLACION_MUNI,
        ALTITUD,
        PERIMETRO,
      },
      precipitacion,
      pronostico: { hoy },
      proximos_dias,
      stateSky,
      temperatura_actual,
      temperaturas,
      viento,
      fecha,
      lluvia,
      humedad,
    } = response.data;
    const fechaObj = new Date(fecha);
    const diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];

    const diaSemana = diasSemana[fechaObj.getDay()];
    const { max, min } = temperaturas;

    console.log(response.data);

    contenedor.innerHTML = `
                 <div class="h-100 bg-primary p-4 container-fluid border-primary rounded border border-3 text-white">
  <div class="container ">
    <div class="row text-center">
      <h6 class="text-uppercase fw-bold my-3">${NOMBRE}</h6>
      <h6 class="fs-5 text-uppercase my-3">${diaSemana}</h6>
    </div>

    <div class="row my-3 align-items-center">
      <!-- Sección de temperatura -->
      <div class="col-md-6 text-center">
        <div class="fs-1 text-nowrap">${temperatura_actual} °C</div>
        <div class="small text-nowrap">S. térmica: ${hoy.sens_termica[0]}°C</div>
        <div class="d-flex justify-content-center gap-3 mt-2">
          <div class="small text-nowrap">Max: ${max}°C</div>
          <div class="small text-nowrap">Min: ${min}°C</div>
        </div>
      </div>

      <!-- Sección de imagen y descripción del estado del cielo -->
      <div class="col-md-6 text-center">
        <div>Imagen</div>
        <p>${stateSky.description}</p>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="row text-center">
      <div class="col-md-4 small">Prob. Lluvia: ${lluvia}%</div>
      <div class="col-md-4 small">Lluvia: ${precipitacion} l/m²</div>
      <div class="col-md-4 small">Humedad: ${humedad}%</div>
    </div>

    <div class="row text-center mt-3">
      <div class="col-md-6 small">Viento: ${viento}</div>
      <div class="col-md-6 small">Índice máx UV: 4</div>
    </div>
  </div>
</div>

<!-- Sección de próximas horas -->
<section class="container-fluid bg-primary border-primary rounded border border-3 overflow-auto mt-3 text-white">
  <div id="contenedorProximasHoras" class="d-flex justify-content-center align-items-center"></div>
</section>

<!-- Sección de próximos dias -->
<section class="container-fluid bg-primary border-primary rounded border border-3 overflow-auto mt-3 text-white ">
  <div id="contenedorProximosDias" class="d-flex justify-content-center align-items-center"></div>
</section>
<!-- Sección de mapa-->
<section class="container-fluid mt-4">
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div id="map" class="w-100" style="height: 50vh;"></div>
      <div id="info">
      <div>
    </div>
  </div>
</section>


    `;

    const horita = new Date();
    let hora = horita.getHours();

    const contenedorProximasHoras = document.querySelector(
      "#contenedorProximasHoras"
    );
    const contenedorMasInfo = document.querySelector("#info");
    for (let index = 0; index < hoy.temperatura.length; index++) {
      let sumahora = (hora + index) % 24;

      contenedorProximasHoras.innerHTML += `
        <div class="container p-4 ">
          <div class="carta rounded border border-3 border-primary d-flex justify-content-center align-items-center">
            <div>
              <div class="row my-3">
                <h1 class="text-center"> <span class="fs-6">Hora:</span> ${sumahora}</h1>
              </div>
             
              <div class="row my-3">
                <h4 class=" text-nowrap"> <span class="fs-6">Temperatura:</span> ${hoy.temperatura[index]}°C</h4>
              </div>
              <div class="row my-3">
                <h4 class=" text-nowrap"> <span class="fs-6">Porcentaje:</span> ${hoy.precipitacion[index]}%</h4>
              </div>
              <div class="row my-3">
                <h4 class=" text-nowrap"> <span class="fs-6">Viento: </span> ${hoy.viento[index].velocidad} km/h</h4>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    const contenedorProximosDias = document.querySelector(
      "#contenedorProximosDias"
    );
    for (let index = 0; index < proximos_dias.length; index++) {
      const {
        "@attributes": { fecha },
        estado_cielo_descripcion,
        temperatura: { maxima, minima },
      } = proximos_dias[index];

      const diaSemana = moment(fecha).format("dddd");
      const mes = moment(fecha).format("MMMM");
      const dia = moment(fecha).format("D");

      contenedorProximosDias.innerHTML += `
        <div class="container p-4 ">
          <div class="carta rounded border border-3 border-primary d-flex justify-content-center align-items-center">
            <div>
              <div class="row my-3">
                <h3 class="text-center text-nowrap text-capitalize"> <span class="fs-4">Dia:</span> ${dia + " / " + diaSemana + " / " + mes}</h3>
              </div>
             
              <div class="row my-3">
                <h4 class=" text-nowrap"> <span class="fs-6">Temperaturas :</span> Max: ${maxima}°C     Min: ${minima}°C   </h4>
              </div>
              <div class="row my-3">
                <h6 class=" text-nowrap">${estado_cielo_descripcion}</h6>

              </div>
            </div>
          </div>
        </div>
      `;
    }

    const map = L.map("map").setView(
      [LATITUD_ETRS89_REGCAN95, LONGITUD_ETRS89_REGCAN95],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([LATITUD_ETRS89_REGCAN95, LONGITUD_ETRS89_REGCAN95])
      .addTo(map)
      .openPopup();

    map.invalidateSize();
    contenedorMasInfo.innerHTML = `
     <div class="container mt-4  rounded border border-3 border-primary bg-primary p-3">
  <!-- Información de la provincia y municipio -->
  <div class="row mb-3">
    <div class="col-md-6">
      <p class="fw-bold">Provincia: <span class="text-primary">${NOMBRE_PROVINCIA}</span></p>
    </div>
    <div class="col-md-6">
      <p class="fw-bold">Municipio: <span class="text-primary">${NOMBRE}</span></p>
    </div>
  </div>
  
  <!-- Información de población y superficie -->
  <div class="row mb-3">
    <div class="col-md-6">
      <p class="fw-bold">Población: <span class="text-primary">${POBLACION_MUNI}</span></p>
    </div>
    <div class="col-md-6">
      <p class="fw-bold">Superficie: <span class="text-primary">${SUPERFICIE} km²</span></p>
    </div>
  </div>
  
  <!-- Información de perímetro y altitud -->
  <div class="row mb-3">
    <div class="col-md-6">
      <p class="fw-bold">Perímetro: <span class="text-primary">${PERIMETRO} km</span></p>
    </div>
    <div class="col-md-6">
      <p class="fw-bold">Altitud: <span class="text-primary">${ALTITUD} msnm</span></p>
    </div>
  </div>
  
  <!-- Información de latitud y longitud -->
  <div class="row mb-3">
    <div class="col-md-6">
      <p class="fw-bold">Latitud: <span class="text-primary">${LATITUD_ETRS89_REGCAN95}</span></p>
    </div>
    <div class="col-md-6">
      <p class="fw-bold">Longitud: <span class="text-primary">${LONGITUD_ETRS89_REGCAN95}</span></p>
    </div>
  </div>
</div>

    `;
  } catch (error) {
    console.log(error);
  }
};

getDataProvincias();
