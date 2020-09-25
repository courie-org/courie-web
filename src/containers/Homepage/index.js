import React, {useState} from 'react';
import './index.scss'
import axios from 'axios';
import { useHistory } from "react-router-dom";
import AddressDropdown from '../../components/AddressDropdown';

const Homepage = () => {

  const [pickup, setPickupLocation] = useState({});
  const [dropoff, setDropoffLocation] = useState({});

  const history = useHistory();

  const findDriver = async () => {

    let request = {
      pickupLatLng: { 
        lat: pickup.lat,
        lng: pickup.lng,
      },
      pickupAddress: pickup.address,
      dropoffLatLng: { 
        lat: dropoff.lat,
        lng: dropoff.lng,
      },
      dropoffAddress: dropoff.address,
    };

    const resp = await axios.post(`http://${process.env.REACT_APP_DELIVERIES_HOST}/deliveries`, request);
    
    history.push(`${process.env.PUBLIC_URL}/delivery/${resp.data.id}`);
  };

  return (
    <div className='homepage-container'>
      <section className='homepage-hero'>
        <div className='delivery-form-container'>
          <h3 className='delivery-form-heading'>Schedule a Delivery</h3>
          <div className='delivery-form-body'>
            <AddressDropdown label="Pickup Location: " onSelected={setPickupLocation} />
            <AddressDropdown label="Dropoff Location: " onSelected={setDropoffLocation} />
          </div>
          <button className='button' onClick={findDriver}>Find Courier</button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;