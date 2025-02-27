// MyComponent.tsx
import React from 'react';
import httpService from './httpServices';

// Define the data types
interface DataItem {
  id: number;
  name: string;
}

const MyComponent: React.FC = () => {
  // Using the GET method
  const { data, error, isLoading } = httpService.get<DataItem[]>('/data');

  // Using the POST method
  const postMutation = httpService.post<DataItem, { name: string }>('/data', {
    name: 'New Item',
  });

  // Using the PUT method
  const putMutation = httpService.put<DataItem, { id: number; name: string }>(
    '/data/1',
    { id: 1, name: 'Updated Item' },
  );

  // Using the DELETE method
  const deleteMutation = httpService.delete<DataItem>('/data/1');

  // Function to handle POST request
  const handlePost = async () => {
    try {
      const result = await postMutation.mutateAsync({ name: 'New Item' });
      console.log('Data posted:', result);
    } catch (err) {
      console.error('Error posting data:', err);
    }
  };

  // Loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>My Component</h1>
      <button onClick={handlePost}>Add Item</button>
      <button
        onClick={() => putMutation.mutate({ id: 1, name: 'Updated Item' })}
      >
        Update Item
      </button>
      <button onClick={() => deleteMutation.mutate()}>Delete Item</button>
      <ul>{data && data.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
    </div>
  );
};

export default MyComponent;
