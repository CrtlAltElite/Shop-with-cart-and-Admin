import React, { Component } from 'react'
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

export default class NavBar extends Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark" style={{marginBottom:"20px"}}>
                <Container>
                    <Navbar.Brand href="/">FakeShop</Navbar.Brand>
                    <Nav className="me-auto">
                        {this.props.token ? 
                        <>
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
                        <Nav.Link as={Link} to="/page2">Page2</Nav.Link>
                        <Nav.Link as={Link} to="/page3">Page3</Nav.Link>
                        <Nav.Link as={Link} to="/example">Example</Nav.Link>
                        <Nav.Link as={Link} to="/logout">Logout</Nav.Link>

                        {this.props.isAdmin?

                        <NavDropdown title="Admin Zone" id="navbarScrollingDropdown">
                            <NavDropdown.Item as={Link} to="/createcats">Create Category</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/editcats">Edit Category</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/createitems">Create Item</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/edititems">Edit Item</NavDropdown.Item>
                        </NavDropdown>
                        :''
                            }

                        </>
                        :
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        }
                    </Nav>
                    <span className="float-end">
                        <Link to="/cart" style={{color:'white',textDecoration:'none'}}><ShoppingCartIcon/>{this.props.getCartItemTotal()} ${this.props.getCartTotalPrice().toFixed(2)}</Link>
                    </span>
                </Container>
            </Navbar>
        )
    }
}
