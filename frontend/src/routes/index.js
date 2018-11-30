import React from 'react'
import { Route, Switch } from 'react-router'
import Home from '../components/Home'
import Hello from '../components/Hello'
import Workers from '../components/Workers'
import NoMatch from '../components/NoMatch'
import NavBar from '../components/NavBar'
import {Segment} from "semantic-ui-react";

const routes = (
  <div>
      <Segment>
    <NavBar />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/hello" component={Hello} />
      <Route path="/workers" component={Workers} />
      <Route component={NoMatch} />
    </Switch>
      </Segment>
  </div>
)

export default routes
