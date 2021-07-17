import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from './Input';
// import Button from '../../components/UI/Button/Button';
import { Button } from '@material-ui/core';
// import Spinner from '../../components/UI/Spinner/Spinner';
import './Auth.css';
import * as actions from '../store/actions';
import { updateObject, checkValidity } from '../store/utility';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: true,
        submit: false
    }

    componentDidMount() {
        // console.log(classes.Auth);
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangedHandler = (event, controlName) => {
        // console.log(event.target.value)
        // console.log(controlName)
        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            })
        });
        this.setState({ controls: updatedControls });
    }

    submitHandler = (event) => {
        event.preventDefault();
        console.log(this.state.controls);
        this.setState({ submit: true })
        // this.props.onAuth( this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup );
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup };
        });
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        )
        );

        if (this.props.loading) {
            // form = <Spinner />
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            // authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        console.log(this.props)
        return (
            <div className="Auth">
                <h3>Welcome to our quiz App</h3>
                <h5>Register yourself or Sign in to proceed!</h5>
                {/* {authRedirect} */}
                {this.state.submit ? <Redirect to="/quiz" /> : null}
                {/* {errorMessage} */}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button color="primary" variant="contained" type="submit">SUBMIT</Button>
                </form>
                <Button
                    variant={this.state.isSignup ? "contained" : "outlined"}
                    color="secondary"
                    onClick={this.switchAuthModeHandler}
                    style={{ margin: '2%' }}>SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.onAuth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.onSetAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
// export default Auth;