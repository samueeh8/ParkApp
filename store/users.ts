import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { create } from "zustand";

// Define a type for the user data
interface User {
  id: string;
  email: string;
  matricula: string[];
  status: string;
}

// Define a type for the store
interface UserStore {
  user: User;
  newUSerToDatabaseFirebase: (
    userEmail: string,
    matricula: string
  ) => Promise<void>;
  setLoggedInUser: (userEmail: string) => Promise<boolean>;
  logoutUser: () => void;
  getAllUsers: () => Promise<User[]>;
  deleteUser: (id: string) => Promise<void>;
  addMatricula: (userID: string, matricula: string) => Promise<void>;
  deleteMatricula: (userID: string, matricula: string) => Promise<void>;
  changeUserRole: (id: string, status: string) => Promise<void>;
}

const defaultUser: User = {
  id: "",
  email: "",
  matricula: [],
  status: "",
};

export const userStore = create<UserStore>((set) => ({
  user: defaultUser,

  setLoggedInUser: async (userEmail: string) => {
    // Search in firebase for the user with the email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        set({ user: doc.data() as User });
      });

      return true;
    } else {
      console.log("No such user!");

      return false;
    }
  },

  newUSerToDatabaseFirebase: async (userEmail: string, matricula: string) => {
    const userData = {
      id: "",
      email: userEmail,
      matricula: [matricula],
      status: "user",
    };

    try {
      // First check if the user already exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const resultdoc = await addDoc(collection(db, "users"), userData);

        // Change the id of the parking slot to the id of the document in Firestore
        userData.id = resultdoc.id;
        setDoc(doc(db, "users", resultdoc.id), userData);

        set({ user: userData });
      } else {
        console.log("User already exists!");
      }
    } catch (e) {
      toast.error("Ocurrió un error, por favor intenta de nuevo más tarde");
    }
  },

  getAllUsers: async () => {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    const users: User[] = [];

    querySnapshot.forEach((doc) => {
      users.push(doc.data() as User);
    });

    return users;
  },

  deleteUser: async (id: string) => {
    await deleteDoc(doc(db, "users", id));
  },

  changeUserRole: async (id: string, status: string) => {
    const userRef = doc(db, "users", id);
    await setDoc(userRef, { status: status }, { merge: true });
  },

  addMatricula: async (userID: string, matricula: string) => {
    const userRef = doc(db, "users", userID);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      console.log("No such document!");
    } else {
      const data = docSnap.data() as User;
      const newMatricula = [...data.matricula, matricula];
      await setDoc(userRef, { matricula: newMatricula }, { merge: true });

      // Set the new matricula to the user Zustand
      set({ user: { ...data, matricula: newMatricula } });
    }
  },

  deleteMatricula: async (userID: string, matricula: string) => {
    const userRef = doc(db, "users", userID);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      console.log("No such document!");
    } else {
      const data = docSnap.data() as User;
      const newMatricula = data.matricula.filter((m) => m !== matricula);
      await setDoc(userRef, { matricula: newMatricula }, { merge: true });

      // Set the new matricula to the user Zustand
      set({ user: { ...data, matricula: newMatricula } });
    }
  },

  logoutUser: () => {
    set({ user: defaultUser });
  },
}));
