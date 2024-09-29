import React from 'react';

const UserCard: React.FC = () => {
  async function loadData() {
    const response = await fetch('../../api/users_data.json');
    const data = await response.json();
    console.log('fetch data from async', data);
  }
  
  loadData();

  return (
    <div>
      
    </div>
  );
};

export default UserCard;
