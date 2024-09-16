import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router";
import { POKEMON_ENDPOINT } from "../config";
import { useQuery } from "@tanstack/react-query";

function SearchBar() {
  const navigate = useNavigate();

  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [typeList, setTypeList] = useState<any[]>([]);

  const pokemonQuery = useQuery({
    queryKey: ["pokemonQuery"],
    queryFn: () => fetchPokemon("pokemon"),
    staleTime: 1000 * 60 * 60,
  });

  const typeQuery = useQuery({
    queryKey: ["typeQuery"],
    queryFn: () => fetchPokemon("type"),
    staleTime: 1000 * 60 * 60,
  });

  async function fetchPokemon(endpoint: string) {
    try {
      const response = await fetch(
        `${POKEMON_ENDPOINT}${endpoint}?limit=100000`,
      );
      if (!response.ok) {
        throw response;
      }
      const data = await response.json();
      const shapedData = data.results.flat();

      return shapedData;
    } catch (e) {
      throw new Error(e as string);
    }
  }

  useEffect(() => {
    if (pokemonQuery.isSuccess) {
      setPokemonList(pokemonQuery.data);
    }
  }, [pokemonQuery.data, pokemonQuery.isSuccess]);

  useEffect(() => {
    if (typeQuery.isSuccess) {
      setTypeList(typeQuery.data);
    }
  }, [typeQuery.data, typeQuery.isSuccess]);

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
      onChange={(_event, value) => {
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
