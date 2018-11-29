import React from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions/WorkersActions';
import {Button, Icon, Grid, Form, Segment, Input, Menu, Table} from 'semantic-ui-react'

class Workers extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log(this.props);
        this.props.fetchAllWorkers();
        console.log(this.props);
    }

    render() {
        const {isLoading, isError, workers} = this.props.workersAPI;
        return (
            <div>
                <Grid>
                    <Grid.Column width={6}>
                        <Segment>
                            <Form>
                                <Form.Group widths='equal'>
                                    <Form.Field
                                        id='form-input-control-pesel'
                                        control={Input}
                                        label='Pesel'
                                        placeholder='Pesel'
                                    />
                                    <Form.Field
                                        id='form-input-control-position'
                                        control={Input}
                                        label='Position'
                                        placeholder='Position'
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field
                                        id='form-input-control-first-name'
                                        control={Input}
                                        label='First name'
                                        placeholder='First name'
                                    />
                                    <Form.Field
                                        id='form-input-control-last-name'
                                        control={Input}
                                        label='Last name'
                                        placeholder='Last name'
                                    />
                                </Form.Group>
                                <Button> Add </Button>
                                <Button> Update </Button>
                            </Form>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Pesel</Table.HeaderCell>
                                    <Table.HeaderCell>First Name</Table.HeaderCell>
                                    <Table.HeaderCell>Last Name</Table.HeaderCell>
                                    <Table.HeaderCell>Position</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {workers.map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>{item.pesel}</Table.Cell>
                                            <Table.Cell>{item.first_name}</Table.Cell>
                                            <Table.Cell>{item.last_name}</Table.Cell>
                                            <Table.Cell>{item.position}</Table.Cell>
                                            <Table.Cell>
                                                <Button>Update</Button>
                                                <Button>Delete</Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>

                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='5'>
                                        <Menu floated='right' pagination>
                                            <Menu.Item as='a' icon>
                                                <Icon name='chevron left'/>
                                            </Menu.Item>
                                            <Menu.Item as='a'>1</Menu.Item>
                                            <Menu.Item as='a'>2</Menu.Item>
                                            <Menu.Item as='a'>3</Menu.Item>
                                            <Menu.Item as='a'>4</Menu.Item>
                                            <Menu.Item as='a' icon>
                                                <Icon name='chevron right'/>
                                            </Menu.Item>
                                        </Menu>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Grid.Column>
                </Grid>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllWorkers: () => dispatch(actions.fetchAllWorkers())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Workers)
