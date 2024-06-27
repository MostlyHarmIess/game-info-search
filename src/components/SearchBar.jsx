/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router";
import { POKEMON_ENDPOINT } from "../config";

function SearchBar() {
  const navigate = useNavigate();
  const [pokemonList, setPokemonList] = useState(
    () => JSON.parse(localStorage.getItem("pokemon")) || [],
  );

  const [typeList, setTypeList] = useState(
    () => JSON.parse(localStorage.getItem("types")) || [],
  );

  async function fetchPokemon(endpoint) {
    try {
      const response = await fetch(
        `${POKEMON_ENDPOINT}${endpoint}?limit=100000`,
      );
      if (!response.status === "ok") {
        throw response;
      }
      const data = await response.json();
      const shapedData = data.results.flat();

      switch (endpoint) {
        case "pokemon":
          localStorage.setItem("pokemon", JSON.stringify(shapedData));
          setPokemonList(shapedData);
          break;
        case "type":
          localStorage.setItem("types", JSON.stringify(shapedData));
          setTypeList(shapedData);
          break;
        default:
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("pokemon"))) {
      fetchPokemon("pokemon");
    }
    if (!JSON.parse(localStorage.getItem("types"))) {
      fetchPokemon("type");
    }
  }, []);

  return (
    <Autocomplete
      id="pokemon-search-box"
      options={typeList.concat(pokemonList)}
      getOptionLabel={(option) => option.name}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.key = "Enter";
        }
      }}
      onChange={(event, value) => {
        if (
          value.length === 1 &&
          pokemonList.some((ele) => ele.name === value[0].name)
        ) {
          navigate(`/pokemon-info/${value.map((ele) => ele.name)}`);
        } else if (
          value.length === 2 &&
          !pokemonList.some(
            (ele) => ele.name === value[0].name || ele.name === value[1].name,
          )
        ) {
          navigate(`/type-info/${value.map((ele) => ele.name).join("-")}`);
        }
      }}
      multiple
      filterSelectedOptions
      disablePortal
      autoHighlight
      fullWidth
      sx={{ marginTop: "40vh" }}
      renderInput={(params) => (
        <TextField {...params} label="Search pokemon names or types" />
      )}
    />
  );
}

export default SearchBar;
