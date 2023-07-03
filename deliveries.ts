// Define Plane type
type Plane = {
  name: string;
  nextAvailableAt: number;
}

// Define Truck type
type Truck = {
  name: string;
  nextAvailableAt: number;
}

type AvailableVehicles = {
  plane: Plane[],
  truck: Truck[],
}

// Define DeliveryLeg type
type DeliveryLeg = {
  vehicleType: string;
  duration: number;
  deliveryOrder: number;
}

// Define Delivery type
type Delivery = {
  id: string;
  deliveryLegs: DeliveryLeg[];
}

type ScheduledDelivery = {
  delivery: Delivery;
  beginAt: number;
};

// Defines the function for scheduling deliveries
function scheduleDeliveries(deliveries: Delivery[], availableVehicles: AvailableVehicles): ScheduledDelivery[] {
  let scheduledDeliveries: ScheduledDelivery[] = [];
  let prioritizedDeliveries = prioritizeDeliveries(deliveries);
  let deliveriesOnHold: Delivery[] = [];

  for (let delivery of prioritizedDeliveries) {
    let beginAt: {[key: string]: number} = {
      plane: 0,
      truck: 0,
    };
    let deliveryLeg = delivery.deliveryLegs[0]
    let vehicleType = deliveryLeg.vehicleType
    let usableVehicle = getVehicle(availableVehicles, vehicleType)
    if (usableVehicle === undefined) {
      deliveriesOnHold.push(delivery)
      continue
    } else {
      var scheduledDelivery: ScheduledDelivery = {
        delivery: delivery,
        beginAt: beginAt[vehicleType]
      }
      usableVehicle.nextAvailableAt += deliveryLeg.duration
    }

    /*
      Remaining TODO in this method: Need to check for any deliveries that are on hold and start them first. 
      We'll be able to check that based on when the vehicle is next available, which means we'll need to put the vehicle
      back into the rotation to be pulled from when they are available
    */

    scheduledDeliveries.push(scheduledDelivery)
  }
  return scheduledDeliveries
}

function getVehicle(availableVehicles: AvailableVehicles, vehicleType: string): Plane | Truck | undefined {
  return availableVehicles[vehicleType].pop
}

// Defines a function to sort deliveries in order of which they should be scheduled
function prioritizeDeliveries(deliveries: Delivery[]): Delivery[] {
  let prioritizedDeliveries: Delivery[] = [];

  // First, sort the deliveries by their total duration
  let scheduledDeliveries = sortDeliveriesByTotalDuration(deliveries)

  // Next, prioritize them based on the vehicle that limits them most.
  // If it is limited by a plane, put the shortest delivery at the end. If it's a truck, put it at the beginning, and so on.
  // That way, we will ideally be using trucks and planes at opposite times as much as possible
  for(let delivery of scheduledDeliveries) {
    if (limitingFactor(delivery) === "plane") {
      prioritizedDeliveries.push(delivery)
    } else if (limitingFactor(delivery) === "truck") {
      prioritizedDeliveries.unshift(delivery)
    }
  }
  return deliveries
}

function sortDeliveriesByTotalDuration(deliveries: Delivery[]): Delivery[] {
  return deliveries.sort((a, b) => {
    let totalDurationA = a.deliveryLegs.reduce((total, leg) => total + leg.duration, 0);
    let totalDurationB = b.deliveryLegs.reduce((total, leg) => total + leg.duration, 0);
    
    return totalDurationA - totalDurationB;
  });
}

function limitingFactor(delivery: Delivery): string {
  let durationByVehicleType: {[key: string]: number} = {
    plane: 0,
    truck: 0,
  };
  for (let leg of delivery.deliveryLegs) {
    durationByVehicleType[leg.vehicleType] += leg.duration;
  }
  return (durationByVehicleType.plane > durationByVehicleType.truck) ? 'plane' : 'truck';
} 
