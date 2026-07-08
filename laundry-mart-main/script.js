(function initEmail() {
    emailjs.init("yoSgKP4hnFsOkrbw2");
})();

var mySelections = {}; 
var subTotalValue = 0;
function toggleCart(serviceName, unitPrice, element) {
    if (mySelections[serviceName]) {
        
        delete mySelections[serviceName];
        
        element.textContent = 'Add';
        element.classList.remove('btn-minus');
        element.classList.add('btn-plus');
        
        popupAlert('🗑️ Removed: ' + serviceName);
    } else {
        
        mySelections[serviceName] = { price: unitPrice, qty: 1 };
        
        element.textContent = 'Remove';
        element.classList.remove('btn-plus');
        element.classList.add('btn-minus');
        
        popupAlert('✅ Added: ' + serviceName);
    }
    updateCartUI();
}

function updateCartUI() {
    var displayList = document.getElementById('cart-list');
    var totalSection = document.getElementById('cart-total');
    var taxSection = document.getElementById('cart-tax');
    
    displayList.innerHTML = '';
    subTotalValue = 0;
    var count = 0;

    for (var key in mySelections) {
        count++;
        var itemData = mySelections[key];
        var itemCost = itemData.price * itemData.qty;
        subTotalValue += itemCost;

        var listItem = document.createElement('li');
        listItem.className = 'cart-item';
        listItem.style.listStyle = 'none';
        
        listItem.innerHTML = 
            '<div class="cart-item-left">' +
                '<span>' + key + '</span>' +
                '<span style="font-size:0.8rem; color:#64748b;">Qty: 1 @ ₹' + itemData.price + '</span>' +
            '</div>' +
            '<span><strong>₹' + itemCost + '</strong></span>';
            
        displayList.appendChild(listItem);
    }

    //empty cart message
    if (count === 0) {
        displayList.innerHTML = '<li style="color:#94a3b8; text-align:center; padding:15px;">Your cart is empty.</li>';
        totalSection.style.display = 'none';
        taxSection.style.display = 'none';
    } else {
        var calculatedTax = (subTotalValue * 0.05).toFixed(2);
        
        document.getElementById('total-price').textContent = subTotalValue;
        document.getElementById('tax-price').textContent = calculatedTax;
        
        totalSection.style.display = 'block';
        taxSection.style.display = 'block';
    }
}


var bookingForm = document.getElementById('contact-form');
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var finalItems = [];
    for (var s in mySelections) {
        finalItems.push({
            service: s,
            rate: mySelections[s].price
        });
    }

    if (finalItems.length === 0) {
        popupAlert('⚠️ Pick a service before confirming!');
        return;
    }

    // Button
    var submitBtn = document.getElementById('book-btn');
    submitBtn.innerText = 'Processing...';
    submitBtn.disabled = true;

    var taxAmt = (subTotalValue * 0.05).toFixed(2);
    var totalWithTax = (subTotalValue + parseFloat(taxAmt)).toFixed(2);

    //data for EmailJS
    var dataPacket = {
        order_no: "ORD-" + Math.floor(Math.random() * 9999),
        from_name: document.getElementById('full_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('fphone').value,
        pickup_date: document.getElementById('fdate').value,
        pickup_time: document.getElementById('ftime').value,
        address: document.getElementById('faddress').value,
        order_summary: JSON.stringify(finalItems),
        tax: taxAmt,
        grand_total: totalWithTax
    };

    emailjs.send('service_ayo56wa', 'template_zh8ftj9', dataPacket)
        .then(function() {
            document.getElementById('thank-you-msg').style.display = 'block';
            bookingForm.reset();

            mySelections = {};
            updateCartUI();
            
            var allButtons = document.querySelectorAll('.add-remove-btn');
            allButtons.forEach(function(b) {
                b.textContent = 'Add';
                b.className = 'add-remove-btn btn-plus';
            });

            submitBtn.innerText = 'Confirm Order 🎉';
            submitBtn.disabled = false;
            
            popupAlert('Booking Successful!');
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, function(err) {
            console.log("Error details:", err);
            popupAlert('❌ Error sending request. Try again.');
            submitBtn.innerText = 'Confirm Order 🎉';
            submitBtn.disabled = false;
        });
});

// Newsletter
function subscribeNewsletter() {
    var n = document.getElementById('nl-name').value;
    var e = document.getElementById('nl-email').value;
    
    if(!n || !e) {
        popupAlert('Please fill both name and email.');
        return;
    }
    
    popupAlert('Thanks for joining, ' + n + '!');
    document.getElementById('nl-name').value = '';
    document.getElementById('nl-email').value = '';
}

function popupAlert(text) {
    var box = document.getElementById('toast');
    box.innerText = text;
    box.classList.add('show');
    
    setTimeout(function() {
        box.classList.remove('show');
    }, 3000);
}

(function setMinDate() {
    var datePicker = document.getElementById('fdate');
    if(datePicker) {
        var now = new Date();
        var yyyy = now.getFullYear();
        var mm = String(now.getMonth() + 1).padStart(2, '0');
        var dd = String(now.getDate()).padStart(2, '0');
        datePicker.min = yyyy + '-' + mm + '-' + dd;
    }
})();