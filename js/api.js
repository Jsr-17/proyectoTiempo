const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 277;

app.use(cors());
app.use(bodyParser.json());

const getData = async (provincia) => {
  const respuesta = await axios(
    `https://www.el-tiempo.net/api/json/v2/provincias/${provincia}/municipios`
  );
  return respuesta.data.municipios;
};
const getDataMunicipios = async (provincia, municipios) => {
  const respuesta = await axios(
    `https://www.el-tiempo.net/api/json/v2/provincias/${provincia}/municipios/${municipios}`
  );
  return respuesta.data;
};

app.get("/", async (req, res) => {
  try {
    const data = await getData("18");

    res.send(data.data.municipios.map((el) => el.NOMBRE));
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching weather data");
  }
  res.send("<h1>Hola</h1>");
});

app.post("/todosDatos", async (req, res) => {
  const { provinciaBusqueda, municipioBusqueda } = req.body;
  const municipio = "".concat(
    municipioBusqueda[0],
    municipioBusqueda[1],
    municipioBusqueda[2],
    municipioBusqueda[3],
    municipioBusqueda[4]
  );

  const datos = await getDataMunicipios(provinciaBusqueda, municipio);
  console.log(datos);
  res.send(datos);
});
app.post("/idProvincia", async (req, res) => {
  const { cd } = req.body;
  const datos = await getData(cd);

  res.send(datos);
});
app.listen(port, () => {
  console.log("listening...");
});
