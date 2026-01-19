export default function Home() {
  return (
    <div>
      <h2>Welcome to E-Shopping</h2>
      <p>This is a simple multi-page React app connected to 3 microservices.</p>
      <ul>
        <li>Catalog → MySQL</li>
        <li>Cart → MongoDB</li>
        <li>Orders → PostgreSQL</li>
      </ul>
    </div>
  );
}
