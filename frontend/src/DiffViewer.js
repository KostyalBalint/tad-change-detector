import React, { PureComponent } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

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
            "http://api.localhost/subjects/VIAUA007")
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