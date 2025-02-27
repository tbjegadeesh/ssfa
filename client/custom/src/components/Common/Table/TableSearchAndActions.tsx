import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineReload } from 'react-icons/ai';

interface SearchAndActionsProps {
  totalItems: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: () => void;
  resetSearch: () => void;
  addLink: string;
}

const TableSearchAndActions: React.FC<SearchAndActionsProps> = ({
  totalItems,
  searchTerm,
  setSearchTerm,
  handleSearch,
  resetSearch,
  addLink,
}) => {
  return (
    <div className="mb-4 mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h5 className="mb-0 text-xl font-semibold text-black dark:text-white">
        Total: {totalItems}
      </h5>
      <div className="flex items-center gap-4">
        <div className="relative flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-primary text-white  px-4 flex items-center justify-center"
          >
            <FiSearch className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={resetSearch}
          className="flex items-center gap-2 bg-gray-200 p-2  hover:bg-gray-300"
        >
          <AiOutlineReload />
          Reset
        </button>
        <Link
          to={addLink}
          className="inline-flex items-center justify-center gap-2.5 bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5"
        >
          <span>+</span>
          Add
        </Link>
      </div>
    </div>
  );
};

export default TableSearchAndActions;
