import "./App.css";
import React from "react";
import { Link } from "react-router-dom";

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      subjects: [],
      dataLoaded: false,
    };
  }
  //Fetch subjects from api when component mounts
  componentDidMount() {
    //TODO: Use docker network to connect to api
    fetch("http://api.localhost/subjects")
      .then((res) => res.json())
      .then(async (data) => {
        await this.setState({
          ...this.state,
          dataLoaded: true,
          subjects: data.subjects,
        });
      });
  }

  render() {
    if (this.state.dataLoaded) {
      return (
        <>
          <h1>Subjects</h1>
          <ul>
            {this.state.subjects.map((subject) => (
              <Link to={subject.code} />
            ))}
          </ul>
        </>
      );
    } else {
      return (
        <>
          <h1>Loading...</h1>
        </>
      );
    }
  }
}

type State = {
  subjects: Subject[];
  dataLoaded: boolean;
};

export type Subject = {
  name: string;
  code: string;
  //The url of the subject in https://portal.vik.bme.hu/ website
  url: string;
  htmlDataFields: string;
};

export default App;
