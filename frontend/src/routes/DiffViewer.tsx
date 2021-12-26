import React, { Component } from "react";
import ReactDiffViewer from "react-diff-viewer";

export class DiffViewer extends Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      subject: undefined,
      newSubject: undefined,
      isLoaded: false,
    };
  }

  componentDidMount() {
    fetch("http://api.localhost/subjects/VIAUA007")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          subject: json.subject,
          newSubject: json.newSubject,
          isLoaded: true,
        });
        console.log(this.state);
      });
  }
  render = () => {
    if (this.state.isLoaded && this.state.subject && this.state.newSubject) {
      return (
        <ReactDiffViewer
          oldValue={this.state.subject.htmlDataFields}
          newValue={this.state.newSubject.htmlDataFields}
          splitView={true}
        />
      );
    } else {
      return <div>Loading...</div>;
    }
  };
}

type State = {
  subject: Subject | undefined;
  newSubject: Subject | undefined;
  isLoaded: boolean;
};

type Subject = {
  htmlDataFields: string;
};
