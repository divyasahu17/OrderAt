import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useQuery, gql } from '@apollo/client';

const AddOrder = ({ t, onSubmit, onCancel }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(''); // State to trigger the query

  const GET_USERS_BY_SEARCH = gql`
    query Users($search: String) {
      search_users(search: $search) {
        name
        email
        phone
      }
    }
  `;

  // Handle input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update the local input state
  };

  // Handle search button click
  const handleSearchClick = () => {
    setSearchTrigger(searchQuery); // Trigger the query with the current input value
  };

  // Use the useQuery hook with the triggered search query
  const { loading, error, data } = useQuery(GET_USERS_BY_SEARCH, {
    variables: { search: searchTrigger },
    skip: !searchTrigger, // Skip query if no search is triggered
  });

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: 2,
        marginTop: 2,
        marginBottom: 2,
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        boxShadow: 3,
      }}
    >
      <h2>{t('Search Customer')}</h2>

      {/* Input Field */}
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        sx={{
          '& .MuiInputBase-input': {
            color: 'black',
          },
        }}
        value={searchQuery}
        onChange={handleSearchChange} // Update the input state on change
      />

      {/* Search Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSearchClick} // Trigger the query on click
        style={{ marginTop: '10px' }}
      >
        Search Customer
      </Button>

      {/* Results Section */}
      <div style={{ marginTop: '20px' }}>
        {loading && <p>Loading...</p>}
        {error && <p>Error fetching users: {error.message}</p>}
        {data && data.search_users && data.search_users.length > 0 ? (
          <ul>
            {data.search_users.map((user, index) => (
              <li key={index}>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>:Addresses {user.addresses}</p>
                <p>User Type: {user.userType}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No users found.</p>
        )}
      </div>
    </Box>
  );
};

AddOrder.propTypes = {
  t: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddOrder;
