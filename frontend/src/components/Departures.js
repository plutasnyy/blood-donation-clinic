import React from 'react'
import 'semantic-ui-css/semantic.min.css';
import * as actions from "../actions/Request";
import {
    ADD_DEPARTURE_SUCCESS,
    DELETE_DEPARTURE_SUCCESS,
    FETCH_DEPARTURES,
    GET_DATA_FAILED_DEPARTURE,
    GET_DATA_REQUESTED_DEPARTURE,
    UPDATE_DEPARTURE_SUCCESS
} from "../ActionsTypes";
import {connect} from "react-redux";
import {Button, Grid, Form, Segment, Input, Table} from "semantic-ui-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ErrorMessage} from "./ErrorMessage";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

let apiUrl = 'departures/';

let initialState = {
    id: "",
    date: "",
    place: "",
    idError: false,
    dateError: false,
    placeError: false,
    isSelected: false,
};

class Departures extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...initialState, search: ""};
        this.props.fetchAll();
    }

    editItem(item) {
        this.setState({
            isSelected: true,
            id: item.id,
            date: item.date,
            place: item.place,
        })
    }

    getPayload() {
        let dict = {
            "date": this.state.date,
            "place": this.state.place,
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

    validatePlace(place) {
        if (place.length > 30) {
            this.setState({placeError: true});
        } else {
            this.setState({placeError: false});
        }
    }

    handleAdd() {
        this.validateId();
        this.props.addItem(this.getPayload());
    }

    handleUpdate() {
        this.props.updateItem(this.getPayload());
    }

    onChangePlace(e) {
        this.setState({place: e.target.value});
        this.validatePlace(e.target.value)
    }

    onChangeDate(d) {
        let date =  `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
        this.setState({date: date});
    }

    resetState() {
        this.setState(initialState);
    }

    searchOnChange(e) {
        this.setState({search: e.target.value})
    }

    filterSearch(item) {
        let name = `${item.date} ${item.place}`;
        if (item.date.includes(this.state.search) || item.place.includes(this.state.search) || name.includes(this.state.search)) {
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
                                <strong>Date</strong>   <br/>
                                <DayPickerInput onDayChange={this.onChangeDate.bind(this)} /><br/><br/>
                                <Form.Input id='form-input-control-place' control={Input} label='Place' placeholder='Place'
                                            value={this.state.place} onChange={this.onChangePlace.bind(this)}
                                            error={this.state.placeError}/>
                                <Button type='submit' onClick={this.handleAdd.bind(this)} color='green'
                                        disabled={!this.state.place || !this.state.date || this.state.isSelected}>
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
                                    <Table.HeaderCell>Date</Table.HeaderCell>
                                    <Table.HeaderCell>Place</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.items.filter(item => this.filterSearch(item)).map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{item.id}</Table.Cell>
                                            <Table.Cell>{item.date}</Table.Cell>
                                            <Table.Cell>{item.place}</Table.Cell>
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

const mapStateToProps = (state) => {
    return {
        items: state.departureAPI.departures,
        isLoading: state.departureAPI.isLoading,
        isError: state.departureAPI.isError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAll: () => dispatch(actions.fetchAllItems(apiUrl, FETCH_DEPARTURES, GET_DATA_REQUESTED_DEPARTURE, GET_DATA_FAILED_DEPARTURE)),
        addItem: payload => dispatch(actions.addItem(payload, apiUrl, ADD_DEPARTURE_SUCCESS, GET_DATA_REQUESTED_DEPARTURE, GET_DATA_FAILED_DEPARTURE)),
        deleteItem: id => dispatch(actions.deleteItem(id, apiUrl, DELETE_DEPARTURE_SUCCESS, GET_DATA_REQUESTED_DEPARTURE, GET_DATA_FAILED_DEPARTURE)),
        updateItem: payload => dispatch(actions.updateItem(payload, apiUrl, UPDATE_DEPARTURE_SUCCESS, GET_DATA_REQUESTED_DEPARTURE, GET_DATA_FAILED_DEPARTURE))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Departures)
