import React from 'react'
import 'semantic-ui-css/semantic.min.css';
import * as actions from "../actions/Request";
import {
    ADD_DEPARTURE_SUCCESS, ADD_PRESENCE_SUCCESS,
    DELETE_DEPARTURE_SUCCESS, DELETE_PRESENCE_SUCCESS,
    FETCH_DEPARTURES, FETCH_PRESENCE, FETCH_WORKERS,
    GET_DATA_FAILED_DEPARTURE, GET_DATA_FAILED_PRESENCE, GET_DATA_FAILED_WORKER,
    GET_DATA_REQUESTED_DEPARTURE, GET_DATA_REQUESTED_PRESENCE, GET_DATA_REQUESTED_WORKER,
    UPDATE_DEPARTURE_SUCCESS, UPDATE_PRESENCE_SUCCESS
} from "../ActionsTypes";
import {connect} from "react-redux";
import {Button, Grid, Form, Segment, Input, Table} from "semantic-ui-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ErrorMessage} from "./ErrorMessage";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

let apiUrl = 'presences/';

let initialState = {
    id: "",
    workerId: "",
    departureId: "",
    isSelected: false,
};

class Presences extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...initialState, search: ""};
        this.props.fetchAll();
        this.props.fetchWorkers();
        this.props.fetchDepartures();
    }

    editItem(item) {
        this.setState({
            isSelected: true,
            id: item.id,
            workerId: item.worker,
            departureId: item.departure,
        })
    }

    getPayload() {
        let dict = {
            "worker": this.state.workerId,
            "departure": this.state.departureId,
        };
        if (this.state.id !== "") {
            dict = {...dict, "id": this.state.id}
        }
        return dict;
    }

    isIdExist(id) {
        return this.props.items.filter(item => item.id === id).length > 0;
    }

    validateId() {
        if (this.isIdExist(this.state.id)) {
            this.setState({idError: true})
        }
    }

    handleAdd() {
        this.validateId();
        this.props.addItem(this.getPayload());
    }

    handleUpdate() {
        this.props.updateItem(this.getPayload());
    }

    handleDropdownChange(value, key) {
        this.setState({[key]: value});
    }

    resetState() {
        this.setState(initialState);
    }

    searchOnChange(e) {
        this.setState({search: e.target.value})
    }

    filterSearch(item) {
        let name = this.getWorkerFromId(item.worker) + " " + this.getDepartureFromId(item.departure);
        if (name.includes(this.state.search)) {
            return item;
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
        }
    }

    getWorkerFromId(id) {
        let worker = this.props.workersItems.filter(worker => worker.pesel === id)[0];
        if (worker !== undefined) {
            return `${worker.first_name} ${worker.last_name}`
        } else {
            return id
        }
    }

    getDepartureFromId(id){
        let departure = this.props.departuresItems.filter(departure=>departure.id===id)[0];
        if(departure!==undefined){
            return `${departure.place} ${departure.date}`
        } else {
            return id;
        }
    }
    render() {
        return (
            <div>
                <Grid>
                    <Grid.Column width={6}>
                        <Segment>
                            <Form>
                                <Form.Input id='form-input-control-id' control={Input} label='Id'
                                            placeholder='Id' value={this.state.id} disabled error={this.state.idError}/>

                                <Form.Select fluid label='Worker' options={this.props.workersOptions} placeholder='Worker'
                                             onChange={(e, {value}) => this.handleDropdownChange(value, 'workerId')}
                                             value={this.state.workerId}/>
                                <Form.Select fluid label='Departure' options={this.props.departuresOptions} placeholder='Departure'
                                             onChange={(e, {value}) => this.handleDropdownChange(value, 'departureId')}
                                             value={this.state.departureId}/>
                                <Button type='submit' onClick={this.handleAdd.bind(this)} color='green'
                                        disabled={!this.state.workerId || !this.state.departureId || this.state.isSelected}>
                                    Add
                                </Button>
                                <Button type='submit' color='blue' onClick={this.handleUpdate.bind(this)}>
                                    Update
                                </Button>
                                <Button onClick={this.resetState.bind(this)}>
                                    <FontAwesomeIcon icon="redo"/>
                                </Button>
                            </Form>
                        </Segment>
                    </Grid.Column>


                    <Grid.Column width={10}>
                        <ErrorMessage error={this.props.isError}/>
                        <Segment> <Input onChange={this.searchOnChange.bind(this)}
                                         placeholder='Search...'/></Segment>

                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>id</Table.HeaderCell>
                                    <Table.HeaderCell>Worker</Table.HeaderCell>
                                    <Table.HeaderCell>Departure</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.items.filter(item => this.filterSearch(item)).map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{item.id}</Table.Cell>
                                            <Table.Cell>{this.getWorkerFromId(item.worker)}</Table.Cell>
                                            <Table.Cell>{this.getDepartureFromId(item.departure)}</Table.Cell>
                                            <Table.Cell>
                                                <Button color='blue' onClick={() => this.editItem(item)}>
                                                    Edit
                                                </Button>
                                                <Button color='red' onClick={() => this.props.deleteItem(item.id)}>
                                                    Delete
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

const createWorkersOptions = (workers) => {
    return workers.map(function (worker) {
        return {
            key: worker.pesel,
            value: worker.pesel,
            text: `${worker.first_name} ${worker.last_name}`,
        }
    });
};

const createDeparturesOptions = (departures) => {
    return departures.map(function (departure) {
        return {
            key: departure.id,
            value: departure.id,
            text: `${departure.place} ${departure.date}`,
        }
    });
};

const mapStateToProps = (state) => {
    return {
        workersOptions: createWorkersOptions(state.workersAPI.workers),
        workersItems: state.workersAPI.workers,
        departuresOptions: createDeparturesOptions(state.departureAPI.departures),
        departuresItems: state.departureAPI.departures,
        items: state.presencesAPI.presences,
        isLoading: state.presencesAPI.isLoading,
        isError: state.presencesAPI.isError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAll: () => dispatch(actions.fetchAllItems(apiUrl, FETCH_PRESENCE, GET_DATA_REQUESTED_PRESENCE, GET_DATA_FAILED_PRESENCE)),
        fetchWorkers: () => dispatch(actions.fetchAllItems('workers/', FETCH_WORKERS, GET_DATA_REQUESTED_WORKER, GET_DATA_FAILED_WORKER)),
        fetchDepartures: () => dispatch(actions.fetchAllItems('departures/', FETCH_DEPARTURES, GET_DATA_REQUESTED_DEPARTURE, GET_DATA_FAILED_DEPARTURE)),
        addItem: payload => dispatch(actions.addItem(payload, apiUrl, ADD_PRESENCE_SUCCESS, GET_DATA_REQUESTED_PRESENCE, GET_DATA_FAILED_PRESENCE)),
        deleteItem: id => dispatch(actions.deleteItem(id, apiUrl, DELETE_PRESENCE_SUCCESS, GET_DATA_REQUESTED_PRESENCE, GET_DATA_FAILED_PRESENCE)),
        updateItem: payload => dispatch(actions.updateItem(payload, apiUrl, UPDATE_PRESENCE_SUCCESS, GET_DATA_REQUESTED_PRESENCE, GET_DATA_FAILED_PRESENCE))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Presences)
