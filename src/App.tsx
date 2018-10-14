import * as React from "react";
import Dropzone, { FileWithPreview } from "react-dropzone";
import { Grid, Header, Segment, Progress } from "semantic-ui-react";
import { TesseractStatic } from "tesseract.js";

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

const Tesseract: TesseractStatic = (window as any).Tesseract;

interface StateType {
  result: string | undefined;
  fileName: string | undefined;
  progress: number | undefined;
  status: string | undefined;
  imageSrc: string | undefined;
}

class App extends React.Component<object, StateType> {
  public initialState = {
    result: undefined,
    progress: undefined,
    fileName: undefined,
    status: undefined,
    imageSrc: undefined
  };

  public state = this.initialState;

  public render() {
    const { progress, status, result } = this.state;
    return (
      <div>
        <Header
          as="h1"
          content="OCR Demo"
          style={style.h1}
          textAlign="center"
        />
        {progress !== undefined &&
          status !== undefined && (
            <Progress
              percent={Math.floor(progress * 100)}
              indicating={progress < 1 && result === undefined}
              success={progress === 1 && result !== undefined}
              label={status}
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
        }
      };
      reader.readAsDataURL(file);
      this.setState({ fileName: file.name });

      Tesseract.recognize(file, { lang: "deu" })
        .progress(({ progress, status }) => {
          this.setState({ progress, status });
        })
        .catch(err => console.error(err))
        .then(result => {
          this.setState({ result: result.text });
        })
        .finally(resultOrError => console.log(resultOrError));
    });
  };

  private handleClick = () => {
    this.setState(this.initialState);
  };
}

export default App;
