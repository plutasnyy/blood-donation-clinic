import React from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions/Request';
import {Button, Grid, Form, Segment, Input, Table, Message} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ErrorMessage} from "./ErrorMessage";
import {
    ADD_PATIENTS_SUCCESS,
    DELETE_PATIENTS_SUCCESS, FETCH_BLOOD_TYPES,
    FETCH_PATIENTS, GET_DATA_FAILED_BLOOD,
    GET_DATA_FAILED_PATIENTS, GET_DATA_REQUESTED_BLOOD, GET_DATA_REQUESTED_PATIENTS,
    UPDATE_PATIENTS_SUCCESS,
} from "../ActionsTypes";
import BloodTypes from "./BloodTypes";

let initialState = {
    pesel: "",
    firstName: "",
    lastName: "",
    bloodId: "3",
    peselError: false,
    firstNameError: false,
    lastNameError: false,
    bloodIdError: false,
    isSelected: false,
};

let apiUrl = 'patients/';

class Patients extends React.Component {

    constructor(props) {
        super(props);
        this.props.fetchAll();
        this.props.fetchBlood();
        this.state = {...initialState, search: ""};
    }

    editItem(patient) {
        this.setState({
            isSelected: true,
            pesel: patient.pesel,
            firstName: patient.first_name,
            lastName: patient.last_name,
            bloodId: patient.blood,
        })
    }

    isPeselExist(pesel) {
        return this.props.patients.filter(patient => patient.pesel === pesel).length > 0;
    }

    getPayload() {
        return {
            "id": this.state.pesel,
            "pesel": this.state.pesel,
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "blood": this.state.bloodId,
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

    validatePesel(pesel) {
        if (!Patients.isNumber(pesel) || this.isPeselExist(pesel) || pesel.length !== 11) {
            this.setState({peselError: true});
            return false;
        } else {
            this.setState({peselError: false});
            return true;
        }
    }

    handleAdd() {
        if (this.validatePesel(this.state.pesel)) {
            this.props.addItem(this.getPayload());
        }
    }

    handleUpdate() {
        this.props.updateItem(this.getPayload());
    }

    onChangePesel(e) {
        this.setState({pesel: e.target.value});
        this.validatePesel(e.target.value);
    }

    onChangeFirstName(e) {
        this.setState({firstName: e.target.value});
        this.validateFirstName(e.target.value)
    }

    onChangeLastName(e) {
        this.setState({lastName: e.target.value});
        this.validateLastName(e.target.value)
    }

    resetState() {
        this.setState(initialState);
    }

    searchOnChange(e) {
        this.setState({search: e.target.value})
    }

    handleDropdownChange(value, key) {
        this.setState({[key]: value});
    }

    filterSearchWork(patient) {
        let name = patient.first_name + " " + patient.last_name + " " + this.getBloodNameFromId(patient.blood);
        if (patient.pesel.includes(this.state.search) || name.includes(this.state.search)) {
            return patient;
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
        }
    }

    getBloodNameFromId(b) {
        let bloodItem = this.props.bloodItems.filter(blood => blood.id === b)[0];
        if (bloodItem !== undefined) {
            return `${bloodItem.blood} Rh${bloodItem.rh}`
        } else {
            return b
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
                                <Form.Select fluid label='Blood' options={this.props.bloodOptions} placeholder='Blood'
                                             onChange={(e, {value}) => this.handleDropdownChange(value, 'bloodId')}
                                             value={this.state.bloodId}/>
                                <Button type='submit' onClick={this.handleAdd.bind(this)} color='green'
                                        disabled={this.state.peselError || !this.state.firstName || !this.state.lastName
                                        || !this.state.bloodId || this.state.isSelected}>
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
                                    <Table.HeaderCell>Blood</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.patients.filter(patient => this.filterSearchWork(patient)).map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{item.pesel}</Table.Cell>
                                            <Table.Cell>{item.first_name}</Table.Cell>
                                            <Table.Cell>{item.last_name}</Table.Cell>
                                            <Table.Cell>{this.getBloodNameFromId(item.blood)}</Table.Cell>
                                            <Table.Cell>
                                                <Button color='blue' onClick={() => this.editItem(item)}>
                                                    Edit
                                                </Button>
                                                <Button color='red' onClick={() => this.props.deleteItem(item.pesel)}>
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

const createBloodOptions = (bloodTypes) => {
    return bloodTypes.map(function (blood) {
        return {
            key: blood.id,
            value: blood.id,
            text: `${blood.blood} Rh${blood.rh}`,
        }
    });
};

const mapStateToProps = (state) => {
    return {
        bloodOptions: createBloodOptions(state.bloodTypesAPI.bloodTypes),
        bloodItems: state.bloodTypesAPI.bloodTypes,
        patients: state.patientsAPI.patients,
        isLoading: state.patientsAPI.isLoading,
        isError: state.patientsAPI.isError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAll: () => dispatch(actions.fetchAllItems(apiUrl, FETCH_PATIENTS, GET_DATA_REQUESTED_PATIENTS, GET_DATA_FAILED_PATIENTS)),
        fetchBlood: () => dispatch(actions.fetchAllItems('blood/', FETCH_BLOOD_TYPES, GET_DATA_REQUESTED_BLOOD, GET_DATA_FAILED_BLOOD)),
        addItem: payload => dispatch(actions.addItem(payload, apiUrl, ADD_PATIENTS_SUCCESS, GET_DATA_REQUESTED_PATIENTS, GET_DATA_FAILED_PATIENTS)),
        deleteItem: id => dispatch(actions.deleteItem(id, apiUrl, DELETE_PATIENTS_SUCCESS, GET_DATA_REQUESTED_PATIENTS, GET_DATA_FAILED_PATIENTS)),
        updateItem: payload => dispatch(actions.updateItem(payload, apiUrl, UPDATE_PATIENTS_SUCCESS, GET_DATA_REQUESTED_PATIENTS, GET_DATA_FAILED_PATIENTS))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Patients)
