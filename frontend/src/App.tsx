import "./App.css";
import React from "react";
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
      {
        name: "Department",
        selector: (row) => row.department,
        sortable: true,
      },
      {
        name: "Credits",
        selector: (row) => row.credits,
        sortable: true,
      },
      {
        name: "Saved State Count",
        selector: (row) => row.stateCount,
        sortable: true,
      },
    ];
    if (this.state.dataLoaded) {
      let data = this.state.subjectURLs.map((url) => {
        return {
          id: url.code,
          name: url.name,
          code: url.code,
          credits: url.credits + " kredit",
          department: url.department,
          stateCount: url.stateCount.toString(),
        };
      });
      return (
        <>
          <h1>Subjects</h1>
          <DataTable
            columns={columns}
            data={data}
            onRowClicked={(row: DataRow) => {
              this.props.history.push("diff/" + row.code);
            }}
            dense
            fixedHeaderScrollHeight="300px"
            pagination
            responsive
            striped
            highlightOnHover
            subHeaderWrap
          />
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
  name: string;
  code: string;
  credits: string;
  department: string;
  stateCount: string;
};

export default App;
