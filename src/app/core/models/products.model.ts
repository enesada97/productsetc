export class Product {
  id?: number;
  name?: string;
  price?: number;
  score?: number;
  image?: string;
  constructor(product) {
    {
      this.id=product.id||null;
      this.name=product.name||"";
      this.price=product.price||null;
      this.score=product.score||null;
      this.image=product.image||"";
    }
  }
}
