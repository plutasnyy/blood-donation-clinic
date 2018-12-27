import React from 'react'
import {Route, Switch} from 'react-router'
import Home from '../components/Home'
import Workers from '../components/Workers'
import NoMatch from '../components/NoMatch'
import NavBar from '../components/NavBar'
import {Segment} from "semantic-ui-react";
import BloodType from "../components/BloodTypes";
import Departures from "../components/Departures";
import Patients from "../components/Patients";

const routes = (
    <div>
        <Segment>
            <NavBar/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/workers" component={Workers}/>
                <Route path="/departures" component={Departures}/>
                <Route path="/blood-types" component={BloodType}/>
                <Route path="/patients" component={Patients}/>
                <Route component={NoMatch}/>
            </Switch>
        </Segment>
    </div>
)

export default routes
