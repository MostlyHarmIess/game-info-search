import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link underline="none" color="inherit" href="/">
              Game info search
            </Link>
          </Typography>
          <Button color="inherit">Pokemon</Button>
          <Button color="inherit" disabled>
            Game 2
          </Button>
          <Button color="inherit" disabled>
            Game 3
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
