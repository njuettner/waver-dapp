import React, { useState, useEffect } from "react";
import { FaEthereum } from "react-icons/fa";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";

function InputWithIcon() {
  return (
    <Box
      sx={{
        "& > :not(style)": { m: 16 }
      }}
    >
      <TextField
        id="input-with-icon-textfield"
        label="Your message"
        color="success"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          )
        }}
        variant="standard"
      />
    </Box>
  );
}

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Todo integrate light mode
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light"
        },
        spacing: 2
      }),
    [prefersDarkMode]
  );
  const [account, setAccount] = useState("");

  const EthereumProviderNetwork = () => {};

  const WalletAccountCard = () => {
    return (
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
            Connected with <FaEthereum /> account
          </Typography>
          <Typography
            sx={{ fontSize: 14 }}
            color="text.primary"
            gutterBottom
            component="div"
          >
            {account}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            target="_blank"
            href={"https://etherscan.io/address/" + account}
          >
            Etherscan
          </Button>
        </CardActions>
      </Card>
    );
  };

  const WalletConnect = async () => {
    const { ethereum } = window;
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const IsMetaMaskInstalled = async () => {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      console.log("✔️ MetaMask is installed");
      return true;
    } else {
      console.log("❌ Please install MetaMask");
      alert("❌ Cannot find MetaMask 🦊, please install the extension first.");
      return false;
    }
  };

  useEffect(() => {
    IsMetaMaskInstalled();
    WalletConnect();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Box m={5} pt={5}></Box>
        <div className="center">
          {!account ? (
            <Button variant="contained" onClick={WalletConnect}>
              <FaEthereum />
              Connect your wallet
            </Button>
          ) : (
            <WalletAccountCard />
          )}
        </div>
        <div>
          <InputWithIcon />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
