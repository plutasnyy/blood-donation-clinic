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
    ADD_TRANSFUSION_SUCCESS,
    DELETE_TRANSFUSION_SUCCESS, FETCH_BLOOD_TYPES, FETCH_DONATION,
    FETCH_PATIENTS, FETCH_SAMPLE,
    FETCH_TRANSFUSION, FETCH_WORKERS, GET_DATA_FAILED_BLOOD, GET_DATA_FAILED_DONATION,
    GET_DATA_FAILED_PATIENTS, GET_DATA_FAILED_SAMPLE,
    GET_DATA_FAILED_TRANSFUSION, GET_DATA_FAILED_WORKER, GET_DATA_REQUESTED_BLOOD, GET_DATA_REQUESTED_DONATION,
    GET_DATA_REQUESTED_PATIENTS, GET_DATA_REQUESTED_SAMPLE,
    GET_DATA_REQUESTED_TRANSFUSION, GET_DATA_REQUESTED_WORKER,
    UPDATE_TRANSFUSION_SUCCESS
} from "../ActionsTypes";
import {updateSample} from "../actions/Samples";

let apiUrl = 'transfusions/';

let initialState = {
    id: "",
    date: "",
    workerPesel: "",
    patientPesel: "",
    sampleId: "",
    idError: false,
    dateError: false,
    patientPeselError: false,
    workerPeselError: false,
    sampleIdError: false,
    isSelected: false,
};

