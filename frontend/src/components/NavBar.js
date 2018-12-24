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
                    <Menu.Item name='/' active={activeItem === '/'} onClick={this.handleItemClick}>
                        <Link to="/">Home </Link>
                    </Menu.Item>
                    <Menu.Item name='/workers' active={activeItem === '/workers'} onClick={this.handleItemClick}>
                        <Link to="/workers">Workers</Link>
                    </Menu.Item>
                    <Menu.Item name='/departures' active={activeItem === '/departures'} onClick={this.handleItemClick}>
                        <Link to="/departures">Departures</Link>
                    </Menu.Item>
                    <Menu.Item name='/blood-types' active={activeItem === '/blood-types'} onClick={this.handleItemClick}>
                        <Link to="/blood-types">Blood Types</Link>
                    </Menu.Item>
                </Menu>
            </Segment>
        )
    }
}

const mapStateToProps = (state) => ({
    pathname: state.router.location.pathname
});

export default connect(mapStateToProps)(NavBar)
