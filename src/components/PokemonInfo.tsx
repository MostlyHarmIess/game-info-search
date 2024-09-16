import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import DamageTaken from "./DamageTaken";
import { POKEMON_ENDPOINT } from "../config";
import PokemonOfType from "./PokemonOfType";
import { useQuery } from "@tanstack/react-query";

function PokemonInfo() {
  const { userChoice } = useParams();

  const navigate = useNavigate();

  const [pokemonData, setPokemonData] = useState<any>({});
  const [typeData, setTypeData] = useState<any[]>([]);

  const specificPokemonQuery = useQuery({
    queryKey: ["specificPokemonQuery", userChoice],
    queryFn: () => getPokemonInfo(),
    staleTime: 1000 * 60 * 5,
  });

  const specificTypesQueryType1 = useQuery({
    queryKey: ["specificTypesQueryType1", userChoice],
    queryFn: () => getTypeInfo(specificPokemonQuery.data.types[0].type.name),
    staleTime: 1000 * 60 * 5,
    enabled: !!specificPokemonQuery.isSuccess,
  });

  const specificTypesQueryType2 = useQuery({
    queryKey: ["specificTypesQueryType2", userChoice],
    queryFn: () => getTypeInfo(specificPokemonQuery.data.types[1].type.name),
    staleTime: 1000 * 60 * 5,
    enabled:
      !!specificPokemonQuery.isSuccess && !!specificPokemonQuery.data.types[1],
  });

  async function getTypeInfo(type: string) {
    try {
      const response = await fetch(
        `${POKEMON_ENDPOINT}type/${type}?limit=100000`,
      );
      if (!response.ok) {
        throw response;
      }
      const data = await response.json();

      return data;
    } catch (e) {
      throw new Error(e as string);
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

      return data;
    } catch (e) {
      throw new Error(e as string);
    }
  }

  useEffect(() => {
    setPokemonData(specificPokemonQuery.data);
  }, [specificPokemonQuery.data]);

  useEffect(() => {
    setTypeData([
      specificTypesQueryType1.data,
      specificTypesQueryType2.data ?? [],
    ]);
  }, [specificTypesQueryType1.data, specificTypesQueryType2.data]);

  if (!pokemonData?.name || !typeData[0]?.name) {
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
          alt={typeData[0].name}
          style={{ minHeight: "127px" }}
        />
        <Typography variant="h1" component="h1">
          {userChoice}, {typeData[0].name},{typeData[1] ? typeData[1].name : ""}
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
