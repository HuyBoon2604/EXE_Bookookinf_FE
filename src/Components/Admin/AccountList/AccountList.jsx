import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccountList.css';

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [newAccount, setNewAccount] = useState({ name: '', email: '', location: '', phone: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                const data = await response.json();
                setAccounts(data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAccount((prev) => ({ ...prev, [name]: value }));
    };

    const validateAccount = () => {
        const { name, email, phone } = newAccount;
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
        const phoneRegex = /^\+?\d{10,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegex.test(name)) {
            toast.error('Tên không hợp lệ');
            return false;
        }
        if (!phoneRegex.test(phone)) {
            toast.error('Số điện thoại không hợp lệ');
            return false;
        }
        if (!emailRegex.test(email)) {
            toast.error('Email không hợp lệ');
            return false;
        }
        return true;
    };

    const handleAction = async (actionType, account) => {
        if (actionType === 'edit') {
            setIsEditing(true);
            setCurrentAccount(account);
            setNewAccount(account);
            setIsModalOpen(true);
        } else if (actionType === 'delete') {
            try {
                await fetch(`http://localhost:5000/users/${account.id}`, {
                    method: 'DELETE',
                });
                setAccounts(accounts.filter(acc => acc.id !== account.id));
                toast.success('Account deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete account');
            }
        } else if (actionType === 'ban') {
            try {
                const updatedAccount = { ...account, locked: !account.locked };
                await fetch(`http://localhost:5000/users/${account.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedAccount),
                });
                setAccounts(accounts.map(acc => (acc.id === account.id ? updatedAccount : acc)));
                toast.success(updatedAccount.locked ? 'Account banned successfully!' : 'Account unbanned successfully!');
            } catch (error) {
                toast.error('Failed to update account status');
            }
        }
    };

    const handleUpdateAccount = async () => {
        if (!validateAccount()) return;
        try {
            const updatedAccount = { ...newAccount, id: currentAccount.id };
            await fetch(`http://localhost:5000/users/${currentAccount.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAccount),
            });
            setAccounts(accounts.map(acc => (acc.id === currentAccount.id ? updatedAccount : acc)));
            toast.success('Account updated successfully!');
            resetForm();
        } catch (error) {
            toast.error('Failed to update account');
        }
    };

    const handleAddAccount = async () => {
        if (!validateAccount()) return;
        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAccount),
            });
            const createdAccount = await response.json();
            setAccounts([...accounts, createdAccount]);
            toast.success('Account added successfully!');
            resetForm();
        } catch (error) {
            toast.error('Failed to add account');
        }
    };

    const resetForm = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setNewAccount({ name: '', email: '', location: '', phone: '' });
        setCurrentAccount(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredAccounts = accounts.filter((acc) =>
        (acc.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (acc.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (acc.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (acc.phone || '').includes(searchTerm)
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div id="AccountList" className="accounts-container">
            <div className="accounts-header">
                <h2>Accounts</h2>
                <div className="header-actions">
                    <button className="add-account-btn" onClick={() => setIsModalOpen(true)}>Add Account</button>
                    <input
                        type="text"
                        placeholder="Search Accounts"
                        className="search-input"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>
            <table className="accounts-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Adress</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAccounts.map((acc, index) => (
                        <tr key={acc.id}>
                            <td>{index + 1}</td>
                            <td>{acc.name}</td>
                            <td>{acc.email}</td>
                            <td className="address">{acc.address}</td>
                            <td>{acc.phone}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleAction('edit', acc)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleAction('delete', acc)}>Delete</button>
                                <button className="lock-btn" onClick={() => handleAction('ban', acc)}>
                                    {acc.locked ? "Unban" : "Ban"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isEditing ? "Edit Account" : "Add New Account"}</h3>
                        <div className="input-group">
                            <label className='name' htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                value={newAccount.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className='email' htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={newAccount.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label className='phone' htmlFor="phone">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="Phone"
                                value={newAccount.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="button-container">
                            <button className='btn-add' onClick={isEditing ? handleUpdateAccount : handleAddAccount}>
                                {isEditing ? "Update Account" : "Add Account"}
                            </button>
                            <button className='btn-cancel' onClick={resetForm}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default AccountList;