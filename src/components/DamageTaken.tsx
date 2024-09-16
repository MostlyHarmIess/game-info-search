/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";

interface DamageTakenInterface {
  fourTimes: string[];
  twoTimes: string[];
  halfTimes: string[];
  quarterTimes: string[];
  immune: string[];
}
function DamageTaken({ typeData }) {
  const [totalDamageTaken, setTotalDamageTaken] =
    useState<DamageTakenInterface>({
      fourTimes: [],
      twoTimes: [],
      halfTimes: [],
      quarterTimes: [],
      immune: [],
    });

  function compareDamageTaken() {
    if (!typeData[0]?.name) return;

    const doubleFrom1 = new Set<string>([
      ...typeData[0].damage_relations.double_damage_from.map((ele) => ele.name),
    ]);
    const halfFrom1 = new Set<string>([
      ...typeData[0].damage_relations.half_damage_from.map((ele) => ele.name),
    ]);
    const noDamageFrom1 = new Set<string>([
      ...typeData[0].damage_relations.no_damage_from.map((ele) => ele.name),
    ]);

    if (!typeData[1]?.name) {
      setTotalDamageTaken({
        fourTimes: [],
        twoTimes: [...doubleFrom1],
        halfTimes: [...halfFrom1],
        quarterTimes: [],
        immune: [...noDamageFrom1],
      });
      return;
    }
    const doubleFrom2 = new Set<string>([
      ...typeData[1].damage_relations.double_damage_from.map((ele) => ele.name),
    ]);

    const halfFrom2 = new Set<string>([
      ...typeData[1].damage_relations.half_damage_from.map((ele) => ele.name),
    ]);

    const noDamageFrom2 = new Set<string>([
      ...typeData[1].damage_relations.no_damage_from.map((ele) => ele.name),
    ]);

    setTotalDamageTaken({
      fourTimes: [
        ...doubleFrom1
          .intersection(doubleFrom2)
          .difference(noDamageFrom1.union(noDamageFrom2)),
      ],
      twoTimes: [
        ...doubleFrom1
          .symmetricDifference(doubleFrom2)
          .difference(halfFrom1.symmetricDifference(halfFrom2))
          .difference(noDamageFrom1.union(noDamageFrom2)),
      ],
      halfTimes: [
        ...halfFrom1
          .symmetricDifference(halfFrom2)
          .difference(doubleFrom1.symmetricDifference(doubleFrom2))
          .difference(noDamageFrom1.union(noDamageFrom2)),
      ],
      quarterTimes: [...halfFrom1.intersection(halfFrom2)],
      immune: [...noDamageFrom1.union(noDamageFrom2)],
    });
  }
  useEffect(() => {
    compareDamageTaken();
  }, [typeData]);

  return (
    <>
      <Grid xs={2.4}>
        <Card style={{ minHeight: "150px" }}>
          <CardContent>
            <Typography
              variant="h3"
              component="div"
              style={{ paddingBottom: "10px" }}
            >
              4x
            </Typography>
            <Typography variant="body1" component="div">
              {totalDamageTaken.fourTimes.map((ele) => (
                <img
                  key={ele}
                  src={`../src/assets/${ele}.png`}
                  alt={`${ele} type`}
                  height="32px"
                />
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={2.4}>
        <Card style={{ minHeight: "150px" }}>
          <CardContent>
            <Typography
              variant="h3"
              component="div"
              style={{ paddingBottom: "10px" }}
            >
              2x
            </Typography>
            <Typography variant="body1" component="div">
              {totalDamageTaken.twoTimes.map((ele) => (
                <img
                  key={ele}
                  src={`../src/assets/${ele}.png`}
                  alt={`${ele} type`}
                  height="32px"
                />
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={2.4}>
        <Card style={{ minHeight: "150px" }}>
          <CardContent>
            <Typography
              variant="h3"
              component="div"
              style={{ paddingBottom: "10px" }}
            >
              1/2x
            </Typography>
            <Typography variant="body1" component="div">
              {totalDamageTaken.halfTimes.map((ele) => (
                <img
                  key={ele}
                  src={`../src/assets/${ele}.png`}
                  alt={`${ele} type`}
                  height="32px"
                />
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={2.4}>
        <Card style={{ minHeight: "150px" }}>
          <CardContent>
            <Typography
              variant="h3"
              component="div"
              style={{ paddingBottom: "10px" }}
            >
              1/4x
            </Typography>
            <Typography variant="body1" component="div">
              {totalDamageTaken.quarterTimes.map((ele) => (
                <img
                  key={ele}
                  src={`../src/assets/${ele}.png`}
                  alt={`${ele} type`}
                  height="32px"
                />
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={2.4}>
        <Card style={{ minHeight: "150px" }}>
          <CardContent>
            <Typography
              variant="h3"
              component="div"
              style={{ paddingBottom: "10px" }}
            >
              0x
            </Typography>
            <Typography variant="body1" component="div">
              {totalDamageTaken.immune.map((ele) => (
                <img
                  key={ele}
                  src={`../src/assets/${ele}.png`}
                  alt={`${ele} type`}
                  height="32px"
                />
              ))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

export default DamageTaken;
