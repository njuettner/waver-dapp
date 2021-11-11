// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { FaEthereum, FaReact } from "react-icons/fa";
import { SiSolidity } from "react-icons/si";
import { FiSend, FiGithub, FiTwitter } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
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
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import "./App.css";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const contractAddress = "0xd1254961F0d6030F2d3347e01758101B2ab58378";
  const contractABI = abi.abi;

  const [account, setAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);

  function GenerateMessages() {
    return allWaves.map((wave, index) => {
      return (
        <ListItem>
          <ListItemIcon>
            <BsPersonCircle />
          </ListItemIcon>
          <ListItemText
            primary={wave["timestamp"]}
            secondary={wave["address"] + " says " + wave["message"]}
          />
        </ListItem>
      );
    });
  }
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const message = document.getElementById("sendWave").value;
        console.log(message);
        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 600000
        });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const blockchainWaves = await waveContract.getAllWaves();
        console.log(blockchainWaves);

        const wavesCleaned = blockchainWaves.map((el) => {
          return {
            address: el.waver,
            message: el.message,
            timestamp: new Date(el.timestamp * 1000)
              .toString()
              .split(" ")
              .slice(0, 5)
              .join(" ")
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Nav = () => {
    return (
      <Box
        sx={{
          "& > :not(style)": { m: 0, pr: 7 },
          justifyContent: "center",
          display: "flex"
        }}
      >
        <Button target="_blank" href="https://github.com/njuettner">
          <FiGithub />
        </Button>
        <Button target="_blank" href="https://twitter.com/njuettner">
          <FiTwitter />
        </Button>
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
            height: 220
          }}
        >
          <p>
            Hello Fren!
            <span role="img" aria-label="Cowboy">
              👋🏻
            </span>
          </p>
          <p>
            <span role="img" aria-label="wave"></span>
            My name is Nick and I'm currently trying out "Web3". You can send me
            a message which will be written on the <FaEthereum /> Blockchain.
            This is my first dapp and my main motivation was starting to learn
            some new skills. This frontend is written with React <FaReact /> and
            in the backend I use Solidity
            <SiSolidity /> (obvs.) to interact with the <FaEthereum />
            Blockchain.
          </p>
          <b>
            <font color="red">This only works on Ropsten Network for now.</font>
          </b>
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

  const WalletAccountCard = () => {
    return (
      <Box
        sx={{
          "& > :not(style)": { m: 20 },
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
              Connected with <FaEthereum /> Account
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
              href={"https://ropsten.etherscan.io/address/" + account}
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
      console.log(error);
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
          id="sendWave"
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
        <Button variant="contained" size="small" onClick={wave}>
          <FiSend /> Send
        </Button>
      </Box>
    );
  }

  useEffect(() => {
    getAllWaves();
    IsMetaMaskInstalled();
    WalletConnect();

    const onNewWave = (from, time, message) => {
      console.log(from, time, message);

      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          time: new Date(time * 1000)
            .toString()
            .split(" ")
            .slice(0, 5)
            .join(" "),
          message
        }
      ]);
    };

    let wavePortalContract;
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <div className="center">
          <Nav />
          <Introduction />
          <Box
            sx={{
              "& > :not(style)": { m: 10 },
              justifyContent: "center",
              display: "flex"
            }}
          >
            {!account ? (
              <Button variant="contained" onClick={WalletConnect}>
                <FaEthereum />
                Connect your wallet
              </Button>
            ) : (
              <WalletAccountCard />
            )}
          </Box>
        </div>
        <div>
          <InputWithIcon />
        </div>
        <Grid container spacing={0} direction="column" alignItems="center">
          <div>
            <GenerateMessages />
          </div>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default App;
