"use client";

import React, { useState, useEffect } from "react";
import { userStore } from "@/store/users";

import "../edit_parkings/edit_parkings.css";

export default function EditUsersPage() {
  const { user, getAllUsers, deleteUser, changeUserRole } = userStore();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users);
    });
  }, [getAllUsers]);

  const handleDelete = (id) => {
    deleteUser(id).then(() => {
      setUsers(users.filter((user) => user.id !== id));
    });
  };

  const handleRoleChange = (id, role) => {
    changeUserRole(id, role).then(() => {
      setUsers(
        users.map((user) => {
          if (user.id === id) {
            user.status = role;
          }
          return user;
        })
      );
    });
  };

  if (user?.status !== "admin") {
    return <p>Necesitas permisos de admin para acceder a esta sección</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold my-5">Editar Usuarios</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  onClick={() => {
                    handleDelete(user.id);
                  }}
                >
                  Eliminar
                </button>
                {user.status === "admin" ? (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                    onClick={() => {
                      handleRoleChange(user.id, "user");
                    }}
                  >
                    Quitar Admin
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                    onClick={() => {
                      handleRoleChange(user.id, "admin");
                    }}
                  >
                    Hacer Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
