import React from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions/WorkersActions';

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
                {workers.map((item, index) => {
                    return (<div key={index}>
                        {item.pesel + item.first_name + item.last_name}
                    </div>);
                })}
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
