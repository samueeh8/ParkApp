"use client";

import Link from "next/link";
import { userStore } from "@/store/users";
import { useRouter } from "next/navigation";

import "./navbar.css";
import Image from "next/image";
import MyProfile from "./MyProfile";

export default function Navbar() {
  const { user } = userStore();
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link href="#">
            <Image
              src="https://pngimg.com/uploads/parking/parking_PNG1.png"
              alt="Logo"
              width={50}
              height={50}
            />
          </Link>
        </div>
        <ul className="navbar-list">
          <li className="navbar-list-item">
            <Link href="/main/parking">Reservar Plazas</Link>
          </li>
          {user.status === "admin" ? (
            <>
              <li className="navbar-list-item">
                <Link href="/main/edit_parkings">Editar Plazas</Link>
              </li>
              <li className="navbar-list-item">
                <Link href="/main/edit_users">Ver Usuarios</Link>
              </li>
            </>
          ) : null}
        </ul>

        <MyProfile />
      </div>
    </nav>
  );
}
