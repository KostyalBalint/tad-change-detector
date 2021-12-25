import React, { PureComponent } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

const oldCode = `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`;
const newCode = `
const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`;

export class DiffViewer extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            subject: undefined,
            newSubject: undefined,
            isLoaded: false
        };
    }

    componentDidMount() {
        fetch(
            "http://localhost:8080/subjects/VIAUA007")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    subject: json.subject,
                    newSubject: json.newSubject,
                    isLoaded: true
                });
                console.log(this.state)
            })
    }
    render = () => {
            if(this.state.isLoaded){
                return (<ReactDiffViewer oldValue={this.state.subject.htmlDataFields} newValue={this.state.newSubject.htmlDataFields} splitView={false} />)
            }
            else{
                return (<div>Loading...</div>)
            }
    };
}