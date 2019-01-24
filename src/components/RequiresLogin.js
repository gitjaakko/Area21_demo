import React, { Component } from 'react';
import { connect } from 'react-redux';

export default connect(state => ({user: state.user}))((props) => {
    if (props.user.isAuthenticated) {
        return props.children;
    }
    return null;
});
