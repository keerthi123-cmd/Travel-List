import { useState } from "react";

export default function App() {
  const [item, setItem] = useState([]);
  function handleItem(nitem) {
    setItem((item) => [...item, nitem]);
  }
  function handleDel(id) {
    setItem((item) => item.filter((iyem) => iyem.id !== id));
  }
  function handleToggle(id) {
    setItem((item) =>
      item.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function handleClear() {
    setItem([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleItem} />
      <PackagingLists
        items={item}
        del={handleDel}
        toggle={handleToggle}
        clear={handleClear}
      />
      <Stats items={item} />
    </div>
  );
}
function Logo() {
  return <h1>🌴Far Away💼</h1>;
}
function Form({ onAddItem }) {
  const [desc, setDesc] = useState("");
  const [quan, setQuan] = useState(1);
  function handleSubmit(e) {
    e.preventDefault();
    if (!desc) return;
    const nitem = {
      id: Date.now(),
      description: desc,
      quantity: quan,
      packed: false,
    };
    onAddItem(nitem);
    setDesc("");
    setQuan(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip ?😍</h3>
      <select value={quan} onChange={(e) => setQuan(Number(e.target.value))}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="item..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button>ADD</button>
    </form>
  );
}
function PackagingLists({ items, del, toggle, clear }) {
  const [sort, setSort] = useState("input");
  let sortItems;
  if (sort === "input") sortItems = items;
  else if (sort === "description")
    sortItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  else
    sortItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortItems.map((item) => (
          <Item item={item} del={del} toggle={toggle} />
        ))}
      </ul>
      <div className="actions">
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="input">Sort By Input</option>
          <option value="description">Sort By Description</option>
          <option value="packed">Sort By Packed</option>
        </select>
        <button onClick={clear}>Clear List</button>
      </div>
    </div>
  );
}
function Item({ item, del, toggle }) {
  return (
    <li key={item.id}>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => toggle(item.id)}
      />
      <span style={item.packed ? { textDecoration: `line-through` } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => del(item.id)}>❌</button>
    </li>
  );
}
function Stats({ items }) {
  if (!items.length) {
    return <em className="footer stats">Start adding items to your list 📃</em>;
  }
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed);
  const per = Math.round((numPacked.length / numItems) * 100, 2);
  return (
    <footer className="stats">
      <em>
        {per === 100
          ? "You are ready to go ✈️"
          : `You have ${numItems} items in the list and you packed ${numPacked.length} (${per}%)`}
      </em>
    </footer>
  );
}
