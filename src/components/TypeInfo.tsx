import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { POKEMON_ENDPOINT } from "../config";
import DamageTaken from "./DamageTaken";
import PokemonOfType from "./PokemonOfType";
import { useQuery } from "@tanstack/react-query";

function TypeInfo() {
  const navigate = useNavigate();
  const { userChoice } = useParams();
  const shapedUserChoice = userChoice.split("-");
  const [typeData, setTypeData] = useState<any[]>([]);

  const specificTypesQueryType1 = useQuery({
    queryKey: ["specificTypesQueryType1", userChoice],
    queryFn: () => getTypeInfo(shapedUserChoice[0]),
    staleTime: 1000 * 60 * 5,
  });

  const specificTypesQueryType2 = useQuery({
    queryKey: ["specificTypesQueryType2", userChoice],
    queryFn: () => getTypeInfo(shapedUserChoice[1]),
    staleTime: 1000 * 60 * 5,
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

  useEffect(() => {
    setTypeData([specificTypesQueryType1.data, specificTypesQueryType2.data]);
  }, [specificTypesQueryType1.data, specificTypesQueryType2.data]);

  if (!typeData[0]?.name || !typeData[1]?.name) {
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
          {shapedUserChoice[0]} {shapedUserChoice[1]}
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
