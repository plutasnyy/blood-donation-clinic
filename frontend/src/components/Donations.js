import React from 'react'
import 'semantic-ui-css/semantic.min.css';
import * as actions from "../actions/Request";
import {connect} from "react-redux";
import {Button, Grid, Form, Segment, Input, Table} from "semantic-ui-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ErrorMessage} from "./ErrorMessage";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {
    ADD_DONATION_SUCCESS,
    DELETE_DONATION_SUCCESS,
    FETCH_DEPARTURES,
    FETCH_DONATION, FETCH_PATIENTS, FETCH_PRESENCE,
    FETCH_WORKERS, GET_DATA_FAILED_DEPARTURE,
    GET_DATA_FAILED_DONATION, GET_DATA_FAILED_PATIENTS,
    GET_DATA_FAILED_PRESENCE,
    GET_DATA_FAILED_WORKER,
    GET_DATA_REQUESTED_DEPARTURE,
    GET_DATA_REQUESTED_DONATION, GET_DATA_REQUESTED_PATIENTS, GET_DATA_REQUESTED_PRESENCE,
    GET_DATA_REQUESTED_WORKER,
    UPDATE_DONATION_SUCCESS
} from "../ActionsTypes";

let apiUrl = 'donates/';

let initialState = {
    id: "",
    date: "",
    patientPesel: "",
    workerPesel: "",
    presenceId: "",
    inputType: "presence",
    peselError: false,
    isSelected: false,
};

