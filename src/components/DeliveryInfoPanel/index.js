import React from 'react'
import './index.scss';
import { ReactComponent as Checkmark } from './checkmark.svg';

// TODO: Break this into components.
const DeliveryInfoPanel = ({deliveryInfo, onComplete}) => {
  
  // Nasty code is nasty... 
  // Logic to figure out state of the delivery panel. This can
  // be fixed once thisis broken into components. 
  let isAssiged = deliveryInfo.status === "ASSIGNED" || 
                  deliveryInfo.status === "ACTIVE" || 
                  deliveryInfo.status === "PICKED_UP" || 
                  deliveryInfo.status === "FINISHED" ? "complete" : "";

  let isStarted = deliveryInfo.status === "ACTIVE" || 
                  deliveryInfo.status === "PICKED_UP" || 
                  deliveryInfo.status === "FINISHED" ? "complete" : "";

  let isReceived = deliveryInfo.status === "PICKED_UP" || 
                  deliveryInfo.status === "FINISHED" ? "complete" : "";

  let isFinished = deliveryInfo.status === "FINISHED" ? "complete" : "";

  return (
    <div className={`delivery-info-container active`}>
      <div className="delivery-info-container-heading">
        <div>
          <h1 className="heading">Delivery Details</h1>
          <p>{deliveryInfo.id}</p>
        </div>
        <div className="delivery-info-data">
          <h3>Pickup Location: </h3>
          <p>{deliveryInfo.pickupAddress},</p>
        </div>
        <div className="delivery-info-data">
          <h3>Dropoff Location: </h3>
          <p>{deliveryInfo.dropoffAddress}</p>
        </div>
      </div>
      <div className="delivery-info-container-body">
        
          <div className={`delivey-state-item ${isAssiged}`}>
            <Checkmark />
            <h3>Assigned</h3>
          </div>
          <div className={`delivey-state-item ${isStarted}`}>
            <Checkmark />
            <h3>Started</h3>
          </div>
          <div className={`delivey-state-item ${isReceived}`}>
            <Checkmark />
            <h3>Package Received</h3>
          </div>
          <div className={`delivey-state-item ${isFinished}`}>
            <Checkmark />
            <h3>Delivered</h3>
          </div>
        
      </div>
    </div>
  )
}

export default DeliveryInfoPanel
