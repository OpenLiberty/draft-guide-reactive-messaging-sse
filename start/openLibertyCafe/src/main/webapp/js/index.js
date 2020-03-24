function initSSE() {
    
}

function updateTable(order) {
    var orderRowNode = createTableRow(order);
    var orderRow = document.getElementById('order' + order.orderId);

    if (orderRow) {
        orderRow.replaceWith(orderRowNode);
    } else {
        document.getElementById('orderTableBody').appendChild(orderRowNode);
    }
}

function createTableRow(order) {
    var tableRow = document.createElement('tr');

    tableRow.id = 'order' + order.orderId;
    tableRow.innerHTML = 
        '<td>' + order.orderId + '</td>' +
        '<td>' + order.tableId + '</td>' +
        '<td>' + order.type + '</td>' +
        '<td>' + order.item + '</td>' +
        '<td>' + order.status + '</td>' +
        '<td>' + 
            '<button ' +
                'class=\"completeButton\"' +
                (order.status === 'READY' ? '' : 'disabled ') + 
                'onclick=\"completeOrder(\'' + order.orderId + '\')\"' + 
            '>Complete</button>' +
        '</td>';

    return tableRow;
}

function getPreviousOrders() {
    var request = new XMLHttpRequest();

    request.onload = function() {
        if (this.status === 200) {
            var orders = JSON.parse(this.response);

            orders.forEach(function(order) {
                updateTable(order);
            });
        }

        initSSE();
    };

    request.open('GET', '/api/status');
    request.send();
}

function completeOrder(orderId) {
    var request = new XMLHttpRequest();

    request.open('POST', '/api/servingWindow/' + orderId);
    request.send();
}

function sendOrderRequest(event) {
    event.preventDefault();

    var orderForm = document.getElementById('orderForm');

    var tableId = orderForm.elements.item(0).value;
    var foodList = orderForm.elements.item(1).value;
    var beverageList = orderForm.elements.item(2).value;

    var request = new XMLHttpRequest();

    request.onload = function() {
        if (this.status === 200) {
            document.getElementById('orderForm').reset();
        } else {
            var errors = JSON.parse(this.response);

            for (var i = 0; i < errors.length; i++) {
                toast(errors[i], i);
            }
        }
    };

    request.open('POST', '/api/orders');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({
        tableId: tableId,
        foodList: foodList ? 
                    foodList.split(',').map(function(food) { return food.trim(); }) :
                    [],
        beverageList: beverageList ?
                        beverageList.split(',').map(function(beverage) { return beverage.trim(); }) :
                        [],
    }));
}

function toast(message, index) {
    var length = 3000;
    var toast = document.getElementById('toast');

    setTimeout(function() {
        toast.innerText = message;
        toast.className = 'show'; 
    }, length * index);

    setTimeout(function() {
        toast.className = toast.className.replace('show', '');
    }, length + length * index);
}