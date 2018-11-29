import React from 'react'
import {Link} from 'react-router-dom'
import {Menu, Segment} from "semantic-ui-react";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {activeItem: 'home'}
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
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}><Link
                        to="/">Home </Link></Menu.Item>
                    <Menu.Item
                        name='messages'
                        active={activeItem === 'messages'}
                        onClick={this.handleItemClick}
                    ><Link to="/hello">Hello </Link></Menu.Item>
                    <Menu.Item
                        name='friends'
                        active={activeItem === 'friends'}
                        onClick={this.handleItemClick}
                    >
                        <Link to="/workers">Workers</Link></Menu.Item>
                </Menu>
            </Segment>
        )
    }
}

export default NavBar
