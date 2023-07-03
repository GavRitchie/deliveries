// Defines the function for scheduling deliveries
function scheduleDeliveries(deliveries, availableVehicles) {
    var scheduledDeliveries = [];
    var prioritizedDeliveries = prioritizeDeliveries(deliveries);
    var deliveriesOnHold = [];
    for (var _i = 0, prioritizedDeliveries_1 = prioritizedDeliveries; _i < prioritizedDeliveries_1.length; _i++) {
        var delivery = prioritizedDeliveries_1[_i];
        var beginAt = {
            plane: 0,
            truck: 0,
        };
        var deliveryLeg = delivery.deliveryLegs[0];
        var vehicleType = deliveryLeg.vehicleType;
        var usableVehicle = getVehicle(availableVehicles, vehicleType);
        if (usableVehicle === undefined) {
            deliveriesOnHold.push(delivery);
            continue;
        }
        else {
            var scheduledDelivery = {
                delivery: delivery,
                beginAt: beginAt[vehicleType]
            };
            usableVehicle.nextAvailableAt += deliveryLeg.duration;
        }
        /*
          Remaining TODO in this method: Need to check for any deliveries that are on hold and start them first.
          We'll be able to check that based on when the vehicle is next available, which means we'll need to put the vehicle
          back into the rotation to be pulled from when they are available
        */
        scheduledDeliveries.push(scheduledDelivery);
    }
    return scheduledDeliveries;
}
function getVehicle(availableVehicles, vehicleType) {
    return availableVehicles[vehicleType].pop;
}
// Defines a function to sort deliveries in order of which they should be scheduled
function prioritizeDeliveries(deliveries) {
    var prioritizedDeliveries = [];
    // First, sort the deliveries by their total duration
    var scheduledDeliveries = sortDeliveriesByTotalDuration(deliveries);
    // Next, prioritize them based on the vehicle that limits them most.
    // If it is limited by a plane, put the shortest delivery at the end. If it's a truck, put it at the beginning, and so on.
    // That way, we will ideally be using trucks and planes at opposite times as much as possible
    for (var _i = 0, scheduledDeliveries_1 = scheduledDeliveries; _i < scheduledDeliveries_1.length; _i++) {
        var delivery = scheduledDeliveries_1[_i];
        if (limitingFactor(delivery) === "plane") {
            prioritizedDeliveries.push(delivery);
        }
        else if (limitingFactor(delivery) === "truck") {
            prioritizedDeliveries.unshift(delivery);
        }
    }
    return deliveries;
}
function sortDeliveriesByTotalDuration(deliveries) {
    return deliveries.sort(function (a, b) {
        var totalDurationA = a.deliveryLegs.reduce(function (total, leg) { return total + leg.duration; }, 0);
        var totalDurationB = b.deliveryLegs.reduce(function (total, leg) { return total + leg.duration; }, 0);
        return totalDurationA - totalDurationB;
    });
}
function limitingFactor(delivery) {
    var durationByVehicleType = {
        plane: 0,
        truck: 0,
    };
    for (var _i = 0, _a = delivery.deliveryLegs; _i < _a.length; _i++) {
        var leg = _a[_i];
        durationByVehicleType[leg.vehicleType] += leg.duration;
    }
    return (durationByVehicleType.plane > durationByVehicleType.truck) ? 'plane' : 'truck';
}
