import React from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions/Request';
import {Grid, Table} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import {FETCH_RESOURCES, GET_DATA_FAILED_RESOURCES, GET_DATA_REQUESTED_RESOURCES} from "../ActionsTypes";

let apiUrl = 'resources/';

class Resources extends React.Component {

    constructor(props) {
        super(props);
        this.props.fetchAll();
    }

    render() {
        return (
            <div>
                <Grid>
                    <Grid.Column width={16}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Id</Table.HeaderCell>
                                    <Table.HeaderCell>Blood Type</Table.HeaderCell>
                                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.workers.filter(worker => this.filterSearchWork(worker)).map((item, index) => {
                                    console.log(item)
                                    return (
                                        <Table.Row key={index}>
                                            {/*<Table.Cell>{item.pesel}</Table.Cell>*/}
                                            {/*<Table.Cell>{item.first_name}</Table.Cell>*/}
                                            {/*<Table.Cell>{item.last_name}</Table.Cell>*/}
                                            {/*<Table.Cell>{item.position}</Table.Cell>*/}
                                            {/*<Table.Cell>{item.salary}</Table.Cell>*/}
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
        resources: state.resourcesAPI.resources,
        isLoading: state.resourcesAPI.isLoading,
        isError: state.resourcesAPI.isError
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAll: () => dispatch(actions.fetchAllItems(apiUrl,FETCH_RESOURCES, GET_DATA_REQUESTED_RESOURCES, GET_DATA_FAILED_RESOURCES)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Resources)
