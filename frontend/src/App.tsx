import "./App.css";
import React from "react";
import { Link } from "react-router-dom";
import DataTable, { TableColumn, TableRow } from "react-data-table-component";

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
      let data = this.state.subjects.map((subject) => {
        return {
          id: subject.code,
          name: <Link to={"diff/" + subject.code}>{subject.name}</Link>,
          code: subject.code,
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

type DataRow = {
  name: JSX.Element;
  code: string;
};

export default App;
