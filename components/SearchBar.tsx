"use client";
import { Search, X } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [search, setSearch] = React.useState("");
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  return (
    <Dialog open={showSearch} onOpenChange={() => setShowSearch(!showSearch)}>
      <DialogTrigger onClick={() => setShowSearch(!showSearch)}>
        <Search className="w-5 h-5 hover:text-darkColor hoverEffect" />
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="mb-1">Rechercher un produit</DialogTitle>
          <form className="relative" onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder="Rechercher un produit"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md py-5"
            />
             {search && <X className="w-4 h-4 absolute top-1/2 right-11 transform -translate-y-1/2 hover:text-red-500 hoverEffect" onClick={() => setSearch("")} />}
            <button
              className={`absolute right-0 top-0 h-full px-3 flex items-center justify-center w-10  rounded-tr-md rounded-br-md hover:bg-darkColor hover:text-white hoverEffect ${search ? "bg-darkColor text-white": "bg-darkColor/10"}`}
              type="submit"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </DialogHeader>
        <div><p>
          
        </p>
        </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
