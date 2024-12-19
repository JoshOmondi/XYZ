import mysql from "mysql2/promise";

// Define a Product interface
interface ProductData {
  id: number;
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  category?: string;
}

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost", // Replace with your MySQL host
  user: "root", // Replace with your MySQL user
  password: "password", // Replace with your MySQL password
  database: "your_database", // Replace with your database name
});

class Product {
  // Create a new product
  static async create(product: {
    name: string;
    price: number;
    description?: string;
    quantity?: number;
    category?: string;
  }) {
    const query = `
      INSERT INTO products (name, price, description, quantity, category)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      product.name,
      product.price,
      product.description || null,
      product.quantity || null,
      product.category || null,
    ];

    const [result] = await pool.execute(query, values);
    return result;
  }

  // Fetch all products
  static async findAll(): Promise<ProductData[]> {
    const query = `
      SELECT * FROM products
    `;
    const [rows] = await pool.execute<any[]>(query); // Use 'any[]' to bypass type restrictions

    return rows as ProductData[]; // Cast result to ProductData[] type
  }

  // Fetch a product by ID
  static async findById(productId: number): Promise<ProductData | undefined> {
    const query = `
      SELECT * FROM products WHERE id = ?
    `;
    const [rows] = await pool.execute<any[]>(query, [productId]);
    return rows[0]; // Will return undefined if not found
  }

  // Update a product
  static async update(
    productId: number,
    updates: Partial<{
      name: string;
      price: number;
      description?: string;
      quantity?: number;
      category?: string;
    }>
  ) {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), productId];

    const query = `
      UPDATE products
      SET ${fields}
      WHERE id = ?
    `;

    const [result] = await pool.execute(query, values);
    return result;
  }

  // Delete a product
  static async delete(productId: number) {
    const query = `
      DELETE FROM products WHERE id = ?
    `;
    const [result] = await pool.execute(query, [productId]);
    return result;
  }
}

export default Product;
