import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import './TopMenu.scss';
import AuthService from "../../services/AuthService";
import {useNavigate} from "react-router-dom";

const TopMenu = () => {

    const navigate = useNavigate();
    const logout = () => {
        AuthService.logout();
        navigate('/');
        // Если делать logout со страницы settings => ошибка (красный запрос и белая страница)
        window.location.reload(false);
    }

    return (
        <Navbar className='menu-top'>
            <Nav>
                <Nav.Link href='/'>
                    Converter
                </Nav.Link>
                <Nav.Link href='/currencies'>
                    Currencies
                </Nav.Link>
                {AuthService.getCurrentUser() && (
                    // Есть возможность попасть на страницу с настройками даже незарегистрированному пользователю, что приводит сразу к ошибке
                    <Nav.Link href='/settings'>
                        Settings
                    </Nav.Link>
                )}
                {!AuthService.getCurrentUser() && (
                    <Nav.Link href='/signup'>
                        Sign up
                    </Nav.Link>
                )}
                {!AuthService.getCurrentUser() && (
                    <Nav.Link href='/login'>
                        Login
                    </Nav.Link>
                )}
                {AuthService.getCurrentUser() && (
                    <Nav.Link href='#' onClick={logout}>
                        Logout ({AuthService.getCurrentUser().username})
                    </Nav.Link>
                )}
            </Nav>
        </Navbar>
    );
};

export default TopMenu;