class Donations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...initialState, search: ""};
        this.props.fetchAll();
        this.props.fetchWorkers();
        this.props.fetchDepartures();
        this.props.fetchPatients();
        this.props.fetchPresences();
    }

    editItem(item) {
        this.setState({
            isSelected: true,
            id: item.id,
            date: item.date,
            patientPesel: item.patient,
            workerPesel: item.worker,
            presenceId: item.presence,
        })
        if (item.presence == null) {
            this.handleDateWorker(item);
        } else {
            this.handlePresence(item);
        }
    }

    getPayload() {
        let dict = {
            "date": this.state.date,
            "patient": this.state.patientPesel,
            "worker": this.state.workerPesel,
            "presence": this.state.presenceId,
        };
        if (this.state.id !== "") {
            dict = {...dict, "id": this.state.id}
        }
        return dict;
    }

    isIdExist(id) {
        return this.props.items.filter(item => item.id === id).length > 0;
    }


    handleAdd() {
        if (this.validatePesel()) {
            this.props.addItem(this.getPayload());
        }
    }

    handleUpdate() {
        if (this.validatePesel()) {
            this.props.updateItem(this.getPayload());
        }
    }

    validateDate(date) {
        if (this.state.presenceId != "") {
            let p = this.props.presencesItems.filter(p => p.id == this.state.presenceId + '')[0]
            let d = this.props.departuresItems.filter(d => d.id == p.departure + '')[0]
            if (d.date != date) {
                this.setState({dateError: true})
            }
        }
        this.setState({dateError: false})
    }

    onChangeDate(d) {
        let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
        this.validateDate(date);
        this.setState({date: date});
    }

    resetState() {
        this.setState(initialState);
    }

    searchOnChange(e) {
        this.setState({search: e.target.value})
    }

    filterSearch(item) {
        let presenceString = item.presence == undefined ? "" : getPresenceFromId(item.presence, this.props.workersItems, this.props.departuresItems, this.props.presencesItems);
        let name = `${item.date} ${getWorkerFromId(item.patient, this.props.patientsItems)} ${getWorkerFromId(item.worker, this.props.workersItems)} ${presenceString}`;
        console.log(name);
        if (name.includes(this.state.search)) {
            return item;
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
        }
    }


    validatePesel() {
        console.log(this.state)
        if (this.state.patientPesel == this.state.workerPesel) {
            this.setState({peselError: true})
            return false
        } else {
            this.setState({peselError: false})
            return true
        }

    }

    handleDropdownChange(value, key) {
        this.setState({[key]: value});
    }

    handleDateWorker(e) {
        this.setState({inputType: "dateWorker", presenceId: ""})
    }

    handlePresence(e) {
        this.setState({inputType: "presence", date: "", workerPesel: ""})
    }

    render() {
        let formContent = "";
        if (this.state.inputType === "dateWorker") {
            formContent = <div>
                <strong>Date</strong> <br/>
                < DayPickerInput onDayChange={this.onChangeDate.bind(this)}
                                 value={this.state.date}/><br/><br/>
                <Form.Select fluid label='Worker' options={this.props.workersOptions}
                             placeholder='Worker' error={this.state.peselError}
                             onChange={(e, {value}) => this.handleDropdownChange(value, 'workerPesel')}
                             value={this.state.workerPesel} disable={this.state.presenceId}/><br/>
            </div>
        } else {
            formContent = <div>
                <Form.Select fluid label='Presence' options={this.props.presencesOptions}
                             placeholder='Presence'
                             onChange={(e, {value}) => this.handleDropdownChange(value, 'presenceId')}
                             value={this.state.presenceId}/><br/>
            </div>
        }
        return (
            <div>
                <Grid>
                    <Grid.Column width={6}>
                        <Segment>
                            <Form>
                                <Form.Input id='form-input-control-id' control={Input} label='Id'
                                            placeholder='Id' value={this.state.id} disabled error={this.state.idError}/>
                                <Form.Select fluid label='Patient' options={this.props.patientOptions}
                                             placeholder='Presence' error={this.state.peselError}
                                             onChange={(e, {value}) => this.handleDropdownChange(value, 'patientPesel')}
                                             value={this.state.patientPesel}/>
                                <Button.Group>
                                    <Button onClick={this.handleDateWorker.bind(this)} color={'teal'}>Date &
                                        Worker</Button>
                                    <Button.Or/>
                                    <Button onClick={this.handlePresence.bind(this)} color={'olive'}>Presence</Button>
                                </Button.Group><br/><br/>
                                {formContent}
                                <Button type='submit' onClick={this.handleAdd.bind(this)} color='green'
                                        disabled={!this.state.patientPesel || this.state.isSelected || !(this.state.date && this.state.workerPesel || this.state.presenceId)}>
                                    Add
                                </Button>
                                <Button type='submit' color='blue'
                                        disabled={!this.state.patientPesel || !this.state.isSelected || !(this.state.date && this.state.workerPesel || this.state.presenceId)}
                                        onClick={this.handleUpdate.bind(this)}>
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
                                    <Table.HeaderCell>Id</Table.HeaderCell>
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Patient</Table.HeaderCell>
                                    <Table.HeaderCell>Worker</Table.HeaderCell>
                                    <Table.HeaderCell>Presence</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.items.filter(item => this.filterSearch(item)).map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{item.id}</Table.Cell>
                                            <Table.Cell>{item.date}</Table.Cell>
                                            <Table.Cell>{getWorkerFromId(item.patient, this.props.patientsItems)}</Table.Cell>
                                            <Table.Cell>{getWorkerFromId(item.worker, this.props.workersItems)}</Table.Cell>
                                            <Table.Cell>{getPresenceFromId(item.presence, this.props.workersItems, this.props.departuresItems, this.props.presencesItems)}</Table.Cell>
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

function getWorkerFromId(id, workers) {
    let worker = workers.filter(worker => worker.pesel === (id + ''))[0];
    if (worker !== undefined) {
        return `${worker.first_name} ${worker.last_name}`
    } else {
        return id
    }
}

function getDepartureFromId(id, departures) {
    let departure = departures.filter(departure => departure.id == id + '')[0];
    if (departure !== undefined) {
        return `${departure.place} ${departure.date}`
    } else {
        return id;
    }
}

function getPresenceFromId(id, workers, departures, presences) {
    let presence = presences.filter(p => p.id == id + '')[0];
    if (presence !== undefined) {
        return getWorkerFromId(presence.worker, workers) + " " + getDepartureFromId(presence.departure, departures);
    } else {
        return presence;
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

const createPresencesOptions = (presences, workers, departures) => {
    return presences.map(function (presence) {
        return {
            key: presence.id,
            value: presence.id,
            text: getPresenceFromId(presence.id, workers, departures, presences),
        }
    })
};

const mapStateToProps = (state) => {
    return {
        workersOptions: createWorkersOptions(state.workersAPI.workers),
        workersItems: state.workersAPI.workers,
        patientOptions: createWorkersOptions(state.patientsAPI.patients),
        patientsItems: state.patientsAPI.patients,
        departuresOptions: createDeparturesOptions(state.departureAPI.departures),
        departuresItems: state.departureAPI.departures,
        presencesOptions: createPresencesOptions(state.presencesAPI.presences, state.workersAPI.workers, state.departureAPI.departures),
        presencesItems: state.presencesAPI.presences,
        items: state.donationsAPI.donations,
        isLoading: state.donationsAPI.isLoading,
        isError: state.donationsAPI.isError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAll: () => dispatch(actions.fetchAllItems(apiUrl, FETCH_DONATION, GET_DATA_REQUESTED_DONATION, GET_DATA_FAILED_DONATION)),
        fetchWorkers: () => dispatch(actions.fetchAllItems('workers/', FETCH_WORKERS, GET_DATA_REQUESTED_WORKER, GET_DATA_FAILED_WORKER)),
        fetchPatients: () => dispatch(actions.fetchAllItems('patients/', FETCH_PATIENTS, GET_DATA_REQUESTED_PATIENTS, GET_DATA_FAILED_PATIENTS)),
        fetchPresences: () => dispatch(actions.fetchAllItems('presences/', FETCH_PRESENCE, GET_DATA_REQUESTED_PRESENCE, GET_DATA_FAILED_PRESENCE)),
        fetchDepartures: () => dispatch(actions.fetchAllItems('departures/', FETCH_DEPARTURES, GET_DATA_REQUESTED_DEPARTURE, GET_DATA_FAILED_DEPARTURE)),
        addItem: payload => dispatch(actions.addItem(payload, apiUrl, ADD_DONATION_SUCCESS, GET_DATA_REQUESTED_DONATION, GET_DATA_FAILED_DONATION)),
        deleteItem: id => dispatch(actions.deleteItem(id, apiUrl, DELETE_DONATION_SUCCESS, GET_DATA_REQUESTED_DONATION, GET_DATA_FAILED_DONATION)),
        updateItem: payload => dispatch(actions.updateItem(payload, apiUrl, UPDATE_DONATION_SUCCESS, GET_DATA_REQUESTED_DONATION, GET_DATA_FAILED_DONATION))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Donations)
