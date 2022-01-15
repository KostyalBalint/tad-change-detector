import "./App.css";
import React, { useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { SubjectsResponse } from "@backend/index";
import { SubjectURL } from "@backend/scrape-urls";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [subjectURLs, setSubjectURLs] = React.useState<SubjectURL[]>([]);
  const [dataLoaded, setDataLoaded] = React.useState(false);

  const navigate = useNavigate();

  //Fetch subjects from api when component mounts
  useEffect(() => {
    //TODO: Use docker network to connect to api
    fetch(`http://api.${process.env.REACT_APP_BASE_URL}/subjects`)
      .then((res) => res.json())
      .then((data: SubjectsResponse) => {
        setDataLoaded(true);
        setSubjectURLs(data.data);
      });
  }, []);

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
  if (dataLoaded) {
    let data = subjectURLs.map((url) => {
      return {
        id: url.code,
        name: url.name,
        code: url.code,
        credits: url.credits,
        department: url.department,
        stateCount: url.stateCount,
      };
    });
    return (
      <>
        <h3 className={"mt-2 mb-2 text-center"}>Subjects</h3>
        <DataTable
          columns={columns}
          data={data}
          onRowClicked={(row: DataRow) => {
            navigate("/diff/" + row.code);
          }}
          conditionalRowStyles={[
            {
              when: (row) => row.stateCount > 1,
              style: {
                backgroundColor: "rgba(247, 89, 57, 0.9)",
              },
            },
          ]}
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
        <h3 className={"mt-2 mb-2 text-center"}>Loading...</h3>
      </>
    );
  }
};

type DataRow = {
  name: string;
  code: string;
  credits: number;
  department: string;
  stateCount: number;
};

export default App;
