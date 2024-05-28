"use client";

import { useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from 'next/navigation'

import "./login.css";
import { userStore } from "@/store/users";
import firebase from "firebase/compat/app";
import { toast } from "react-toastify";

export default function Login() {
  const { newUSerToDatabaseFirebase, setLoggedInUser } = userStore();
  const router = useRouter();

  useEffect(() => {
    const switchers = [...document.querySelectorAll(".switcher")];
    switchers.forEach((item) => {
      item.addEventListener("click", () => {
        // Use arrow function to bind 'this' correctly
        switchers.forEach((item) => {
          if (item.parentElement) {
            item.parentElement.classList.remove("is-active");
          }
        });
        if (item.parentElement) {
          item.parentElement.classList.add("is-active"); // Use 'item' instead of 'this'
        }
      });
    });
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailElement = document.getElementById(
      "signup-email"
    ) as HTMLInputElement;
    const passwordElement = document.getElementById(
      "signup-password"
    ) as HTMLInputElement;
    const passwordConfirmElement = document.getElementById(
      "signup-password-confirm"
    ) as HTMLInputElement;

    const email = emailElement.value;
    const password = passwordElement.value;
    const passwordConfirm = passwordConfirmElement.value;

    if (password === passwordConfirm) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await newUSerToDatabaseFirebase(email);

        // Redirect to
        router.push('/main/parking');
      } catch (error) {
        const firebaseError = error as firebase.FirebaseError;
        console.error(firebaseError);

        if (firebaseError.code === "auth/email-already-in-use") toast.error("Email en uso, pruebe otro");
        else if (firebaseError.code === "auth/weak-password") toast.error("El password es muy débil");
        else if (firebaseError.code === "auth/invalid-email") toast.error("Email inválido");
        else toast.error("Error desconocido, por favor intente de nuevo más tarde");
      }
    } else {
      toast.error("Las contraseñas no coinciden");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailElement = document.getElementById(
      "login-email"
    ) as HTMLInputElement;
    const passwordElement = document.getElementById(
      "login-password"
    ) as HTMLInputElement;

    const email = emailElement.value;
    const password = passwordElement.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await setLoggedInUser(email);

      // Redirect to
      router.push('/main/parking');
    } catch (error) {
      console.error(error);

      toast.error("Credenciales inválidas, por favor intente de nuevo");
    }
  }

  return (
    <div className="h-screen">
      <section className="forms-section">
        <div className="forms">
          <div className="form-wrapper is-active">
            <button type="button" className="switcher switcher-login">
              Login
              <span className="underline"></span>
            </button>
            <form className="form form-login" onSubmit={handleLogin}>
              <fieldset>
                <div className="input-block">
                  <label>E-mail</label>
                  <input id="login-email" type="email" required></input>
                </div>
                <div className="input-block">
                  <label>Password</label>
                  <input id="login-password" type="password" required></input>
                </div>
              </fieldset>
              <button type="submit" className="btn">
                Entrar
              </button>
            </form>
          </div>
          <div className="form-wrapper">
            <button type="button" className="switcher switcher-signup">
              Registro
              <span className="underline"></span>
            </button>
            <form
              className="form form-signup"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                handleRegister(e)
              }
            >
              <fieldset>
                <div className="input-block">
                  <label>E-mail</label>
                  <input id="signup-email" type="email" required></input>
                </div>
                <div className="input-block">
                  <label>Password</label>
                  <input id="signup-password" type="password" required></input>
                </div>
                <div className="input-block">
                  <label htmlFor="signup-password-confirm">
                    Confirmar password
                  </label>
                  <input
                    id="signup-password-confirm"
                    type="password"
                    required
                  ></input>
                </div>
              </fieldset>
              <button type="submit" className="btn">
                Registrarse
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
