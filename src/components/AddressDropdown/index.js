import React from 'react';
import './index.scss'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

const AddressDropdown = ({label, onSelected}) => {

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log("📍 Coordinates: ", { lat, lng });
        onSelected({ lat, lng, address: description });
      })
      .catch((error) => {
        console.log("😱 Error: ", error);
      });
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div className='delivery-form-input'>
      <label>{label}</label>
      <input 
        value={value}
        onChange={handleInput}
        disabled={!ready}
        required={true} 
      />
      {status === "OK" && <ul className='suggestion-list'>{renderSuggestions()}</ul>}
    </div>
  );
}

export default AddressDropdown;