import React, {useEffect, useState} from 'react';
import {
  TextField,
} from '@material-ui/core';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {graphql} from '../../utils';
import {CITY_QUERY} from '../../gql/publicCatalog';


const filter = createFilterOptions();

const ChooseCity = (props) => {
  const {city, freeSolo, onChange, propsClasses} = props;
  const [options, setOptions] = useState([{id: 1, name: 'Київ'}]);

  useEffect(() => {
    graphql.post('', {query: CITY_QUERY})
        .then((response) => {
          if (response.data.data) {
            setOptions(response.data.data.city);
          }
        });
  }, []);

  return (
    <>
      <Autocomplete
        classes={propsClasses}
        size={'small'}
        value={typeof city === 'object' ? city : options.find((c) => c.id === city) || options[0]}
        options={options}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        onChange={onChange}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (freeSolo && params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(option) => option.name}
        freeSolo={freeSolo}
        renderInput={(params) => (
          <TextField {...params} label="" variant="outlined"/>
        )}/>
    </>
  );
};


export default ChooseCity;
