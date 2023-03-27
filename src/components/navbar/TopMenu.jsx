import React from 'react';
import {Navbar, Nav} from 'react-bootstrap'
import './TopMenu.scss'

const TopMenu = () => {

    return (
        <Navbar className='menu-top'>
            <Nav>
                <Nav.Link href='/'>
                    Converter
                </Nav.Link>
                <Nav.Link href='/currencies'>
                    Currencies
                </Nav.Link>
            </Nav>
        </Navbar>
    );
};

export default TopMenu;