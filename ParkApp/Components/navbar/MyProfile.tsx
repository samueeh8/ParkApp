"use client";

import Link from "next/link";
import { useState } from "react";

export default function MyProfile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="navbar-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Mi Cuenta
      </button>
      {isOpen && (
        <div className="navbar-menu">
          <div>
            <Link className="flex items-center gap-2 hover:bg-blue-400" href="/main/profile">
              <UserIcon className="h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </div>
          <div>
            <Link className="flex items-center gap-2 hover:bg-blue-400" href="/main/my_reservations">
              <CalendarIcon className="h-4 w-4" />
              <span>Mis reservas</span>
            </Link>
          </div>
          <hr />
          <div>
            <Link className="flex items-center gap-2 hover:bg-blue-400" href="/">
              <LogOutIcon className="h-4 w-4" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function LogOutIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
