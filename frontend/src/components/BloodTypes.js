import React from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions/Request';
import {Button, Grid, Form, Segment, Input, Table} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ErrorMessage} from './ErrorMessage';
import {
    ADD_BLOOD_TYPE_SUCCESS,
    DELETE_BLOOD_TYPE_SUCCESS,
    FETCH_BLOOD_TYPES,
    GET_DATA_FAILED_BLOOD,
    GET_DATA_REQUESTED_BLOOD,
    UPDATE_BLOOD_TYPE_SUCCESS
} from "../ActionsTypes";

let initialState = {
    id: "",
    blood: "",
    rh: "",
    idError: false,
    bloodError: false,
    rhError: false,
    isSelected: false,
};

let apiUrl = 'blood/';

class BloodTypes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...initialState, search: ""};
        this.props.fetchAllBloodTypes();
    }

    editBlood(blood) {
        this.setState({
            isSelected: true,
            id: blood.id,
            blood: blood.blood,
            rh: blood.rh,
        })
    }

    getPayload() {
        let dict = {
            "blood": this.state.blood,
            "rh": this.state.rh,
        };
        if (this.state.id !== "") {
            dict = {...dict, "id": this.state.id}
        }
        return dict;
    }

    isIdExist(id) {
        return this.props.bloodTypes.filter(blood => blood.id === id).length > 0;
    }

    validateId() {
        if (this.isIdExist(this.state.id)) {
            this.setState({idError: true})
        }
    }

    validateBlood(blood) {
        if (blood.length > 2) {
            this.setState({bloodError: true});
        } else {
            this.setState({bloodError: false});
        }
    }

    validateRh(rh) {
        if (rh.length > 1) {
            this.setState({rhError: true});
        } else {
            this.setState({rhError: false});
        }
    }

    handleAdd() {
        this.validateId();
        this.props.addBloodType(this.getPayload());
    }

    handleUpdate() {
        this.props.updateBloodType(this.getPayload());
    }

    onChangeBlood(e) {
        this.setState({blood: e.target.value});
        this.validateBlood(e.target.value)
    }

    onChangeRh(e) {
        this.setState({rh: e.target.value});
        this.validateRh(e.target.value)
    }

    resetState() {
        this.setState(initialState);
    }

    searchOnChange(e) {
        this.setState({search: e.target.value})
    }

    filterSearch(item) {
        let name = `${item.blood} Rh${item.rh}`;
        if (item.blood.includes(this.state.search) || item.rh.includes(this.state.search) || name.includes(this.state.search)) {
            return item;
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
                                <Form.Input id='form-input-control-id' control={Input} label='Id'
                                            placeholder='Id' value={this.state.id} disabled error={this.state.idError}/>
                                <Form.Input id='form-input-control-blood' control={Input} label='Blood'
                                            placeholder='Blood'
                                            value={this.state.blood} onChange={this.onChangeBlood.bind(this)}
                                            error={this.state.bloodError}/>
                                <Form.Input id='form-input-control-rh' control={Input} label='Rh' placeholder='Rh'
                                            value={this.state.rh} onChange={this.onChangeRh.bind(this)}
                                            error={this.state.rhError}/>
                                <Button type='submit' onClick={this.handleAdd.bind(this)} color='green'
                                        disabled={!this.state.blood || !this.state.rh || this.state.isSelected}>
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
                                    <Table.HeaderCell>Blood</Table.HeaderCell>
                                    <Table.HeaderCell>Rh</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.bloodTypes.filter(blood => this.filterSearch(blood)).map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{item.id}</Table.Cell>
                                            <Table.Cell>{item.blood}</Table.Cell>
                                            <Table.Cell>{item.rh}</Table.Cell>
                                            <Table.Cell>
                                                <Button color='blue' onClick={() => this.editBlood(item)}>
                                                    Edit
                                                </Button>
                                                <Button color='red' onClick={() => this.props.deleteBloodType(item.id)}>
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
        bloodTypes: state.bloodTypesAPI.bloodTypes,
        isLoading: state.bloodTypesAPI.isLoading,
        isError: state.bloodTypesAPI.isError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBloodTypes: () => dispatch(actions.fetchAllItems(apiUrl, FETCH_BLOOD_TYPES, GET_DATA_REQUESTED_BLOOD, GET_DATA_FAILED_BLOOD)),
        addBloodType: payload => dispatch(actions.addItem(payload, apiUrl, ADD_BLOOD_TYPE_SUCCESS, GET_DATA_REQUESTED_BLOOD, GET_DATA_FAILED_BLOOD)),
        deleteBloodType: id => dispatch(actions.deleteItem(id, apiUrl, DELETE_BLOOD_TYPE_SUCCESS, GET_DATA_REQUESTED_BLOOD, GET_DATA_FAILED_BLOOD)),
        updateBloodType: payload => dispatch(actions.updateItem(payload, apiUrl, UPDATE_BLOOD_TYPE_SUCCESS, GET_DATA_REQUESTED_BLOOD, GET_DATA_FAILED_BLOOD))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(BloodTypes)
