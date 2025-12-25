import React, { useState, useEffect } from "react";
import * as api from "../../services/api";

export default function UsersListSection({
  users,
  searchTerm,
  setSearchTerm,
  currentPage,
  pagination,
  handlePageChange,
  usersLoading,
  onUpdateUserRole,
  onDeleteUser,
}) {
  const [updatingUsers, setUpdatingUsers] = useState(new Set());

  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    setUpdatingUsers((prev) => new Set(prev).add(user._id));

    try {
      const res = await api.updateUserRole(user._id, newRole);
      if (res.ok) {
        onUpdateUserRole(user._id, newRole);
      } else {
        alert(res.error || "Failed to update user role");
      }
    } catch (error) {
      alert("Failed to update user role");
    } finally {
      setUpdatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(user._id);
        return newSet;
      });
    }
  };

  const handleDeleteUser = async (user) => {
    if (
      !window.confirm(`Are you sure you want to delete user "${user.name}"?`)
    ) {
      return;
    }

    try {
      const res = await api.deleteUser(user._id);
      if (res.ok) {
        onDeleteUser(user._id);
      } else {
        alert(res.error || "Failed to delete user");
      }
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeClass = (role) => {
    return role === "admin" ? "role-badge admin" : "role-badge user";
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Users Management</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {usersLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.avatarEmoji || "👤"}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="user-email">{user.email}</span>
                    </td>
                    <td>
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className="user-phone">{user.phone || "N/A"}</span>
                    </td>
                    <td>
                      <span className="user-joined">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td>
                      <div className="user-actions">
                        <button
                          onClick={() => handleRoleToggle(user)}
                          disabled={updatingUsers.has(user._id)}
                          className={`role-toggle-btn ${
                            user.role === "admin" ? "demote" : "promote"
                          }`}
                          title={`${
                            user.role === "admin"
                              ? "Demote to user"
                              : "Promote to admin"
                          }`}
                        >
                          {updatingUsers.has(user._id) ? (
                            <div className="mini-spinner"></div>
                          ) : user.role === "admin" ? (
                            "👤"
                          ) : (
                            "👑"
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="delete-btn"
                          title="Delete user"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {pagination.totalPages} (
                  {pagination.totalUsers} users)
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
