/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";

function PokemonOfType({ typeData }) {
  const [pokemonOfType, setPokemonOfType] = useState([]);

  function pokemonOfBothTypes() {
    const pokemonOfFirstType = new Set([
      ...typeData[0].pokemon.map((ele) => ele.pokemon.name),
    ]);
    const pokemonOfSecondType = new Set(
      typeData[1]
        ? [...typeData[1].pokemon.map((ele) => ele.pokemon.name)]
        : [],
    );
    setPokemonOfType(
      [...pokemonOfFirstType.intersection(pokemonOfSecondType)].filter(
        (ele) =>
          !ele.endsWith("-gmax") &&
          !ele.endsWith("-terastal") &&
          !ele.endsWith("-stellar") &&
          !ele.endsWith("-meteor") &&
          !ele.endsWith("-plumage") &&
          !ele.endsWith("-mega"),
      ),
    );
  }

  useEffect(() => {
    if (typeData?.[0] && typeData[1]) {
      pokemonOfBothTypes();
    }
  }, [typeData]);

  if (!typeData[1]?.name) {
    return (
      <Grid xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="div">
              {typeData[0].pokemon
                .map((ele) => ele.pokemon.name)
                .filter(
                  (ele) =>
                    !ele.endsWith("-gmax") &&
                    !ele.endsWith("-terastal") &&
                    !ele.endsWith("-stellar") &&
                    !ele.endsWith("-meteor") &&
                    !ele.endsWith("-plumage") &&
                    !ele.endsWith("-mega"),
                )
                .join(", ")}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  }

  return (
    <Grid xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="div">
            {pokemonOfType.join(", ")}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default PokemonOfType;
