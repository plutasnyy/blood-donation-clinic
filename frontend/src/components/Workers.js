import React from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions/Request';
import {Button, Grid, Form, Segment, Input, Table, Message} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ErrorMessage} from "./ErrorMessage";
import {
    ADD_WORKER_SUCCESS,
    DELETE_WORKER_SUCCESS,
    FETCH_WORKERS, GET_DATA_FAILED_WORKER,
    GET_DATA_REQUESTED_WORKER,
    UPDATE_WORKER_SUCCESS
} from "../ActionsTypes";

let initialState = {
    pesel: "",
    firstName: "",
    lastName: "",
    salary: "",
    position: "",
    peselError: false,
    firstNameError: false,
    lastNameError: false,
    positionError: false,
    salaryError: false,
    isSelected: false,
};

let apiUrl = 'workers/';

class Workers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...initialState, search: ""};
        this.props.fetchAllWorkers();
    }

    editWorker(worker) {
        this.setState({
            isSelected: true,
            pesel: worker.pesel,
            salary: worker.salary,
            firstName: worker.first_name,
            lastName: worker.last_name,
            position: worker.position,
        })
    }

    isPeselExist(pesel) {
        return this.props.workers.filter(worker => worker.pesel === pesel).length > 0;
    }

    getPayload() {
        return {
            "id": this.state.pesel,
            "pesel": this.state.pesel,
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "position": this.state.position,
            "salary": this.state.salary,
        }
    }

    static isNumber(n) {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    }

    validateFirstName(name) {
        if (name.length > 30) {
            this.setState({firstNameError: true})
        } else {
            this.setState({firstNameError: false})
        }
    }

    validateLastName(name) {
        if (name.length > 30) {
            this.setState({lastNameError: true})
        } else {
            this.setState({lastNameError: false})
        }
    }

    validatePosition(position) {
        if (position.length > 30) {
            this.setState({positionError: true})
        } else {
            this.setState({positionError: false})
        }
    }

    validatePesel(pesel) {
        if (!Workers.isNumber(pesel) || this.isPeselExist(pesel) || pesel.length !== 11) {
            this.setState({peselError: true});
            return false;
        } else {
            this.setState({peselError: false});
            return true;
        }
    }

    validateSalary(salary) {
        if (Workers.isNumber(salary) && salary >= 0) {
            this.setState({salaryError: false});
        } else {
            this.setState({salaryError: true});
        }
    }

    handleAdd() {
        if (this.validatePesel(this.state.pesel)) {
            this.props.addWorker(this.getPayload());
        }
    }

    handleUpdate() {
        this.props.updateWorker(this.getPayload());
    }

    onChangePesel(e) {
        this.setState({pesel: e.target.value});
        this.validatePesel(e.target.value);
    }

    onChangeSalary(e) {
        this.setState({salary: e.target.value});
        this.validateSalary(e.target.value);
    }

    onChangeFirstName(e) {
        this.setState({firstName: e.target.value});
        this.validateFirstName(e.target.value)
    }

    onChangeLastName(e) {
        this.setState({lastName: e.target.value});
        this.validateLastName(e.target.value)
    }

    onChangePosition(e) {
        this.setState({position: e.target.value});
        this.validatePosition(e.target.value)
    }

    resetState() {
        this.setState(initialState);
    }

    searchOnChange(e) {
        this.setState({search: e.target.value})
    }

    filterSearchWork(worker) {
        let name = worker.first_name + " " + worker.last_name;
        if (worker.pesel.includes(this.state.search) || name.includes(this.state.search)) {
            return worker;
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
        }
    }

    render() {
        return (
            <div>
                <Grid>
                    <Grid.Column width={6}>
                        <Segment>
                            <Form>
                                <Form.Input id='form-input-control-pesel' control={Input} label='Pesel'
                                            placeholder='Pesel'
                                            value={this.state.pesel} onChange={this.onChangePesel.bind(this)}
                                            error={this.state.peselError}
                                            disabled={this.state.isSelected}/>
                                <Form.Input id='form-input-control-first-name' control={Input} label='First name'
                                            placeholder='First name'
                                            value={this.state.firstName} onChange={this.onChangeFirstName.bind(this)}
                                            error={this.state.firstNameError}/>
                                <Form.Input id='form-input-control-last-name' control={Input} label='Last name'
                                            placeholder='Last name'
                                            value={this.state.lastName} onChange={this.onChangeLastName.bind(this)}
                                            error={this.state.lastNameError}/>
                                <Form.Input id='form-input-control-position' control={Input} label='Position'
                                            placeholder='Position'
                                            value={this.state.position} onChange={this.onChangePosition.bind(this)}
                                            error={this.state.positionError}/>
                                <Form.Input id='form-input-control-salary' control={Input} label='Salary'
                                            placeholder='Salary'
                                            value={this.state.salary} onChange={this.onChangeSalary.bind(this)}
                                            error={this.state.salaryError}/>
                                <Button type='submit' onClick={this.handleAdd.bind(this)} color='green'
                                        disabled={this.state.peselError || !this.state.firstName || !this.state.lastName
                                        || !this.state.position || !this.state.salary || this.state.salaryError || this.state.isSelected}>
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
                        <Segment> <Input onChange={this.searchOnChange.bind(this)} placeholder='Search...'/></Segment>

                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Pesel</Table.HeaderCell>
                                    <Table.HeaderCell>First Name</Table.HeaderCell>
                                    <Table.HeaderCell>Last Name</Table.HeaderCell>
                                    <Table.HeaderCell>Position</Table.HeaderCell>
                                    <Table.HeaderCell>Salary</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.workers.filter(worker => this.filterSearchWork(worker)).map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{item.pesel}</Table.Cell>
                                            <Table.Cell>{item.first_name}</Table.Cell>
                                            <Table.Cell>{item.last_name}</Table.Cell>
                                            <Table.Cell>{item.position}</Table.Cell>
                                            <Table.Cell>{item.salary}</Table.Cell>
                                            <Table.Cell>
                                                <Button color='blue' onClick={() => this.editWorker(item)}>
                                                    Edit
                                                </Button>
                                                <Button color='red' onClick={() => this.props.deleteWorker(item.pesel)}>
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

const mapStateToProps = (state) => {
    return {
        workers: state.workersAPI.workers,
        isLoading: state.workersAPI.isLoading,
        isError: state.workersAPI.isError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllWorkers: () => dispatch(actions.fetchAllItems(apiUrl,FETCH_WORKERS, GET_DATA_REQUESTED_WORKER, GET_DATA_FAILED_WORKER)),
        addWorker: payload => dispatch(actions.addItem(payload,apiUrl, ADD_WORKER_SUCCESS, GET_DATA_REQUESTED_WORKER, GET_DATA_FAILED_WORKER)),
        deleteWorker: id => dispatch(actions.deleteItem(id,apiUrl, DELETE_WORKER_SUCCESS, GET_DATA_REQUESTED_WORKER, GET_DATA_FAILED_WORKER)),
        updateWorker: payload => dispatch(actions.updateItem(payload,apiUrl, UPDATE_WORKER_SUCCESS, GET_DATA_REQUESTED_WORKER, GET_DATA_FAILED_WORKER))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Workers)
