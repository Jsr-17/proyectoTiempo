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
      municipio,
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
    const [max, min] = temperatura_actual;

    console.log(response.data);

    contenedor.innerHTML = `
                  <div class="h-100 bg-primary p-3 container-fluid border-primary rounded border border-3">
              <div class="centro">

              <div class="row">
                <h6 class="text-center mt-2 text-uppercase">${municipio.NOMBRE}</h6>
              </div>
              <div class="row">
                <h6 class="text-center fs-5 text-uppercase">${diaSemana}</h6>
              </div>
              <div class="row my-3">
                <div class="col-6">
                  <div class="container">
                    <div class="row">
                      <div class="col-12 fs-1 text-center text-nowrap">
                        ${temperatura_actual} °C
                      </div>
                      <div class="small text-center text-nowrap">S. termica:${hoy.sens_termica[0]}°C</div>
                    </div>
                    <div class="row my-1">
                      <div
                        class="container d-flex justify-content-center align-items-center"
                      >
                        <div class="small text-nowrap my-1">Max: ${max}°C</div>
                        <div class="mx-2 small text-nowrap">Min: ${min}°C</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div>imagen</div>
                  <p>${stateSky.description}</p>
                </div>
              </div>
              <div class="container-fluid ">
              <div class="d-flex justify-content-center align-items-center">
  <div class="row text-nowrap my-2">
    <div class="col-12 small me-2 text-center my-2">Prob lluvia: ${lluvia}%</div>
    <div class="col-12 small text-center my-2">Lluvia: ${precipitacion} l/m2</div>
    <div class="col-12 small text-center my-2">Humedad: ${humedad}%</div>
  </div>
</div>

          <div class="row text-nowrap my-2">
                  <div class="col-6 small">Viento: ${viento}</div>
                  <div class="col-6 small">Indice max uv:4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        <section class="container-fluid bg-primary border-primary overflow-auto" >
      <div id ="contenedorProximasHoras" class="d-flex justify-content-center align-items-center">
      
      </div>
    </section>
    
    `;
    const horita = new Date();
    let hora = horita.getHours(); // Obtiene la hora en formato 24 horas (0-23)

    const contenedorProximasHoras = document.querySelector(
      "#contenedorProximasHoras"
    );
    for (let index = 0; index < hoy.temperatura.length; index++) {
      let sumahora = (hora + index) % 24;

      contenedorProximasHoras.innerHTML += `
        <div class="container p-4 ">
          <div class="carta rounded border border-3 border-primary d-flex justify-content-center align-items-center">
            <div>
              <div class="row my-3">
                <h1>${sumahora}</h1>
              </div>
              <div class="row my-3">imagen</div>
              <div class="row my-3">
                <h4>Temperatura: ${hoy.temperatura[index]}°C</h4>
              </div>
              <div class="row my-3">
                <h4>Porcentaje: ${hoy.precipitacion[index]}%</h4>
              </div>
              <div class="row my-3">
                <h4>Viento: ${hoy.viento[index].velocidad} km/h</h4>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.log(error);
  }
};

getDataProvincias();

/*
 <div class="container p-4 ">
        <div class="carta rounded border border-3 border-primary d-flex justify-content-center align-items-center">
          <div >
            <div class="row my-3"> <h1>hora</h1></div>
            <div class="row my-3">imagen</div>
            <div class="row  my-3" > <h4>Temperatura</h4></div>
            <div class="row  my-3"><h4>Porcentaje</h4></div>
            <div class="row my-3"> <h4>Viento</h4></div>
          </div>
        </div>
      </div>
      
      
*/
