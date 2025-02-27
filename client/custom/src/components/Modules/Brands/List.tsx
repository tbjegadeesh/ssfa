import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteRequest,
  get,
} from '../../../common/HttpMethods/AxiosHttpMethods';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import Table from '../../Common/Table';
import { brandEndpoints } from '../../../common/Services/Brands/brandsEndpoints';
import { routes, tableColumns } from './Constants';
import TableSearchAndActions from '../../Common/Table/TableSearchAndActions';
import ConfirmationModal from '../../Common/Alerts/ConfirmationModal';
import {
  showErrorToast,
  showSuccessToast,
} from '../../../common/Toaster/toast';
// Assuming you have a Brand interface defined
interface Brand {
  brandName: any;
  id: number;
}
const List = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [brands, setBrands] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteBrand, setSelectedDeleteBrand] = useState<Brand | null>(
    null,
  ); // Set the type here

  // Fetch brands with pagination, search, and sorting
  const fetchBrands = async (
    page: number,
    searchTerm: string = '',
    sortBy: string = '',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) => {
    try {
      const resp: any = await get(brandEndpoints.getBrands(), {
        page,
        limit: 5,
        search: searchTerm,
        sortBy,
        sortOrder,
      });
      setBrands(
        resp.success && resp.brands && resp.brands.length > 0
          ? resp.brands
          : [],
      );
      setTotalPages(resp.totalPages);
      setTotalItems(resp.totalItems);
    } catch (error: any) {
      console.error('Error fetching brands:', error);
      return [];
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBrands(page, searchTerm, sortBy, sortOrder); // Fetch data when page changes
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
    fetchBrands(1, searchTerm, sortBy, sortOrder);
  };

  // Reset search
  const resetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    setSortBy('createdAt');
    setSortOrder('asc');
    fetchBrands(1, '', 'createdAt', 'asc');
  };

  // Handle sort
  const handleSort = (sortField: string) => {
    const newSortOrder =
      sortBy === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(sortField);
    setSortOrder(newSortOrder);
    fetchBrands(currentPage, searchTerm, sortField, newSortOrder);
  };

  // Fetch data on initial load (only once)
  useEffect(() => {
    fetchBrands(currentPage, searchTerm, sortBy, sortOrder);
  }, []);

  const editBrand = (id: any) => {
    navigate(`/brands/edit/${id}`);
  };

  const handledeleteBrand = (data: any) => {
    setSelectedDeleteBrand(data);
    setIsModalOpen(true);
  };

  const handleConfirmDelete: any = async () => {
    // Call your delete API here
    try {
      await deleteRequest(`/brands/${selectedDeleteBrand?.id}`);
      showSuccessToast(
        `Brand ${selectedDeleteBrand?.brandName} deleted successfully`,
      );
    } catch (error: any) {
      console.error('Error deleting brand:', error);
      showErrorToast(error.msg);
    } finally {
      resetSearch();
      setIsModalOpen(false);
      setSelectedDeleteBrand(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeleteBrand(null);
  };

  return (
    <>
      <Breadcrumb pageName="Brands" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <TableSearchAndActions
          totalItems={totalItems}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          resetSearch={resetSearch}
          addLink={routes.add}
        />
        <Table
          columns={tableColumns}
          data={brands}
          editAction={editBrand}
          deleteAction={handledeleteBrand}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to delete this brand with ID: ${selectedDeleteBrand?.brandName}`} // Customize the message as needed
        />
      </div>
    </>
  );
};

export default List;
