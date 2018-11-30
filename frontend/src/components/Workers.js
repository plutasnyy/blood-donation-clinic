import React from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions/Workers';
import {Button, Icon, Grid, Form, Segment, Input, Menu, Table, Message} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

var initialState = {
    pesel: "",
    firstName: "",
    lastName: "",
    position: "",
    peselError: false,
    firstNameError: false,
    lastNameError: false,
    positionError: false,
    isSelected: false
}

class Workers extends React.Component {

    constructor(props) {
        super(props)
        this.state = {...initialState, search: ""}
        this.props.fetchAllWorkers();
        this.isPeselExist = this.isPeselExist.bind(this);
        this.editWorker = this.editWorker.bind(this);
        this.getPayload = this.getPayload.bind(this);
        this.filterSearchWork = this.filterSearchWork.bind(this);
    }

    editWorker(worker) {
        this.setState({
            isSelected: true,
            pesel: worker.pesel,
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
            "pesel": this.state.pesel,
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "position": this.state.position,
        }
    }

    handleAdd() {
        if (!/^\d+$/.test(this.state.pesel) || this.isPeselExist(this.state.pesel)) {
            this.setState({peselError: true})
        } else {
            this.setState({peselError:false})
            this.props.addWorker(this.getPayload());
        }
    }

    handleUpdate() {
        this.props.updateWorker(this.getPayload());
    }

    onChangePesel(e) {
        this.setState({pesel: e.target.value});
    }

    onChangeFirstName(e) {
        this.setState({firstName: e.target.value});
    }

    onChangeLastName(e) {
        this.setState({lastName: e.target.value});
    }

    onChangePosition(e) {
        this.setState({position: e.target.value});
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
                                <Button type='submit' onClick={this.handleAdd.bind(this)} color='green'
                                        disabled={!(this.state.pesel.length === 11) || !this.state.firstName || !this.state.lastName || !this.state.position}>
                                    Add
                                </Button>
                                <Button type='submit' color='blue' onClick={this.handleUpdate.bind(this)}>
                                    Update
                                </Button>
                                <Button onClick={this.resetState.bind(this)}
                                        disabled={!(this.state.pesel.length === 11) || !this.state.firstName || !this.state.lastName || !this.state.position}>
                                    <FontAwesomeIcon icon="redo"/>
                                </Button>
                            </Form>
                        </Segment>
                    </Grid.Column>


                    <Grid.Column width={10}>
                        {this.props.isError == true ?
                            <Message
                                error
                                header='You are trying to do something forbidden.'
                                list={['Find if it is not a foreign key for other object']}
                            />
                            : null}

                        <Segment> <Input onChange={this.searchOnChange.bind(this)} placeholder='Search...'/></Segment>

                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Pesel</Table.HeaderCell>
                                    <Table.HeaderCell>First Name</Table.HeaderCell>
                                    <Table.HeaderCell>Last Name</Table.HeaderCell>
                                    <Table.HeaderCell>Position</Table.HeaderCell>
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
        fetchAllWorkers: () => dispatch(actions.fetchAllWorkers()),
        addWorker: payload => dispatch(actions.addWorker(payload)),
        deleteWorker: id => dispatch(actions.deleteWorker(id)),
        updateWorker: payload => dispatch(actions.updateWorker(payload))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Workers)
