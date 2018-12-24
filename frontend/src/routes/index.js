import React from 'react'
import {Route, Switch} from 'react-router'
import Home from '../components/Home'
import Workers from '../components/Workers'
import NoMatch from '../components/NoMatch'
import NavBar from '../components/NavBar'
import {Segment} from "semantic-ui-react";
import BloodType from "../components/BloodTypes";

const routes = (
    <div>
        <Segment>
            <NavBar/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/workers" component={Workers}/>
                <Route path="/blood-types" component={BloodType}/>
                <Route component={NoMatch}/>
            </Switch>
        </Segment>
    </div>
)

export default routes
