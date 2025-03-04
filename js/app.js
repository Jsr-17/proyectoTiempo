const provincia = document.getElementById("provincia");
const municipio = document.getElementById("municipio");
const btnClima = document.getElementById("btnClima");
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
    const response = await axios.post("http://localhost:277/idProvincia", {
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
    const response = await axios.post("http://localhost:277/todosDatos", {
      provinciaBusqueda,
      municipioBusqueda,
    });
    const {
      municipio,
      precipitacion,
      pronostico,
      proximos_dias,
      stateSky,
      tempera_actual,
      temperaturas,
      viento,
    } = response.data;
    console.log(response.data);
  } catch (error) {}
};

getDataProvincias();
