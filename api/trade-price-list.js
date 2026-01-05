export default async function handler(req, res) {
  try {
    const BREWW_API_KEY = process.env.BREWW_API_KEY;

    const response = await fetch(
      "https://api.breww.com/products/?" +
      "page_size=200" +
      "&include_fields=quantity_in_stock_in_format,style,abv,price,type",
      {
        headers: {
          Authorization: `Bearer ${BREWW_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Breww");
    }

    const data = await response.json();

    const products = data.results.filter(
      (p) =>
        p.quantity_in_stock_in_format > 0 &&
        ["Keg", "Cask", "Multi-pack"].includes(p.type)
    );

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
