import React, { useState, useEffect } from 'react';
import '../styles/ManageInventory.css';

function ManageInventory() {
    const [inventory, setInventory] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newItem, setNewItem] = useState({
        name: '',
        quantity: '',
        expiryDate: '',
        department_id: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch all inventory items
    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://healthnet-web-production.up.railway.app/inventory', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch inventory items');
            }

            const data = await response.json();
            setInventory(data);
            setFilteredInventory(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setErrorMessage(error.message);
        }
    };

    // Fetch departments
    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://healthnet-web-production.up.railway.app/department', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch departments');
            }

            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    // Search inventory
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = inventory.filter((item) =>
            item.name.toLowerCase().includes(term)
        );
        setFilteredInventory(filtered);
    };

    // Add inventory item
    const handleCreateFieldChange = (field, value) => {
        setNewItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://healthnet-web-production.up.railway.app/inventory', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error('Failed to create inventory item');
            }

            alert('Inventory item created successfully');
            fetchInventory();
            setIsCreateMode(false);
            setNewItem({
                name: '',
                quantity: '',
                expiryDate: '',
                department_id: '',
            });
        } catch (error) {
            console.error('Error creating inventory item:', error);
            setErrorMessage(error.message);
        }
    };

    // Delete inventory item
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://healthnet-web-production.up.railway.app/inventory/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete inventory item');
            }

            alert('Inventory item deleted successfully');
            fetchInventory();
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            setErrorMessage(error.message);
        }
    };

    // Update inventory item
    const handleUpdateFieldChange = (field, value) => {
        setSelectedItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://healthnet-web-production.up.railway.app/inventory/${selectedItem.inventory_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedItem),
            });

            if (!response.ok) {
                throw new Error('Failed to update inventory item');
            }

            alert('Inventory item updated successfully');
            fetchInventory();
            setSelectedItem(null);
        } catch (error) {
            console.error('Error updating inventory item:', error);
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        fetchInventory();
        fetchDepartments();
    }, []);


    const getCardBackgroundColor = (expiryDate) => {
        const currentDate = new Date();
        const expiry = new Date(expiryDate);
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(currentDate.getMonth() + 1);

        if (expiry < currentDate) {
            return 'lightcoral'; // Expired
        } else if (expiry <= oneMonthLater) {
            return 'lightyellow'; // Expires within a month
        } else {
            return 'white'; // Default color
        }
    };


    return (
        <div className="manageInventory">
            <h2 className="inventoryTitle">Manage Inventory</h2>
            {!isCreateMode && (
                <input
                    type="text"
                    placeholder="Search inventory by name"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="searchBar"
                />
            )}
            <button className="createButton" onClick={() => setIsCreateMode(true)}>Add Inventory Item</button>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}

            {isCreateMode ? (
                <div className="createTab">
                    <h3>Add Inventory Item</h3>
                    <form onSubmit={handleCreateSubmit}>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={newItem.name}
                                onChange={(e) => handleCreateFieldChange('name', e.target.value)}
                            />
                        </label>
                        <label>
                            Quantity:
                            <input
                                type="number"
                                value={newItem.quantity}
                                onChange={(e) => handleCreateFieldChange('quantity', e.target.value)}
                            />
                        </label>
                        <label>
                            Expiry Date:
                            <input
                                type="date"
                                value={newItem.expiryDate}
                                onChange={(e) => handleCreateFieldChange('expiryDate', e.target.value)}
                            />
                        </label>
                        <label>
                            Department:
                            <select
                                value={newItem.department_id}
                                onChange={(e) => handleCreateFieldChange('department_id', e.target.value)}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.department_id} value={dept.department_id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button type="submit" className="saveButton">Save</button>
                        <button type="button" onClick={() => setIsCreateMode(false)} className="cancelButton">
                            Cancel
                        </button>
                    </form>
                </div>
            ) : selectedItem ? (
                <div className="editTab">
                    <h3>Edit Inventory Item</h3>
                    <form onSubmit={handleUpdateSubmit}>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={selectedItem.name}
                                onChange={(e) => handleUpdateFieldChange('name', e.target.value)}
                            />
                        </label>
                        <label>
                            Quantity:
                            <input
                                type="number"
                                value={selectedItem.quantity}
                                onChange={(e) => handleUpdateFieldChange('quantity', e.target.value)}
                            />
                        </label>
                        <label>
                            Expiry Date:
                            <input
                                type="date"
                                value={selectedItem.expiryDate}
                                onChange={(e) => handleUpdateFieldChange('expiryDate', e.target.value)}
                            />
                        </label>
                        <label>
                            Department:
                            <select
                                value={selectedItem.department_id}
                                onChange={(e) => handleUpdateFieldChange('department_id', e.target.value)}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.department_id} value={dept.department_id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button type="submit" className="saveButton">Save</button>
                        <button type="button" onClick={() => setSelectedItem(null)} className="cancelButton">
                            Cancel
                        </button>
                    </form>
                </div>
            ) : (
                <div className="inventoryList">
                    {filteredInventory.map((item) => (
                        <div
                            key={item.inventory_id}
                            className="inventoryCard"
                            style={{ backgroundColor: getCardBackgroundColor(item.expiryDate) }}
                        >

                            <p><strong>Inventory ID:</strong> {item.inventory_id}</p>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Expiry Date:</strong> {item.expiryDate}</p>
                            <p><strong>Department:</strong> {item.department_id}</p>
                            <div className="recordActions">
                                <button onClick={() => handleDelete(item.inventory_id)} className="deleteButton">
                                    Delete
                                </button>
                                <button onClick={() => setSelectedItem(item)} className="updateButton">
                                    Update
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageInventory;
