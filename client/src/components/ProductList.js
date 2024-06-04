import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from './productService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: '', price: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error fetching products');
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      
      await deleteProduct(id);
      setProducts(products.filter(product => product._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const price = typeof productForm.price === 'string' ? 
        parseFloat(productForm.price.replace(/,/g, '')) : 
        productForm.price;

      const productData = {
        ...productForm,
        price: price || 0,
        quantity: parseInt(productForm.quantity, 10) || 0,
      };

      if (isEditing) {
        console.log(`Updating product with ID: ${currentProductId}`);
        await updateProduct(currentProductId, productData);
        setProducts(products.map(product => product._id === currentProductId ? { ...product, ...productData } : product));
        toast.success('Product updated successfully');
      } else {
        const newProduct = await createProduct(productData);
        setProducts([...products, newProduct]);
        toast.success('Product created successfully');
      }
      setProductForm({ name: '', price: '', quantity: '' });
      setIsEditing(false);
      setCurrentProductId(null);
    } catch (error) {
      console.error('Error creating/updating product:', error);
      toast.error('Error creating/updating product');
    }
  };

  const handleEdit = (product) => {
    console.log(`Editing product with ID: ${product._id}`);
    setProductForm({ name: product.name, price: product.price.toString(), quantity: product.quantity.toString() });
    setIsEditing(true);
    setCurrentProductId(product._id);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductForm({ ...productForm, [name]: value });
  };

  const cancelEdit = () => {
    setProductForm({ name: '', price: '', quantity: '' });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded shadow-md">
        <div className="mb-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={productForm.name}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={productForm.price}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="quantity"
            placeholder="Quantity"
            value={productForm.quantity}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {isEditing ? 'Update' : 'Create'} Product
          </button>
          {isEditing && (
            <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white p-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-2">
        {products && products.length > 0 && products.map((product) => (
          <li key={product._id} className="p-4 border rounded shadow-md flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{product.name}</p>
              <p>Price: {product.price}</p>
              <p>Quantity: {product.quantity}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default ProductList;
