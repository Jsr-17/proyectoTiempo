const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 1024;

app.use(cors());
app.use(bodyParser.json());

const getData = async (provincia) => {
  try {
    const respuesta = await axios(
      `https://www.el-tiempo.net/api/json/v2/provincias/${provincia}/municipios`
    );
    return respuesta.data.municipios;
  } catch (e) {
    console.log(e);
  }
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
  try {
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
  } catch (e) {
    console.log(e);
  }
});
app.post("/idProvincia", async (req, res) => {
  try {
    const { cd } = req.body;
    const datos = await getData(cd);

    res.send(datos);
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log("listening...");
});
