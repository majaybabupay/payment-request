function buildPaymentRequest() {

    const supportedInstruments = [
    {
        supportedMethods: 'https://127.0.0.1:8080/pay3'
    }
];

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

    var request = new PaymentRequest(supportedInstruments, details);

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
