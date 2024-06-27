import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import DamageTaken from "./DamageTaken";
import { POKEMON_ENDPOINT } from "../config";
import PokemonOfType from "./PokemonOfType";

function PokemonInfo() {
  const { userChoice } = useParams();
  const navigate = useNavigate();
  const [pokemonData, setPokemonData] = useState(
    JSON.parse(localStorage.getItem("pokemonData")) || [],
  );
  const [typeData, setTypeData] = useState(
    JSON.parse(localStorage.getItem("typeData")) || [],
  );

  async function getTypeInfo(type) {
    try {
      const response = await fetch(
        `${POKEMON_ENDPOINT}type/${type}?limit=100000`,
      );
      if (!response.ok) {
        throw response;
      }
      const data = await response.json();

      delete data.game_indices;
      delete data.generation;
      delete data.move_damage_class;
      delete data.moves;
      delete data.names;
      delete data.past_damage_relations;

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async function getPokemonInfo() {
    try {
      const response = await fetch(
        `${POKEMON_ENDPOINT}pokemon/${userChoice}?limit=100000`,
      );
      if (!response.ok) {
        throw response;
      }
      const data = await response.json();

      setPokemonData(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  async function assembleTypeData() {
    if (pokemonData.types && pokemonData.types.length === 1) {
      setTypeData([await getTypeInfo(pokemonData.types[0].type.name)]);
    } else {
      setTypeData([
        await getTypeInfo(pokemonData.types[0].type.name),
        await getTypeInfo(pokemonData.types[1].type.name),
      ]);
    }
  }

  useEffect(() => {
    if (
      !typeData[0] ||
      !pokemonData.name ||
      pokemonData.name !== userChoice ||
      pokemonData.types[0].type.name !== typeData[0].name
    ) {
      getPokemonInfo();
    }
  }, []);

  useEffect(() => {
    // console.log(pokemonData);
    if (pokemonData.name) {
      localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
    }
    if (
      !typeData[0] ||
      !pokemonData.name ||
      pokemonData.name !== userChoice ||
      pokemonData.types[0].type.name !== typeData[0].name
    ) {
      assembleTypeData();
    }
  }, [pokemonData]);

  useEffect(() => {
    if (typeData?.[0]?.name) {
      localStorage.setItem("typeData", JSON.stringify(typeData));
    }
  }, [typeData]);

  if (
    !typeData[0] ||
    !pokemonData.name ||
    pokemonData.name !== userChoice ||
    pokemonData.types[0].type.name !== typeData[0].name
  ) {
    return (
      <Grid container spacing={1}>
        <Grid
          xs={12}
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container spacing={1}>
      <Grid
        xs={12}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={pokemonData.sprites.front_default}
          alt={typeData[0]?.name}
          style={{ minHeight: "127px" }}
        />
        <Typography variant="h1" component="h1">
          {userChoice}
          ,&nbsp;
          {typeData[0]?.name}
          &nbsp;
          {typeData[1] ? typeData[1].name : ""}
        </Typography>
        <IconButton
          style={{ height: "40px", width: "40px", marginLeft: "auto" }}
          onClick={() => navigate("/")}
        >
          <ArrowBackIcon />
        </IconButton>
      </Grid>

      <Grid xs={12}>
        <Typography variant="h4" component="div">
          Damage Taken
        </Typography>
      </Grid>

      <DamageTaken typeData={typeData} />

      <Grid xs={12}>
        <Typography variant="h4" component="div">
          Other pokemon of this typing
        </Typography>
      </Grid>

      <PokemonOfType typeData={typeData} />
    </Grid>
  );
}

export default PokemonInfo;
