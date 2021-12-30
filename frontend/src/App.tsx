import "./App.css";
import React from "react";
import { Link } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";
import { SubjectsResponse } from "@backend/index";
import { SubjectURL } from "@backend/scrape-urls";

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      subjectURLs: [],
      dataLoaded: false,
    };
  }
  //Fetch subjects from api when component mounts
  componentDidMount() {
    //TODO: Use docker network to connect to api
    fetch("http://api.localhost/subjects")
      .then((res) => res.json())
      .then((data: SubjectsResponse) => {
        this.setState({
          ...this.state,
          dataLoaded: true,
          subjectURLs: data.data,
        });
      });
  }

  render() {
    const columns: TableColumn<DataRow>[] = [
      {
        name: "Name",
        //TODO: Fix links in the datatable
        // @ts-ignore
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "Code",
        selector: (row) => row.code,
        sortable: true,
      },
    ];
    if (this.state.dataLoaded) {
      let data = this.state.subjectURLs.map((url) => {
        return {
          id: url.code,
          name: <Link to={"diff/" + url.code}>{url.name}</Link>,
          code: url.code,
        };
      });
      return (
        <>
          <h1>Subjects</h1>
          <DataTable columns={columns} data={data} />
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
  subjectURLs: SubjectURL[];
  dataLoaded: boolean;
};

type DataRow = {
  name: JSX.Element;
  code: string;
};

export default App;
