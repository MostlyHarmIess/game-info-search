import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SearchBar from "./components/SearchBar";
import Layout from "./pages/Layout";
import PokemonInfo from "./components/PokemonInfo";
import TypeInfo from "./components/TypeInfo";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  // const [userChoice, setUserChoice] = useState([]);

  // function handleUserChoice(input) {
  //   setUserChoice(input);
  // }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SearchBar />} />
            <Route path="/pokemon-info/:userChoice" element={<PokemonInfo />} />
            <Route path="/type-info/:userChoice" element={<TypeInfo />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
