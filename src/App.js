import react, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBoxes/infobox";
import Map from "./Map/Map";
import "./App.css";
import LineGraph from "./Graphs/LineGraph";
import { sortData, prettyPrintStat } from "./util";
import Table from "./Table_Data/Table";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);

  const [country, setCountry] = useState("Worldwide");

  const [countryInfo, setCountryInfo] = useState({});

  const [tableData, settableData] = useState([]);

  const [casesType, setCasesType] = useState(["cases"]);

  const [mapCountries, setMapCountries] = useState([]);

  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });

  const [mapZoom, setMapZoom] = useState(2);

  // STATE : is the varibale in react jo ky ek majooda halat ko show karta ha like is waqt running ma kia chal raha hai

  // https://disease.sh/v3/covid-19/countries

  // USEEFFECT = is the ver powerfull hook which is essentialy use to run a piece of code based on a given conditon

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const SortedData = sortData(data);
          settableData(SortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []); // async ->>> we use async code here which sends the http request to server and wait for it to do something with info get from server// the square brackets code which runs once when component loads and not again after

  console.log("hey here the types of ", casesType);

  const onCountryChangeHandler = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(2);
      });
  };

  console.log("heyaaaay for map location", setMapCenter);

  console.log(
    "hHEYAJSALJ I am MOHSIN The NOOOBBBBBB >>>>>>>>>>>>>>>>>>>>> in PUBG",
    countryInfo
  );

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/* header */}
          <h1>Covid-19 Tracker</h1>
          <h3>Developed by ALI RAZA</h3>
          <FormControl className="app__dropdown">
            {/* search field for countries  */}
            <Select
              varient="outlined"
              onChange={onCountryChangeHandler}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

              {/* need to show here the list of countries in dropdown */}
              {/* <MenuItem value="Worldwide">Worldwide</MenuItem>
            <MenuItem value="Worldwide">optn 1</MenuItem>
            <MenuItem value="Worldwide">optn 2</MenuItem>
            <MenuItem value="Worldwide">optn 3</MenuItem>
            <MenuItem value="Worldwide">optn 4</MenuItem> */}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* infoboxes */}

          {/* <InfoBox title="Active Cases" cases={countryInfo.active} critical={countryInfo.critical} />
           */}
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />

          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        {/* all data we are getting from https://disease.sh/ */}

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}></Table>

          <h3>Worldwide New {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
