import React, { Component } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';

import BillingRedirect from './billingRedirect';


class UpgradeWorkspaceWrapper extends Component {
    constructor(props) {
      super(props);
      this.state = {stripe: null};
    }
    componentDidMount() {
      // console.log('check is tis mount');
      // if (window.Stripe) {
      //   this.setState({stripe: window.Stripe('pk_test_7DWsNfRZHFrZOX88f87lWrzj')});
      // } else {
      //   document.querySelector('#stripe-js').addEventListener('load', () => {
      //     // Create Stripe instance once Stripe.js loads
      //     this.setState({stripe: window.Stripe('pk_test_7DWsNfRZHFrZOX88f87lWrzj')});
      //   });
      // }

      
    }


    render() {
      // this.state.stripe will either be null or a Stripe instance
      // depending on whether Stripe.js has loaded.
      return (
        <StripeProvider apiKey={process.env.REACT_APP_STRIPE_TOKEN}>
          <Elements>
            <BillingRedirect />
          </Elements>
        </StripeProvider>
      );
    }
}

export default UpgradeWorkspaceWrapper;
