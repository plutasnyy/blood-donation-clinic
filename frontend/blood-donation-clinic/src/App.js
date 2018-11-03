import React, {Component} from 'react';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom'
import {Dashboard} from "./components/Dashboard";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Route path="/" component={Dashboard}>
                </Route>
            </BrowserRouter>
        );
    }
}

export default App;
