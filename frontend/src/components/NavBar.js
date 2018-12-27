import React from 'react'
import {Link} from 'react-router-dom'
import {Menu, Segment} from "semantic-ui-react";
import {connect} from "react-redux";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {activeItem: this.props.pathname};
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick(e, {name}) {
        this.setState({activeItem: name});
    }

    render() {
        const {activeItem} = this.state;
        return (
            <Segment inverted>
                <Menu inverted secondary>
                    <Link to="/">
                        <Menu.Item name='/' active={activeItem === '/'} onClick={this.handleItemClick}>
                            Home
                        </Menu.Item>
                    </Link>
                    <Link to="/workers">
                        <Menu.Item name='/workers' active={activeItem === '/workers'} onClick={this.handleItemClick}>
                            Workers
                        </Menu.Item>
                    </Link>
                    <Link to="/departures">
                        <Menu.Item name='/departures' active={activeItem === '/departures'}
                                   onClick={this.handleItemClick}>
                            Departures
                        </Menu.Item>
                    </Link>
                    <Link to="/blood-types">
                        <Menu.Item name='/blood-types' active={activeItem === '/blood-types'}
                                   onClick={this.handleItemClick}>
                            Blood Types
                        </Menu.Item>
                    </Link>
                    <Link to="/patients">
                        <Menu.Item name='/patients' active={activeItem === '/patients'}
                                   onClick={this.handleItemClick}>
                            Patients
                        </Menu.Item>
                    </Link>
                </Menu>
            </Segment>
        )
    }
}

const mapStateToProps = (state) => ({
    pathname: state.router.location.pathname
});

export default connect(mapStateToProps)(NavBar)
