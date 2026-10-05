"use client";

import CreatePostModal from "@/components/insta/CreatePostModal";
import { createContext, useContext, useState, ReactNode } from "react";

interface CreateModalContextType {
    open: () => void;
    close: () => void;
}

const CreateModalContext = createContext<CreateModalContextType>({
    open: () => { },
    close: () => { },
});

export function CreateModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <CreateModalContext.Provider
            value={{ open: () => setIsOpen(true), close: () => setIsOpen(false) }}
        >
            {children}
            {isOpen && <CreatePostModal />}
        </CreateModalContext.Provider>
    );
}

export const useCreateModal = () => useContext(CreateModalContext);
