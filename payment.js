function buildPaymentRequest() {

    const supportedInstruments = [
    {
        supportedMethods: 'https://pacific-garden-30467.herokuapp.com/pay3',
        data: {
            threeDS: true
        },
    }
];

    const options = {requestShipping: true};

    const details = {
        total: {
            label: 'Donation',
            amount: {
                currency: 'USD',
                value: '55.00',
            },
        },
        displayItems: [{
            label: 'Original donation amount',
            amount: {
                currency: 'USD',
                value: '65.00',
            },
        }, {
            label: 'Friends and family discount',
            amount: {
                currency: 'USD',
                value: '-10.00',
            },
        }],
    };

    var request = new PaymentRequest(supportedInstruments, details, options);

    if (request.canMakePayment) {
        request.canMakePayment().then(result => {
            if (result) {
                console.log('Payment methods are available.')
            } else {
                console.log('Payment methods are not available, but users can still add')
        }
    }).catch(error => {
            console.log('Unable to determine.')
    });
    }

    request.addEventListener('shippingaddresschange', function(evt) {
        evt.updateWith(new Promise(function(resolve) {
            updateDetails(details, request.shippingAddress, resolve);
        }));
    });

    return request;
}


function buy(request){

    request.show().then(result => {
        console.log('result is ' + JSON.stringify(result.toJSON()));
    setTimeout(function(){result.complete('success');}, 1000);

});
}

window.addEventListener('load', function(evt) {

    makePayment();

});


function makePayment(){
    if (!window.PaymentRequest) {
        console.log('PaymentRequest API is not supported.');
        return;
    }
    try {
        let request = buildPaymentRequest();

        document.getElementById("btn").addEventListener("click", function () {
            buy(request)
        });

    } catch (e) {
        console.log('Developer mistake: \'' + e.message + '\'');
        request = buildPaymentRequest();
    }
}

function updateDetails(details, shippingAddress, callback) {
    let shippingOption = {
        id: '',
        label: '',
        amount: {currency: 'USD', value: '0.00'},
        selected: true,
        pending: false,
    };

    if (shippingAddress.country === 'US') {
        if (shippingAddress.region === 'CA') {
            shippingOption.id = 'californiaFreeShipping';
            shippingOption.label = 'Free shipping in California';
            details.total.amount.value = '60.00';
        } else {
            shippingOption.id = 'unitedStatesStandardShipping';
            shippingOption.label = 'Standard shipping in US';
            shippingOption.amount.value = '5.00';
            details.total.amount.value = '58.00';
        }
        details.shippingOptions = [shippingOption];
        delete details.error;
    } else {
        // Don't ship outside of US for the purposes of this example.
        shippingOption.label = 'Shipping';
        shippingOption.pending = true;
        details.total.amount.value = '55.00';
        details.error = 'Cannot ship outside of US.';
        delete details.shippingOptions;
    }

    details.displayItems.splice(1, 1, shippingOption);
    callback(details);

}
