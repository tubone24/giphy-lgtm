import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Options = () => {
  const [giphyAPIKey, setGiphyAPIKey] = useState<string>();
  const [giphyQuery, setGiphyQuery] = useState<string>();
  const [status, setStatus] = useState<string>();

  const handleSetGiphyAPI = (event: any) => {
    setGiphyAPIKey(event.target.value);
  };

  const handleSetGiphyQuery = (event: any) => {
    setGiphyQuery(event.target.value);
  };

  useEffect(() => {
    chrome.storage.sync.get(
      {
        giphyAPIKey: "",
        giphyQuery: "looks good",
      },
      (items) => {
        setGiphyAPIKey(items.giphyAPIKey);
        setGiphyQuery(items.giphyQuery);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        giphyAPIKey: giphyAPIKey,
        giphyQuery: giphyQuery,
      },
      () => {
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus(undefined);
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <>
      <div>
        <form noValidate autoComplete="off">
          <TextField
            id="standard-basic"
            label="Giphy API Key"
            onChange={handleSetGiphyAPI}
            value={giphyAPIKey}
          />
          <TextField
            id="standard-basic"
            label="Giphy Query keyword"
            onChange={handleSetGiphyQuery}
            value={giphyQuery}
          />
        </form>
      </div>
      <div>{status}</div>
      <Button onClick={saveOptions}>Save</Button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
