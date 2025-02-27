import React from 'react';
import { BsFillPencilFill } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import Pagination from './TablePagination';
import BrandTwo from '../../../images/brand/brand-02.svg';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { PiSmileySad } from 'react-icons/pi';

interface TableProps {
  columns: Array<{ header: string; accessor: string; width?: string }>;
  data: Array<any>;
  editAction?: (id: any) => void;
  deleteAction?: (id: any) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSort: (sortField: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  editAction,
  deleteAction,
  currentPage,
  totalPages,
  onPageChange,
  onSort,
  sortBy,
  sortOrder,
}) => {
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const options: any = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date,
    );
    const [datePart, timePart] = formattedDate.split(', ');
    return `${datePart} ${timePart}`;
  };

  return (
    <div className="max-w-full overflow-x-auto">
      <table
        className="w-full table-auto border-collapse"
        style={{ tableLayout: 'fixed' }}
      >
        <thead>
          <tr className="bg-gray-200 text-left dark:bg-meta-4">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`py-4 px-2 text-sm font-medium text-black dark:text-white cursor-pointer ${
                  sortBy === column.accessor ? 'bg-gray-300' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => onSort(column.accessor)}
              >
                <div className="flex items-center">
                  {column.header}
                  {sortBy === column.accessor ? (
                    sortOrder === 'asc' ? (
                      <FaSortUp className="ml-2" />
                    ) : (
                      <FaSortDown className="ml-2" />
                    )
                  ) : null}
                </div>
              </th>
            ))}
            <th className="py-1 px-2 text-sm font-medium text-black dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {columns.map((column, colIndex) => {
                const value = row[column.accessor];
                if (
                  column.accessor === 'createdAt' ||
                  column.accessor === 'updatedAt'
                ) {
                  return (
                    <td
                      key={colIndex}
                      className="border-b border-gray-300 px-2 py-1 text-sm dark:border-strokedark"
                    >
                      {formatDate(value)} {/* Use the formatDate function */}
                    </td>
                  );
                }
                // Conditionally render the 'brandLogo' as an image if the column is the logo column
                if (column.accessor === 'brandLogo') {
                  return (
                    <td
                      key={colIndex}
                      className="border-b border-gray-300 px-2 py-1 text-sm dark:border-strokedark"
                    >
                      <img
                        style={{ width: 40 }}
                        src={BrandTwo}
                        alt="Brand Logo"
                        className="w-12 h-12 object-contain"
                      />
                    </td>
                  );
                }
                // Conditionally render styles for the 'Status' column
                if (column.accessor === 'brandStatus') {
                  const statusClass =
                    value === 'Active'
                      ? 'text-green-500'
                      : value === 'Inactive'
                      ? 'text-red-500'
                      : 'text-yellow-500';
                  return (
                    <td
                      key={colIndex}
                      className={`border-b border-gray-300 px-2 py-1 text-sm dark:border-strokedark ${statusClass}`}
                    >
                      {value}
                    </td>
                  );
                }
                return (
                  <td
                    key={colIndex}
                    className="border-b border-gray-300 px-2 py-1 text-sm dark:border-strokedark"
                  >
                    {value}
                  </td>
                );
              })}
              <td className="border-b border-gray-300 px-2 py-1 text-sm dark:border-strokedark">
                <div className="flex items-center space-x-2.5">
                  {editAction && (
                    <button onClick={() => editAction(row.id)}>
                      <BsFillPencilFill
                        className="text-blue-500 hover:text-blue-700"
                        size={16}
                      />
                    </button>
                  )}
                  {deleteAction && (
                    <button onClick={() => deleteAction(row)}>
                      <MdDelete
                        className="text-red-500 hover:text-red-700"
                        size={18}
                      />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      {data && data.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-48">
          <PiSmileySad className="text-4xl text-gray-400 mb-2" />{' '}
          {/* Sad icon */}
          <p className="text-lg text-gray-500">No Data Available</p>
        </div>
      )}
    </div>
  );
};

export default Table;
