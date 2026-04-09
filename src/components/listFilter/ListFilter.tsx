import type { ReactNode } from "react";

type ListFilterProps = {
    list: string[];
    filterTerm: string;
};

function ListFilter({ list, filterTerm }: ListFilterProps) {
    const normalizedFilterTerm = filterTerm.trim();

    const listDataFiltered = list.filter((list_item) =>
        list_item.toLowerCase().includes(normalizedFilterTerm.toLowerCase())
    );

    const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const highlightMatch = (fruit: string): ReactNode => {
        if (!normalizedFilterTerm) {
            return fruit;
        }

        const matchRegex = new RegExp(`(${escapeRegex(normalizedFilterTerm)})`, "ig");
        const filterTermParts = fruit.split(matchRegex);

        return filterTermParts.map((part, index) =>
            part.toLowerCase() === normalizedFilterTerm.toLowerCase() ? (
                <strong key={`${fruit}-${index}`}>{part}</strong>
            ) : (
                <span key={`${fruit}-${index}`}>{part}</span>
            )
        );
    };

    return (
        <div>
            <ul>
                {listDataFiltered.map((list_item) => (
                    <li key={list_item}>{highlightMatch(list_item)}</li>
                ))}
            </ul>
        </div>
    );
}

export default ListFilter;

