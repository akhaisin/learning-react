type ListFilterProps = {
	list: string[];
	filterTerm: string;
};

function ListFilter({ list, filterTerm }: ListFilterProps) {
	void filterTerm;

	return (
		<div>
			<ul>
				{list.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</div>
	);
}

export default ListFilter;