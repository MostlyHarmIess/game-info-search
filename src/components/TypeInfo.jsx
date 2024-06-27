import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { POKEMON_ENDPOINT } from "../config";
import DamageTaken from "./DamageTaken";
import PokemonOfType from "./PokemonOfType";

function TypeInfo() {
  const navigate = useNavigate();
  const { userChoice } = useParams();
  const shapedUserChoice = userChoice.split("-");
  const [typeData, setTypeData] = useState(
    JSON.parse(localStorage.getItem("typeData")) || [],
  );

  async function getTypeInfo(type) {
    if (!type) return undefined;

    try {
      const response = await fetch(
        `${POKEMON_ENDPOINT}type/${type}?limit=100000`,
      );
      if (!response.status === "ok") {
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

  async function assembleTypeData() {
    setTypeData([
      await getTypeInfo(shapedUserChoice[0]),
      await getTypeInfo(shapedUserChoice[1]),
    ]);
  }

  useEffect(() => {
    if (
      !typeData ||
      typeData[0]?.name !== shapedUserChoice[0] ||
      typeData[1]?.name !== shapedUserChoice[1]
    ) {
      assembleTypeData();
    }
  }, []);

  useEffect(() => {
    if (typeData) {
      localStorage.setItem("typeData", JSON.stringify(typeData));
    }
  }, [typeData]);

  if (
    !typeData[0]?.name ||
    typeData[0].name !== shapedUserChoice[0] ||
    typeData[1].name !== shapedUserChoice[1]
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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" component="h1">
          {shapedUserChoice[0]}
          &nbsp;
          {shapedUserChoice[1]}
        </Typography>
        <IconButton
          style={{ height: "40px", width: "40px" }}
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
          Pokemon with these types
        </Typography>
      </Grid>

      <PokemonOfType typeData={typeData} />
    </Grid>
  );
}

export default TypeInfo;
