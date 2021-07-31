import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CopyToClipBoard from "react-copy-to-clipboard";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { createMarkdownLink } from "./utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    icon: {
      color: "rgba(255, 255, 255, 0.54)",
    },
  })
);

type GiphyImage = {
  title: string;
  originalUrl: string;
  previewGifUrl: string;
  username: string;
};

const Popup = () => {
  const giphyEndpoint = "https://api.giphy.com/v1/gifs/search";
  const maxShowImages = 4;
  const classes = useStyles();
  const [totalCount, setTotalCount] = useState(0);
  const [openPasteSnackBar, setOpenPasteSnackBar] = React.useState(false);
  const [images, setImages] = useState<GiphyImage[]>([
    {
      title: "no image",
      originalUrl: "",
      previewGifUrl: "",
      username: "john doe",
    },
  ]);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState<string>("looks good");
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    chrome.browserAction.setBadgeText({ text: totalCount.toString() });
  }, [totalCount]);

  useEffect(() => {
    chrome.storage.sync.get(
      {
        giphyAPIKey: "",
        giphyQuery: "looks good",
      },
      (items) => {
        setApiKey(items.giphyAPIKey);
        setQuery(items.giphyQuery);
      }
    );
  }, []);

  useEffect(() => {
    getGiphyImage();
  }, [apiKey, query, offset]);

  const handleClickPaste = () => {
    setOpenPasteSnackBar(true);
  };

  const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  const handleClosePaste = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenPasteSnackBar(false);
  };

  const getGiphyImage = () => {
    if (apiKey == "") {
      console.log("no api key");
      return;
    }
    const url = `${giphyEndpoint}?api_key=${apiKey}&q=${query}&limit=${maxShowImages}&offset=${offset}&rating=g`;
    fetch(url).then((resp) => {
      resp.json().then((json) => {
        setTotalCount(json.pagination.total_count);
        const data = json.data.map((content: any) => ({
          title: content.title,
          originalUrl: content.images.original.url,
          previewGifUrl: content.images.preview_gif.url,
          username: content.username,
        }));
        setImages(data);
      });
    });
  };

  return (
    <>
      <ImageList rowHeight={180}>
        <ImageListItem key="Subheader" cols={2} style={{ height: "auto" }}>
          <ListSubheader component="div">
            Search for <b>【{query}】</b>
          </ListSubheader>
        </ImageListItem>
        {images.map((item) => (
          <ImageListItem key={item.originalUrl}>
            <img src={item.previewGifUrl} alt={item.title} />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>by: {item.username}</span>}
              actionIcon={
                <CopyToClipBoard
                  text={createMarkdownLink(item.title, item.originalUrl)}
                >
                  <IconButton
                    aria-label={`info about ${item.title}`}
                    onClick={handleClickPaste}
                    className={classes.icon}
                  >
                    <AssignmentIcon />
                  </IconButton>
                </CopyToClipBoard>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Button
        onClick={() =>
          setOffset(offset < maxShowImages ? 0 : offset - maxShowImages)
        }
        style={{ marginRight: "5px" }}
        className={classes.button}
        color="primary"
        disabled={offset == 0}
        startIcon={<NavigateBeforeIcon />}
      >
        Previous
      </Button>
      <Button
        onClick={() =>
          setOffset(
            offset > 4999 - maxShowImages ? 4999 : offset + maxShowImages
          )
        }
        style={{ marginRight: "5px" }}
        color="primary"
        className={classes.button}
        disabled={offset == 4999}
        endIcon={<NavigateNextIcon />}
      >
        Next
      </Button>
      <Snackbar
        open={openPasteSnackBar}
        autoHideDuration={2000}
        onClose={handleClosePaste}
      >
        <Alert onClose={handleClosePaste} severity="success">
          Copied!!
        </Alert>
      </Snackbar>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
