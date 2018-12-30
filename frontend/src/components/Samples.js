import React from 'react'
import 'semantic-ui-css/semantic.min.css';
import * as actions from "../actions/Request";
import {connect} from "react-redux";
import {Button, Grid, Form, Segment, Input, Table} from "semantic-ui-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ErrorMessage} from "./ErrorMessage";
import {
    ADD_SAMPLE_SUCCESS,
    DELETE_SAMPLE_SUCCESS, FETCH_DONATION,
    FETCH_SAMPLE, GET_DATA_FAILED_DONATION, GET_DATA_FAILED_SAMPLE, GET_DATA_REQUESTED_DONATION,
    GET_DATA_REQUESTED_SAMPLE,
    UPDATE_SAMPLE_SUCCESS
} from "../ActionsTypes";

let apiUrl = 'samples/';

let initialState = {
    id: "",
    size: "",
    bloodDonationId: "",
    sizeError: false,
    isSelected: false,
};

class Samples extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...initialState, search: ""};
        this.props.fetchAll();
        this.props.fetchBloodDonations();
    }

    editItem(item) {
        this.setState({
            isSelected: true,
            id: item.id,
            bloodDonationId: item.donate_blood,
        })
        if (item.presence == null) {
            this.handleDateWorker(item);
        } else {
            this.handlePresence(item);
        }
    }

    getPayload() {
        let dict = {
            "size": this.state.size,
            "donate_blood": this.state.bloodDonationId,
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

    resetState() {
        this.setState(initialState);
    }

    searchOnChange(e) {
        this.setState({search: e.target.value})
    }

    filterSearch(item) {
        let name = `${item.id} ${item.donate_blood}`;
        if (name.includes(this.state.search)) {
            return item;
        }
    }
    validateSize(size) {
        if (Samples.isNumber(size) && size >= 1 && size <=500) {
            this.setState({sizeError: false});
        } else {
            this.setState({sizeError: true});
        }
    }

    static isNumber(n) {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
        }
    }

    handleDropdownChange(value, key) {
        this.setState({[key]: value});
    }

    onChangeSize(e) {
        this.setState({size: e.target.value});
        this.validateSize(e.target.value);
    }

    handleDateWorker(e) {
        this.setState({inputType: "dateWorker", presenceId: ""})
    }

    handlePresence(e) {
        this.setState({inputType: "presence", date: "", workerPesel: ""})
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
                                <Form.Input id='form-input-control-size' control={Input} label='Size'
                                            placeholder='Size'
                                            value={this.state.size} onChange={this.onChangeSize.bind(this)}
                                            error={this.state.sizeError}/>
                                <Form.Select fluid label='Donation' options={this.props.bloodDonationsOptions}
                                             placeholder='Blood Donation'
                                             onChange={(e, {value}) => this.handleDropdownChange(value, 'bloodDonationId')}
                                             value={this.state.bloodDonationId}/><br/>
                                <Button type='submit' onClick={this.handleAdd.bind(this)} color='green'
                                        disabled={!this.state.bloodDonationId || !this.state.size || this.state.sizeError || this.state.isSelected}>
                                    Add
                                </Button>
                                <Button type='submit' color='blue' onClick={this.handleUpdate.bind(this)}
                                        disabled={!this.state.bloodDonationId || !this.state.size || this.state.sizeError || !this.state.isSelected}>
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
                                    <Table.HeaderCell>Size</Table.HeaderCell>
                                    <Table.HeaderCell>Blood Donation</Table.HeaderCell>
                                    <Table.HeaderCell>Blood Type</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.items.filter(item => this.filterSearch(item)).map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{item.id}</Table.Cell>
                                            <Table.Cell>{item.size}</Table.Cell>
                                            <Table.Cell>{item.donate_blood}</Table.Cell>
                                            <Table.Cell>{item.blood}</Table.Cell>
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

const createDonatesOptions = (donations) => {
    return donations.map(function (donation) {
        return {
            key: donation.id,
            value: donation.id,
            text: `${donation.id} ${donation.date} ${donation.patient}`,
        }
    });
};


const mapStateToProps = (state) => {
    return {
        bloodDonationsOptions: createDonatesOptions(state.donationsAPI.donations),
        bloodDonationsItems: state.donationsAPI.donations,
        items: state.samplesAPI.samples,
        isLoading: state.samplesAPI.isLoading,
        isError: state.samplesAPI.isError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAll: () => dispatch(actions.fetchAllItems(apiUrl, FETCH_SAMPLE, GET_DATA_REQUESTED_SAMPLE, GET_DATA_FAILED_SAMPLE)),
        fetchBloodDonations: () => dispatch(actions.fetchAllItems('/donates', FETCH_DONATION, GET_DATA_REQUESTED_DONATION, GET_DATA_FAILED_DONATION)),
        addItem: payload => dispatch(actions.addItem(payload, apiUrl, ADD_SAMPLE_SUCCESS, GET_DATA_REQUESTED_SAMPLE, GET_DATA_FAILED_SAMPLE)),
        deleteItem: id => dispatch(actions.deleteItem(id, apiUrl, DELETE_SAMPLE_SUCCESS, GET_DATA_REQUESTED_SAMPLE, GET_DATA_FAILED_SAMPLE)),
        updateItem: payload => dispatch(actions.updateItem(payload, apiUrl, UPDATE_SAMPLE_SUCCESS, GET_DATA_REQUESTED_SAMPLE, GET_DATA_FAILED_SAMPLE))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Samples)