class Transfusions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...initialState, search: ""};
        this.props.fetchAll();
        this.props.fetchPatients();
        this.props.fetchWorkers();
        this.props.fetchBlood();
        this.props.fetchBloodDonations();
        this.props.fetchSamples();
    }

    editItem(item) {
        console.log(item)
        this.setState({
            isSelected: true,
            id: item.id,
            date: item.date,
            workerPesel: item.worker,
            patientPesel: item.patient,
            sampleId: item.sample,
        })
    }

    getPayload() {
        let dict = {
            "date": this.state.date,
            "sample": this.state.sampleId,
            "worker": this.state.workerPesel,
            "patient": this.state.patientPesel,
        };
        if (this.state.id !== "") {
            dict = {...dict, "id": this.state.id}
        }
        return dict;
    }

    validateBlood() {
        let patient = this.props.patientsItems.filter(p => p.pesel === this.state.patientPesel + '')[0]
        let patientBlood = this.props.bloodItems.filter(b => b.id === patient.blood)[0]
        let sample = this.props.samplesItems.filter(b => b.id === this.state.sampleId)[0]
        let sampleBlood = this.props.bloodItems.filter(b => b.id === sample.blood)[0]


        if (patientBlood.blood === 'AB' && patientBlood.rh === '+') {
            return true;
        }
        if (patientBlood.blood === 'AB' && patientBlood.rh === '-' && sampleBlood.rh === '-') {
            return true;
        }
        if (sampleBlood.blood === '0' && sampleBlood.rh === '-') {
            return true;
        }
        if (sampleBlood.blood === '0' && sampleBlood.rh === '+' && patientBlood.rh === '+') {
            return true;
        }
        if (patientBlood.blood === 'A' && patientBlood.rh === '+' && sampleBlood.blood === 'A') {
            return true;
        }
        if (patientBlood.blood === 'A' && patientBlood.rh === '-' && sampleBlood.blood === 'A' && sampleBlood.rh === '-') {
            return true;
        }
        if (patientBlood.blood === 'B' && patientBlood.rh === '+' && sampleBlood.blood === 'B') {
            return true;
        }
        if (patientBlood.blood === 'B' && patientBlood.rh === '-' && sampleBlood.blood === 'B' && sampleBlood.rh === '-') {
            return true;
        }
        return false;
    }

    validateDate() {
        let date = this.state.date
        let sample = this.props.samplesItems.filter(sample => sample.id === this.state.sampleId)[0];
        let donation = this.props.donationItems.filter(d => d.id === sample.donate_blood)[0];

        function compare_dates(sample_date, date) {
            var x = sample_date.split('-')
            var y = date.split('-')
            var i;
            for (i = 0; i < 3; i++) {
                if (parseInt(x[i]) > parseInt(y[i])) {
                    return true;
                } else if (parseInt(x[i]) < parseInt(y[i])) {
                    return false;
                }
            }
            return false;
        }

        if (donation !== undefined) {
            let sample_date = donation.date;
            console.log(sample_date, date)
            if (compare_dates(sample_date, date)) {
                this.setState({dateError: true})
                return false
            } else {
                this.setState({dateError: false})
            }
        }
        return true
    }

    validatePesel() {
        if (this.state.patientPesel == this.state.workerPesel) {
            this.setState({patientPeselError: true, workerPeselError: true})
            return false
        } else {
            this.setState({patientPeselError: false, workerPeselError: false})
            return true
        }

    }

    handleDropdownChange(value, key) {
        this.setState({[key]: value});
    }

    handleAdd() {
        if (this.validateDate() && this.validateBlood() && this.validatePesel()) {
            this.props.addItem(this.getPayload());
            let transfusion = this.getPayload();
            let sample = this.props.samplesItems.filter(sample => sample.id === transfusion.sample)[0];
            sample.is_available = false;
            this.props.updateSample(sample);
        }
    }

    handleUpdate() {
        if (this.validateDate() && this.validateDate() && this.validatePesel()) {
            this.props.updateItem(this.getPayload());
        }
    }

    handleDelete(transfusionId) {
        this.props.deleteItem(transfusionId);
        let transfusion = this.props.items.filter(trans => trans.id === transfusionId)[0];
        let sample = this.props.samplesItems.filter(sample => sample.id === transfusion.sample)[0];
        sample.is_available = true;
        this.props.updateSample(sample);

    }

    onChangeDate(d) {
        let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        this.setState({date: date});
    }

    resetState() {
        this.setState(initialState);
    }

    searchOnChange(e) {
        this.setState({search: e.target.value})
    }

    filterSearch(item) {
        let name = `${item.id} ${getPatientFromId(item.patient, this.props.patientsItems, this.props.bloodItems)} ${getWorkerFromId(item.worker, this.props.workersItems)} ${getSampleNameFromId(item.sample, this.props.samplesItems, this.props.bloodItems)}`;
        console.log(name)
        if (name.includes(this.state.search)) {
            return item;
        }
    }

    onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
        }
    }

    render() {
        let sampleForm = ""
        if (!this.state.isSelected) {
            sampleForm = <Form.Select fluid label='Sample' options={this.props.samplesOptions}
                                      placeholder='Sample' error={this.state.dateError}
                                      onChange={(e, {value}) => this.handleDropdownChange(value, 'sampleId')}
                                      value={this.state.sampleId}/>
        }
        return (
            <div>
                <Grid>
                    <Grid.Column width={6}>
                        <Segment>
                            <Form>
                                <Form.Input id='form-input-control-id' control={Input} label='Id'
                                            placeholder='Id' value={this.state.id} disabled error={this.state.idError}/>
                                <strong>Date</strong> <br/>
                                <DayPickerInput onDayChange={this.onChangeDate.bind(this)}
                                                value={this.state.date}/><br/><br/>
                                <Form.Select fluid label='Worker' options={this.props.workersOptions}
                                             placeholder='Worker' error={this.state.workerPeselError}
                                             onChange={(e, {value}) => this.handleDropdownChange(value, 'workerPesel')}
                                             value={this.state.workerPesel}/>
                                <Form.Select fluid label='Patient' options={this.props.patientOptions}
                                             placeholder='Patient' error={this.state.patientPeselError}
                                             onChange={(e, {value}) => this.handleDropdownChange(value, 'patientPesel')}
                                             value={this.state.patientPesel}/>
                                {sampleForm}
                                <Button type='submit' onClick={this.handleAdd.bind(this)} color='green'
                                        disabled={!this.state.workerPesel || !this.state.patientPesel || this.state.sampleIdError || !this.state.sampleId || this.state.isSelected}>
                                    Add
                                </Button>
                                <Button type='submit' color='blue' onClick={this.handleUpdate.bind(this)}
                                        disabled={!this.state.workerPesel || !this.state.patientPesel || this.state.sampleIdError || !this.state.sampleId || !this.state.isSelected}>
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
                                    <Table.HeaderCell>Patient</Table.HeaderCell>
                                    <Table.HeaderCell>Worker</Table.HeaderCell>
                                    <Table.HeaderCell>Sample</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.items.filter(item => this.filterSearch(item)).map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{item.id}</Table.Cell>
                                            <Table.Cell>{item.date}</Table.Cell>
                                            <Table.Cell>{getPatientFromId(item.patient, this.props.patientsItems, this.props.bloodItems)}</Table.Cell>
                                            <Table.Cell>{getWorkerFromId(item.worker, this.props.workersItems)}</Table.Cell>
                                            <Table.Cell>{getSampleNameFromId(item.sample, this.props.samplesItems, this.props.bloodItems)}</Table.Cell>
                                            <Table.Cell>
                                                <Button color='blue' onClick={() => this.editItem(item)}>
                                                    Edit
                                                </Button>
                                                <Button color='red' onClick={() => this.handleDelete(item.id)}>
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

function getBloodNameFromId(b, bloodItems) {
    let bloodItem = bloodItems.filter(blood => blood.id === b)[0];
    if (bloodItem !== undefined) {
        return `${bloodItem.blood} Rh${bloodItem.rh}`
    } else {
        return b
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

function getPatientFromId(id, patients, bloods) {
    let patient = patients.filter(patient => patient.pesel === (id + ''))[0];
    if (patient !== undefined) {
        return `${patient.first_name} ${patient.last_name} ${getBloodNameFromId(patient.blood, bloods)}`
    } else {
        return id
    }
}

const createWorkersOptions = (workers) => {
    return workers.map(function (worker) {
        return {
            key: worker.pesel,
            value: worker.pesel,
            text: `${getWorkerFromId(worker.pesel, workers)}`,
        }
    });
};

const createPatientsOptions = (patients, bloods) => {
    return patients.map(function (patient) {
        return {
            key: patient.pesel,
            value: patient.pesel,
            text: `${getPatientFromId(patient.pesel, patients, bloods)}`,
        }
    });
};

function getSampleNameFromId(id, samples, bloods) {
    let sample = samples.filter(sample => sample.id === id)[0];
    if (sample !== undefined) {
        return `${sample.size} ${getBloodNameFromId(sample.blood, bloods)}`
    } else {
        return id
    }
}

const createSamplesOptions = (samples, bloods, donates) => {
    return samples.filter(sample => sample.is_available === true).map(function (sample) {
        let donate = donates.filter(d => d.id === sample.donate_blood)[0];
        let date = "";
        if (donate !== undefined) {
            date = donate.date
        }
        return {
            key: sample.id,
            value: sample.id,
            text: getSampleNameFromId(sample.id, samples, bloods) + " " + date,
        }
    })
}

const mapStateToProps = (state) => {
    return {
        samplesItems: state.samplesAPI.samples,
        samplesOptions: createSamplesOptions(state.samplesAPI.samples, state.bloodTypesAPI.bloodTypes, state.donationsAPI.donations),
        bloodItems: state.bloodTypesAPI.bloodTypes,
        donationItems: state.donationsAPI.donations,
        workersOptions: createWorkersOptions(state.workersAPI.workers),
        workersItems: state.workersAPI.workers,
        patientOptions: createPatientsOptions(state.patientsAPI.patients, state.bloodTypesAPI.bloodTypes),
        patientsItems: state.patientsAPI.patients,
        items: state.transfusionsAPI.transfusions,
        isLoading: state.transfusionsAPI.isLoading,
        isError: state.transfusionsAPI.isError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchWorkers: () => dispatch(actions.fetchAllItems('workers/', FETCH_WORKERS, GET_DATA_REQUESTED_WORKER, GET_DATA_FAILED_WORKER)),
        fetchPatients: () => dispatch(actions.fetchAllItems('patients/', FETCH_PATIENTS, GET_DATA_REQUESTED_PATIENTS, GET_DATA_FAILED_PATIENTS)),
        fetchBlood: () => dispatch(actions.fetchAllItems('blood/', FETCH_BLOOD_TYPES, GET_DATA_REQUESTED_BLOOD, GET_DATA_FAILED_BLOOD)),
        fetchSamples: () => dispatch(actions.fetchAllItems('samples/', FETCH_SAMPLE, GET_DATA_REQUESTED_SAMPLE, GET_DATA_FAILED_SAMPLE)),
        fetchBloodDonations: () => dispatch(actions.fetchAllItems('/donates', FETCH_DONATION, GET_DATA_REQUESTED_DONATION, GET_DATA_FAILED_DONATION)),
        fetchAll: () => dispatch(actions.fetchAllItems(apiUrl, FETCH_TRANSFUSION, GET_DATA_REQUESTED_TRANSFUSION, GET_DATA_FAILED_TRANSFUSION)),
        addItem: payload => dispatch(actions.addItem(payload, apiUrl, ADD_TRANSFUSION_SUCCESS, GET_DATA_REQUESTED_TRANSFUSION, GET_DATA_FAILED_TRANSFUSION)),
        deleteItem: id => dispatch(actions.deleteItem(id, apiUrl, DELETE_TRANSFUSION_SUCCESS, GET_DATA_REQUESTED_TRANSFUSION, GET_DATA_FAILED_TRANSFUSION)),
        updateItem: payload => dispatch(actions.updateItem(payload, apiUrl, UPDATE_TRANSFUSION_SUCCESS, GET_DATA_REQUESTED_TRANSFUSION, GET_DATA_FAILED_TRANSFUSION)),
        updateSample: sample => dispatch(updateSample(sample))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Transfusions)
