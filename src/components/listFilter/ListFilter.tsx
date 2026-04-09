import { useState, type ChangeEvent, type ReactNode } from "react";

type ListFilterProps = {
    list: string[];
};

function ListFilter({ list }: ListFilterProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const listDataFiltered = list.filter((list_item) =>
        list_item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const highlightMatch = (fruit: string): ReactNode => {
        if (!searchTerm.trim()) {
            return fruit;
        }

        const matchRegex = new RegExp(`(${escapeRegex(searchTerm)})`, "ig");
        const fruitParts = fruit.split(matchRegex);

        return fruitParts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <strong key={`${fruit}-${index}`}>{part}</strong>
            ) : (
                <span key={`${fruit}-${index}`}>{part}</span>
            )
        );
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Type to search"
                value={searchTerm}
                onChange={handleChange}
            />
            
            <ul>
                {listDataFiltered.map((list_item) => (
                    <li key={list_item}>{highlightMatch(list_item)}</li>
                ))}
            </ul>
        </div>
    );
}

export default ListFilter;

