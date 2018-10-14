import * as React from "react";
import Dropzone, { FileWithPreview } from "react-dropzone";
import { Grid, Header, Progress, Segment } from "semantic-ui-react";

import { RouteComponentProps } from "@reach/router";

const style = {
  h1: {
    marginTop: "3em"
  },
  h2: {
    margin: "4em 0em 2em"
  },
  h3: {
    marginTop: "2em",
    padding: "2em 0em"
  },
  last: {
    marginBottom: "300px"
  }
};

const { Column } = Grid;

interface StateType {
  result: string | undefined;
  fileName: string | undefined;
  imageSrc: string | undefined;
}

class Server extends React.Component<RouteComponentProps, StateType> {
  public initialState = {
    result: undefined,
    fileName: undefined,
    imageSrc: undefined
  };

  public state = this.initialState;

  public render() {
    const { result, fileName } = this.state;
    return (
      <div>
        <Header
          as="h1"
          content="tesseract on server (go/c++)"
          style={style.h1}
          textAlign="center"
        />
        {fileName !== undefined && (
          <Progress
            percent={100}
            active={result === undefined}
            success={result !== undefined}
          />
        )}
        <Grid columns={3} stackable={true}>
          <Column>
            <Header
              as="h3"
              content="File Upload"
              style={style.h3}
              textAlign="center"
            />
            <Dropzone onDrop={this.handleDrop} onClick={this.handleClick} />
          </Column>
          <Column>
            {this.state.imageSrc !== undefined && (
              <>
                <Header
                  as="h3"
                  content={`Original Image: ${this.state.fileName}`}
                  style={style.h3}
                  textAlign="center"
                />
                <img
                  src={this.state.imageSrc}
                  style={{ width: "auto", maxHeight: "300px" }}
                />
              </>
            )}
          </Column>
          <Column>
            {this.state.result !== undefined && (
              <>
                <Header
                  as="h3"
                  content="Recognized Text"
                  style={style.h3}
                  textAlign="center"
                />
                <Segment>{this.state.result}</Segment>
              </>
            )}
          </Column>
        </Grid>
      </div>
    );
  }

  private handleDrop = (
    accepted: FileWithPreview[],
    rejected: FileWithPreview[],
    event: React.DragEvent<HTMLDivElement>
  ) => {
    accepted.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          this.setState({ imageSrc: reader.result });
          fetch("/base64", {
            method: "POST",
            body: JSON.stringify({
              base64: reader.result,
              trim: "\n"
            })
          })
            .then(response => response.json())
            .then((data: { result: string; version: string }) => {
              this.setState({ result: data.result });
            });
        }
      };
      reader.readAsDataURL(file);
      this.setState({ fileName: file.name });
    });
  };

  private handleClick = () => {
    this.setState(this.initialState);
  };
}

export default Server;
