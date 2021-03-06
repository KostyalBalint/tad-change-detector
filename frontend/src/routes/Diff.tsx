import React, { useEffect } from "react";
import { SubjectSavesResponse } from "@backend/index";
import { useParams } from "react-router";
import { Dropdown } from "react-bootstrap";
import { DiffViewer } from "../components/DiffViewer";

export function Diff() {
  const [error, setError] = React.useState<string | null>(null);
  const [subjectSaves, setSubjectSaves] = React.useState<string[] | null>(null);
  const [oldSubject, setOldSubject] = React.useState<string>("");
  const [newSubject, setNewSubject] = React.useState<string>("");
  const { code } = useParams();
  useEffect(() => {
    //Load available diffs
    fetch(`http://api.${process.env.REACT_APP_BASE_URL}/subjects/saves/${code}`)
      .then((res) => res.json())
      .then((data) => {
        let subjects = data as SubjectSavesResponse;
        if (subjects.error) {
          console.error(subjects.error);
          setError(subjects.error);
        } else {
          if (subjects.data.states) {
            subjects.data.states.reverse();
            setSubjectSaves(subjects.data.states);
            setOldSubject(subjects.data.states[0]);
            setNewSubject(subjects.data.states[1] ?? subjects.data.states[0]);
          }
        }
      });
  }, [code]);

  if (!subjectSaves || !code) {
    return <div>Loading...</div>;
  } else {
    if (error) {
      return <div>{error}</div>;
    }
    return (
      <div className={"w-100"}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Dropdown>
            <Dropdown.Toggle
              className={"btn-sm m-3"}
              variant="success"
              id="dropdown-basic"
            >
              {newSubject}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {subjectSaves.map((subject) => {
                return (
                  <Dropdown.Item onClick={() => setNewSubject(subject)}>
                    {subject}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle
              className={"btn-sm m-3"}
              variant="success"
              id="dropdown-basic"
            >
              {oldSubject}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {subjectSaves.map((subject) => {
                return (
                  <Dropdown.Item onClick={() => setOldSubject(subject)}>
                    {subject}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <DiffViewer code={code} oldFile={oldSubject} newFile={newSubject} />
      </div>
    );
  }
}
