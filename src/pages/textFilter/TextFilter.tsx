import ListFilter from "../../components/listFilter/ListFilter";

const FRUITS = [
	"Apple",
	"Banana",
	"Cherry",
	"Date",
	"Elderberry",
	"Fig",
	"Grape",
	"Honeydew",
	"Indian Fig",
	"Jackfruit",
	"Kiwi",
	"Lemon",
	"Mango",
	"Nectarine",
	"Orange",
	"Papaya",
	"Quince",
	"Raspberry",
	"Strawberry",
	"Tangerine",
];

function TextFilter() {
	

	return (
		<ListFilter list={FRUITS}/>
	);
}

export default TextFilter;

