import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { get, post, put } from '../../../common/HttpMethods/AxiosHttpMethods';
import {
  showErrorToast,
  showSuccessToast,
} from '../../../common/Toaster/toast';
import { brandEndpoints } from '../../../common/Services/Brands/brandsEndpoints';

interface BrandData {
  brandName: string;
  brandDetails: string;
  brandLogo?: File | null; // Added for image upload
}

interface FormProps {
  brandId?: string; // If brandId is present, it's edit mode
}

const Form: React.FC<FormProps> = ({ brandId }) => {
  const [formData, setFormData] = useState<BrandData>({
    brandName: '',
    brandDetails: '',
    brandLogo: null,
  });
  const [errors, setErrors] = useState<{
    brandName: string | null;
    brandDetails: string | null;
  }>({
    brandName: null,
    brandDetails: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchBrandDetails();
    }
  }, [id]);

  const fetchBrandDetails = async () => {
    try {
      const url = `/brands?id=${id}`;
      const response: any = await get(url);
      console.log(response, 'responseresponse');
      if (response.success) {
        const brandData = response.brands[0];
        setFormData(brandData);
        setPreviewImage(brandData.brandLogo || 'path/to/default-image.png');
      }
    } catch (error: any) {
      console.error(error.message);
      showErrorToast(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, brandLogo: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setFormData((prevData) => ({ ...prevData, brandLogo: null }));
    setPreviewImage(null);
  };

  const validateBrandName = (brandName: string): string | null => {
    if (!brandName) return 'Brand name is required';
    if (brandName.length < 3)
      return 'Brand name must be at least 3 characters long';
    return null;
  };

  const validateBrandDetails = (brandDetails: string): string | null => {
    if (!brandDetails) return 'Brand details are required';
    if (brandDetails.length < 5)
      return 'Brand details must be at least 5 characters long';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate both fields
    const brandNameError = validateBrandName(formData.brandName);
    const brandDetailsError = validateBrandDetails(formData.brandDetails);

    setErrors({
      brandName: brandNameError,
      brandDetails: brandDetailsError,
    });
    if (brandNameError || brandDetailsError) return;

    await submitBrand(isEditMode);
  };

  // Submit brand function
  const submitBrand = async (isEditMode: boolean) => {
    const method = isEditMode ? put : post;
    try {
      const url = isEditMode
        ? brandEndpoints.updateBrand(id)
        : brandEndpoints.createBrand();

      // Create a FormData object and append fields from formData state
      const formDataToSend = new FormData();
      formDataToSend.append('brandName', formData.brandName); // `formData` is your state
      formDataToSend.append('brandDetails', formData.brandDetails);

      // Check if brandLogo is provided before appending
      if (formData.brandLogo) {
        formDataToSend.append('brandLogo', formData.brandLogo); // For image file
      }

      // Now pass `data` instead of `formData`
      const resp: any = await method({
        url,
        data: formDataToSend, // This matches the new structure
      });

      // Check if response is successful
      if (resp && resp.success) {
        showSuccessToast(
          `Brand ${isEditMode ? 'updated' : 'added'} successfully`,
        );
        navigate('/brands/list');
      }
    } catch (error: any) {
      console.error(error); // Use console.error for better error visibility
      showErrorToast(error.message || 'An error occurred'); // Provide a fallback message
    }
  };
  const renderInputField = (
    label: string,
    name: keyof BrandData,
    placeholder: string,
    value: string,
    error: string | null,
  ) => (
    <div className="mb-4">
      <label className="mb-2.5 block font-medium text-black dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 text-black outline-none ${
            error
              ? 'border-red-500'
              : 'border-stroke dark:border-form-strokedark'
          } focus:border-primary dark:bg-form-input dark:text-white`}
        />
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );

  return (
    <>
      <Breadcrumb pageName={isEditMode ? 'Edit Brand' : 'Add Brand'} />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap">
          <div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <form onSubmit={handleSubmit}>
                {renderInputField(
                  'Name',
                  'brandName',
                  'Enter brand name',
                  formData.brandName,
                  errors.brandName,
                )}
                {renderInputField(
                  'Details',
                  'brandDetails',
                  'Enter brand details',
                  formData.brandDetails,
                  errors.brandDetails,
                )}

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Brand Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-2"
                  />
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mb-2 h-32 w-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="text-red-500"
                      >
                        Delete Image
                      </button>
                    </div>
                  ) : (
                    <img
                      src="path/to/default-image.png" // Add default image path here
                      alt="Default"
                      className="mb-2 h-32 w-32 object-cover"
                    />
                  )}
                </div>

                <div className="mb-5 mt-8">
                  <input
                    type="submit"
                    value={isEditMode ? 'Update Brand' : 'Add Brand'}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
