import React, { useState, useEffect, useRef } from "react";
import { FaEthereum, FaReact } from "react-icons/fa";
import { SiSolidity } from "react-icons/si";
import { FiGithub, FiTwitter } from "react-icons/fi";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import jazzicon from "@metamask/jazzicon";

import "./App.css";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const Nav = () => {
    return (
      <Box
        sx={{
          "& > :not(style)": { m: 2, pr: 0 },
          justifyContent: "right",
          display: "flex"
        }}
      >
        <a href="https://github.com/njuettner">
          <FiGithub />
        </a>
        <a href="https://twitter.com/njuettner">
          <FiTwitter />
        </a>
      </Box>
    );
  };

  const Introduction = () => {
    return (
      <Box
        sx={{
          "& > :not(style)": { m: 0 },
          justifyContent: "center",
          display: "flex"
        }}
      >
        <Box
          sx={{
            "& > :not(style)": { m: 5 },
            width: 450,
            height: 200
          }}
        >
          <p>
            Hello Fren!{" "}
            <span role="img" aria-label="Cowboy">
              👋🏻
            </span>
          </p>
          <p>
            <span role="img" aria-label="wave"></span>
            My name is Nick and I'm currently trying out "Web3". You can send me
            a message which will be written on the <FaEthereum /> blockchain.
            This is my first dapp and my main motivation was starting to learn
            some new skills. This frontend is written with React <FaReact /> and
            in the backend I use Solidity
            <SiSolidity /> (obvs.) to interact with the <FaEthereum />{" "}
            blockchain.
          </p>
        </Box>
      </Box>
    );
  };

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

  const WalletAccountCard = () => {
    return (
      <Box
        sx={{
          "& > :not(style)": { m: 5 },
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Card
          sx={{
            minWidth: 400
          }}
        >
          <CardContent>
            <Typography
              sx={{ fontSize: 18 }}
              color="text.secondary"
              gutterBottom
            >
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
      </Box>
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

  function MetaMaskAvatar({ account }) {
    const avatarRef = useRef();
    useEffect(() => {
      const element = avatarRef.current;
      if (element && account) {
        const addr = account;
        const seed = parseInt(addr, 16);
        const icon = jazzicon(20, seed);
        if (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        element.appendChild(icon);
      }
    }, [account, avatarRef]);
    return <div ref={avatarRef} />;
  }

  function InputWithIcon() {
    return (
      <Box
        sx={{
          "& > :not(style)": { m: 20 },
          display: "flex",
          justifyContent: "center"
        }}
      >
        <TextField
          id="input-with-icon-textfield"
          label="Your message"
          color="success"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MetaMaskAvatar account />
              </InputAdornment>
            )
          }}
          variant="standard"
        />
        <Button variant="contained" size="small">
          Send
        </Button>
      </Box>
    );
  }
  useEffect(() => {
    IsMetaMaskInstalled();
    WalletConnect();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <div className="center">
          <Nav />
          <Introduction />
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
