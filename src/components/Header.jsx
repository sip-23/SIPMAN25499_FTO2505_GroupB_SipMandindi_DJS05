import { IoBookOutline, IoNotificationsOutline, IoSearchOutline, IoPersonOutline } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";

/**
 * Header Component
 *
 * A fixed top navigation bar
 * @component
 */
const Header = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState("");
    const searchTimeoutRef = useRef(null);
    const searchInputRef = useRef(null);

    const darkLogo = {id: 2, image: "./src/assets/SippiCupPod Logo Dark NoBG.png", alt: "Dark mode logo"};

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            if (onSearch) {
                onSearch(value.toLowerCase().trim());
            }
        }, 300);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            
            // Execute search immediately
            if (onSearch) {
                onSearch(searchValue.toLowerCase().trim());
            }
        }
    }

    const clearSearch  = () => {
        setSearchValue("");
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        if (onSearch) {
            onSearch("");
        }
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="top-0 left-0 right-0 bg-[#121212] w-full h-fit px-5 py-2 relative flex-1 flex items-center justify-between z-50 border-b border-[#333]">

            {/* Icon Container */}
            {darkLogo && (
                <img 
                    className="flex w-[200px] h-12 md:w-[170px]" 
                    src={darkLogo.image} 
                    alt={darkLogo.alt} 
                />
            )}
            
            
            {/* Search container */}
            <div className="flex items-center w-[350px] h-10 px-3">
                <IoSearchOutline color="#b3b3b3" className=" mr-3" size={22}/>
                <input
                    ref={searchInputRef} 
                    type="text" 
                    placeholder="Search" 
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress}
                    className="border rounded-md opacity-30 bg-[#121212] w-full py-2 px-4 placeholder:text-[#b3b3b3] text-white hover:border-[#9A7B4F]" 
                />

                {/* Adding Clear search button */}
                {searchValue && (
                    <button 
                        onClick={clearSearch}
                        className="ml-2 text-[#b3b3b3] hover:text-white transition-colors"
                        title="Clear search">
                        ×
                    </button>
                )}
            </div>
            
            {/* Icons container */}
            <div className="flex items-center justify-center">
                <div className="hidden md:block rounded-full w-10 h-10 bg-[#65350F] grid place-items-center cursor-pointer hover:bg-[#9A7B4F] mr-3 p-2">
                    <IoNotificationsOutline color="#b3b3b3" size={22}/>
                </div>
                <div className="hidden md:flex rounded-full w-10 h-10 bg-[#65350F] grid place-items-center cursor-pointer hover:bg-[#9A7B4F] mr-3 p-2">
                    <IoBookOutline color="#b3b3b3" size={22} />
                </div>
                <div className="rounded-full w-10 h-10 bg-[#65350F] grid place-items-center cursor-pointer hover:bg-[#9A7B4F] mr-3">
                    <IoPersonOutline color="#b3b3b3" size={22} />
                </div>
            </div>
        </div>
    );
};

export default Header;